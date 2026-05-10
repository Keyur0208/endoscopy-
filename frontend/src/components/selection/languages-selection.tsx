import { useState } from 'react';
import { LanguageType } from 'endoscopy-shared';
import { useController, useFormContext } from 'react-hook-form';

import { Box, Modal, Button, Typography } from '@mui/material';

import RHFFormField from '../form-feild';

type LanguagesSelectionFieldProps = {
  name: string;
  label: string;
  isdisable?: boolean;
  fullWidth?: boolean;
  useButtons?: boolean; // Add a prop to toggle UI
  BoxSx?: object;
};

// Convert string options to an array of objects with 'label' and 'value' properties
export const LANGUAGE_OPTIONS = Object.values(LanguageType).map((option) => ({
  label: option,
  value: option,
}));

const TRANSLATED_TEXT = {
  English: {
    title: 'Patient IPD Feedback Form',
    name: 'Name',
    ipdNo: 'IPD No',
    bedNo: 'Bed No',
  },
  Hindi: {
    title: 'रोगी आईपीडी फीडबैक फॉर्म',
    name: 'नाम',
    ipdNo: 'आईपीडी नंबर',
    bedNo: 'बेड नंबर',
  },
  Gujarati: {
    title: 'રોગી IPD ફીડબેક ફોર્મ',
    name: 'નામ',
    ipdNo: 'IPD નંબર',
    bedNo: 'બેડ નંબર',
  },
} as const;

export function LanguagesSelectionField({
  name,
  label,
  fullWidth = false,
  useButtons = false,
  BoxSx,
  isdisable,
}: LanguagesSelectionFieldProps) {
  const { control, getValues } = useFormContext();
  const { field } = useController({ name, control });
  const [open, setOpen] = useState(false);

  // Open Modal on Button Click
  const handleLanguageChange = (value: string) => {
    field.onChange(value);
    setOpen(true);
  };
  const selectedLang =
    TRANSLATED_TEXT[field.value as keyof typeof TRANSLATED_TEXT] || TRANSLATED_TEXT.English;
  // Get patient details
  const patientName = getValues('name') || 'N/A';
  const patientIpdNo = getValues('ipdNo') || 'N/A';
  const patientBedNo = getValues('bedNo') || 'N/A';

  return (
    <>
      {useButtons ? (
        <Box
          display="grid"
          gridTemplateColumns={{ xs: '1fr', lg: 'repeat(3, 1fr)' }}
          gap={2}
          mb={2}
        >
          {LANGUAGE_OPTIONS.map((data) => (
            <Button
              key={data.value}
              variant={field.value === data.value ? 'contained' : 'outlined'}
              onClick={() => handleLanguageChange(data.value)}
              sx={{
                textTransform: 'uppercase',
                backgroundColor: field.value === data.value ? '#1A3B6E' : 'white',
                color: field.value === data.value ? 'white' : '#1A3B6E',
                borderColor: '#1A3B6E',
                fontWeight: 'bold',
                fontSize: '12px',
                px: 2,
                height: '35px',
                borderRadius: '6px',
                '&:hover': {
                  backgroundColor: '#1A3B6E',
                  color: 'white',
                },
              }}
            >
              {data.label}
            </Button>
          ))}
        </Box>
      ) : (
        <RHFFormField
          label={label}
          name={name}
          options={LANGUAGE_OPTIONS}
          fullWidth={fullWidth}
          isdisable={isdisable}
          BoxSx={BoxSx}
        />
      )}

      {/* Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            textAlign: 'center',
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            {selectedLang.title}
          </Typography>

          {/* Display Patient Details with Translated Labels */}
          <Typography variant="body1">
            {selectedLang.name}: {patientName}
          </Typography>
          <Typography variant="body1">
            {selectedLang.ipdNo}: {patientIpdNo}
          </Typography>
          <Typography variant="body1">
            {selectedLang.bedNo}: {patientBedNo}
          </Typography>

          <Button variant="contained" sx={{ mt: 2 }} onClick={() => window.print()}>
            Print
          </Button>
          <Button variant="outlined" sx={{ mt: 2, ml: 2 }} onClick={() => setOpen(false)}>
            Close
          </Button>
        </Box>
      </Modal>
    </>
  );
}
