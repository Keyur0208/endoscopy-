import React, { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { Box, FormLabel, TextField, Autocomplete } from '@mui/material';

export type Department = {
  id: number;
  departmentName: string;
};

interface DepartmentAutoCompleteProps {
  name: string;
  label?: string;
  departments: Department[];
  isDisable?: boolean;
}

const DepartmentAutoComplete: React.FC<DepartmentAutoCompleteProps> = ({
  name,
  label,
  departments,
  isDisable = false,
}) => {
  const { control, setValue } = useFormContext();
  const [inputValue, setInputValue] = useState('');
  const [open, setOpen] = useState(false);

  const options = departments.map((d) => ({
    id: d.id,
    label: d.departmentName,
  }));

  const isOnlySpaces = inputValue.trim().length === 0 && inputValue.length > 0;

  const filteredOptions = isOnlySpaces
    ? options
    : options.filter((option) => option.label.toLowerCase().includes(inputValue.toLowerCase()));

  const showOptions = isOnlySpaces || inputValue.length > 0;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const selectedOption = options.find((opt) => opt.id === field.value) || null;

        return (
          <Autocomplete
            value={selectedOption}
            options={filteredOptions}
            disabled={isDisable}
            disablePortal={false}
            autoHighlight
            popupIcon={null}
            open={open && showOptions}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            noOptionsText="No Department Found"
            onChange={(_, selected) => {
              if (selected) {
                setValue(name, selected.id);
                setInputValue(selected.label);
              } else {
                setValue(name, undefined);
                setInputValue('');
              }
            }}
            inputValue={selectedOption && !inputValue ? selectedOption.label : inputValue}
            onInputChange={(_, value, reason) => {
              if (reason === 'input') {
                setInputValue(value);
                if (value === '') {
                  setValue(name, undefined);
                }
              }
              if (reason !== 'reset') {
                setOpen(true);
              }
            }}
            renderInput={(params) => (
              <Box
                sx={{
                  display: {
                    xs: 'block',
                    md: 'grid',
                  },
                  alignItems: 'center',
                  gridTemplateColumns: {
                    xs: '1fr 2fr',
                    sm: '110px 1fr',
                  },
                  gap: 1,
                  columnGap: 1,
                }}
              >
                <FormLabel sx={{ fontSize: '13px', whiteSpace: 'nowrap' }}>{label}</FormLabel>
                <TextField
                  {...params}
                  disabled={isDisable}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '2px',
                      height: '28px',
                    },
                  }}
                />
              </Box>
            )}
          />
        );
      }}
    />
  );
};

export default DepartmentAutoComplete;
