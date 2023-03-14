import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { TextField } from '@mui/material';

// ----------------------------------------------------------------------

RHFTextField.propTypes = {
  name: PropTypes.string,
  isNumber: PropTypes.bool,
};

export default function RHFTextField({ name, isNumber, ...other }) {
  const { control, setValue } = useFormContext();

  const handleChangeNumber = (e, name) => {
    const regex = /^[0-9\b]+$/;
    if (e.target.value === "" || regex.test(e.target.value)) {
      setValue(name, e.target.value);
    }
  };

  if (isNumber) return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          onChange={(e) => handleChangeNumber(e, name)}
          value={field.value}
          error={!!error}
          helperText={error?.message}
          autoComplete={'off'}
          {...other}
        />
      )}
    />
  )

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          value={field.value}
          error={!!error}
          helperText={error?.message}
          autoComplete={'off'}
          {...other}
        />
      )}
    />
  );
}
