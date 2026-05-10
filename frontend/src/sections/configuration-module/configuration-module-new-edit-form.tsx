import { mutate } from 'swr';
import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { FIELD_TYPES } from 'endoscopy-shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useDebouncedSearch } from 'src/hooks/use-debounce';

import { fetcher, endpoints } from 'src/utils/axios';
import { compressImage } from 'src/utils/compressImage';

import { DashboardContent } from 'src/layouts/dashboard';
import {
  updateConfigurationModule,
  useGetConfigurationModules,
  useGetConfigurationsByModuleAndSubmodules,
} from 'src/actions/configuration-module';

import BodyCard from 'src/components/body-card';
import RHFFormField from 'src/components/form-feild';
import DoctorFormButtons from 'src/components/button-group';
import { Form, RHFUpload, RHFCheckbox } from 'src/components/hook-form';
import MasterAutoComplete from 'src/components/master-autocomplate-field';
import MasterAutoCompleteV2 from 'src/components/master-autocomplate-field-v2';

export default function ConfigurationModuleNewEditForm() {
  const [moduleData, setModuleData] = useState<any>(null);
  const router = useRouter();
  const searchModule = useDebouncedSearch();
  const searchSubModule = useDebouncedSearch();
  const { modules, subModules } = useGetConfigurationModules({
    moduleq: searchModule.debouncedQuery,
    subModuleq: searchSubModule.debouncedQuery,
  });

  const defaultValues = useMemo(
    () => ({
      configurationModuleName: null,
      subModuleName: null,
    }),
    []
  );

  const dynamicSchema = useMemo(() => {
    const shape: Record<string, any> = {
      configurationModuleName: zod.string().nullable().optional(),
      subModuleName: zod.string().nullable().optional(),
    };

    moduleData?.forEach((field: any) => {
      switch (field.fieldType) {
        case 'boolean':
          shape[field.fieldKey] = zod.boolean().optional();
          break;

        case 'select':
          if (field.meta?.isMulti) {
            shape[field.fieldKey] = zod.array(zod.string()).optional();
          } else {
            shape[field.fieldKey] = zod.string().optional();
          }
          break;

        case 'string':
          if (field.meta?.isMulti) {
            // support array of contact objects { email, mobile }
            shape[field.fieldKey] = zod
              .array(
                zod.object({
                  email: zod.string().nullable().optional(),
                  mobile: zod.string().nullable().optional(),
                })
              )
              .optional();
          } else {
            shape[field.fieldKey] = zod.string().optional();
          }
          break;

        case 'number':
          shape[field.fieldKey] = zod.coerce.number().optional();
          break;

        case 'json':
          shape[field.fieldKey] = zod.any().optional();
          break;

        default:
          shape[field.fieldKey] = zod.any().optional();
          break;
      }
    });

    return zod.object(shape);
  }, [moduleData]);

  const methods = useForm<any>({
    resolver: zodResolver(dynamicSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const configurationModuleName = watch('configurationModuleName');
  const subModuleName = watch('subModuleName');

  const { configs: fetchedModuleData } = useGetConfigurationsByModuleAndSubmodules(
    configurationModuleName,
    subModuleName
  );

  useEffect(() => {
    if (fetchedModuleData) {
      setModuleData(fetchedModuleData);
    }
  }, [fetchedModuleData]);

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  useEffect(() => {
    if (fetchedModuleData?.length) {
      const dynamicDefaults: Record<string, any> = {};

      fetchedModuleData.forEach((field: any) => {
        const value =
          field.fieldType === 'boolean'
            ? field.value === 'true' || field.value === true
            : field.value;

        dynamicDefaults[field.fieldKey] = value;
      });

      reset((prev: any) => ({
        ...prev,
        ...dynamicDefaults,
      }));
    }
  }, [fetchedModuleData, reset]);

  const onSubmit = handleSubmit(async (data) => {
    const payload = moduleData.map((field: any) => {
      const { ...rest } = field;

      return {
        ...rest,
        value: data[field.fieldKey],
        module: data.configurationModuleName,
        subModule: data.subModuleName,
      };
    });

    try {
      await updateConfigurationModule(payload);
      reset();
      mutate(
        `${endpoints.configurationModule.getBymoduleAndSubModule}?module=${configurationModuleName}&subModule=${subModuleName}`
      );
      await mutate(
        `${endpoints.configurationModule.getBymoduleAndSubModule}?module=${configurationModuleName}&subModule=${subModuleName}`,
        fetcher(
          `${endpoints.configurationModule.getBymoduleAndSubModule}?module=${configurationModuleName}&subModule=${subModuleName}`
        ),
        { revalidate: true }
      );
    } catch (error) {
      console.error('Error:', error);
    }
  });

  const handleExit = () => {
    router.push(paths.dashboard.root);
  };

  const convertToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handleDrop = useCallback(
    async (acceptedFiles: File[], fieldKey: string) => {
      const file = acceptedFiles[0];
      if (file) {
        try {
          const compressedFile = await compressImage(file);
          const base64 = await convertToBase64(compressedFile);
          setValue(fieldKey, base64, { shouldValidate: true });
        } catch (error) {
          console.error('Error processing image:', error);
        }
      }
    },
    [setValue]
  );

  return (
    <>
      <DashboardContent title="CONFIGURATION MODULE">
        <BodyCard>
          <Form methods={methods} onSubmit={onSubmit}>
            <Box
              display="grid"
              p={3}
              gridTemplateColumns={{ xs: '1fr', lg: 'repeat(2, 1fr)' }}
              gap={2}
            >
              <MasterAutoCompleteV2
                label="Configuration Module"
                name="configurationModuleName"
                noOptionsText="No Configuration Module Found"
                options={modules}
                getOptionLabel={(p: { id: number; module: string }) => p.module}
                getOptionValue={(p) => p.module}
                BoxSx={{
                  textAlign: 'left',
                }}
                InputSx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '2px',
                    height: '28px',
                    backgroundColor: '#fff',
                    color: 'black',
                  },
                  '& .MuiInputBase-input': {
                    color: 'black',
                    fontSize: '13px',
                  },
                }}
                labelSx={{ color: 'black' }}
                onSearch={(value) => searchModule.setQuery(value)}
                searchValue={searchModule.query}
                onSelectOption={(opt) => {
                  if (opt?.original) {
                    const selectedModule = opt.original.module;
                    searchModule.setQuery(selectedModule);
                  } else if (opt === null) {
                    searchModule.setQuery('');
                  }
                }}
              />
              <MasterAutoCompleteV2
                label="Sub Module"
                name="subModuleName"
                noOptionsText="No Sub Module Found"
                options={subModules}
                getOptionLabel={(p: { id: number; subModule: string }) => p.subModule}
                getOptionValue={(p) => p.subModule}
                BoxSx={{
                  textAlign: 'left',
                }}
                InputSx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '2px',
                    height: '28px',
                    backgroundColor: '#fff',
                    color: 'black',
                  },
                  '& .MuiInputBase-input': {
                    color: 'black',
                    fontSize: '13px',
                  },
                }}
                labelSx={{ color: 'black' }}
                onSearch={(value) => searchSubModule.setQuery(value)}
                searchValue={searchSubModule.query}
              />
            </Box>

            <Box
              display="grid"
              p={3}
              gridTemplateColumns={{
                xs: '1fr',
                lg: moduleData?.some((field: any) => field.fieldType === 'boolean')
                  ? 'repeat(2, 1fr)'
                  : 'repeat(1, 1fr)',
              }}
              gap={2}
              minHeight={200}
            >
              {moduleData
                ?.sort((a: any, b: any) => a.id - b.id)
                .map((field: any) => {
                  switch (field.fieldType) {
                    case FIELD_TYPES.BOOLEAN:
                      return (
                        <RHFCheckbox
                          key={field.id}
                          name={field.fieldKey}
                          label={field.fieldLabel}
                        />
                      );

                    case FIELD_TYPES.SELECT:
                      if (field.meta.isMulti) {
                        return (
                          <MasterAutoComplete
                            key={field.id}
                            name={field.fieldKey}
                            label={field.fieldLabel}
                            noOptionsText="No Options Found"
                            multiple
                            options={field.meta.options}
                            getOptionLabel={(option: { label: string; value: string }) =>
                              option?.label || ''
                            }
                            getOptionValue={(option: { label: string; value: string }) =>
                              option?.value || ''
                            }
                            BoxSx={{
                              display: 'block',
                            }}
                          />
                        );
                      }

                      return (
                        <RHFFormField
                          key={field.id}
                          name={field.fieldKey}
                          label={field.fieldLabel}
                          BoxSx={{
                            display: 'block',
                          }}
                          options={field.meta.options}
                        />
                      );

                    case FIELD_TYPES.NUMBER:
                      return (
                        <RHFFormField
                          key={field.id}
                          name={field.fieldKey}
                          label={field.fieldLabel}
                          type="number"
                          BoxSx={{
                            display: 'grid',
                            alignItems: 'center',
                            gridTemplateColumns: {
                              xs: '1fr 2fr',
                              md: '200px 2fr',
                            },
                            columnGap: 1,
                          }}
                        />
                      );

                    case FIELD_TYPES.COLOR:
                      return (
                        <RHFFormField
                          key={field.id}
                          name={field.fieldKey}
                          label={field.fieldLabel}
                          type="color"
                          BoxSx={{
                            display: 'grid',
                            alignItems: 'center',
                            gridTemplateColumns: {
                              xs: '1fr 2fr',
                              md: '200px 2fr',
                            },
                            columnGap: 1,
                          }}
                        />
                      );

                    case FIELD_TYPES.JSON:
                      return (
                        <RHFFormField
                          key={field.id}
                          name={field.fieldKey}
                          label={field.fieldLabel}
                          BoxSx={{
                            display: 'block',
                          }}
                        />
                      );

                    case FIELD_TYPES.STRING:
                      return (
                        <RHFFormField
                          key={field.id}
                          name={field.fieldKey}
                          label={field.fieldLabel}
                          BoxSx={{
                            display: 'grid',
                            alignItems: 'center',
                            gridTemplateColumns: {
                              xs: '1fr 2fr',
                              md: '200px 2fr',
                            },
                            columnGap: 1,
                          }}
                        />
                      );

                    case FIELD_TYPES.IMAGE:
                      return (
                        <RHFUpload
                          key={field.id}
                          name={field.fieldKey}
                          onDrop={(acceptedFiles) => handleDrop(acceptedFiles, field.fieldKey)}
                          maxSize={3145728}
                          helperText={
                            <Typography
                              variant="caption"
                              sx={{
                                mt: 3,
                                mx: 'auto',
                                display: 'block',
                                textAlign: 'center',
                                color: 'text.disabled',
                              }}
                            >
                              {field.fieldLabel}
                              Allowed *.jpeg, *.jpg, *.png, up to 3MB
                            </Typography>
                          }
                        />
                      );

                    default:
                      return (
                        <RHFFormField
                          key={field.id}
                          name={field.fieldKey}
                          label={field.fieldLabel}
                          BoxSx={{
                            display: 'block',
                          }}
                        />
                      );
                  }
                })}
            </Box>
          </Form>
        </BodyCard>
      </DashboardContent>
      <DoctorFormButtons
        currentPath={paths.dashboard.user.new}
        isSubmitting={isSubmitting}
        onSubmit={onSubmit}
        onExit={handleExit}
      />
    </>
  );
}
