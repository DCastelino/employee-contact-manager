import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {  Paper, Box, Typography, TextField, Button, Stack, MenuItem, FormControlLabel, Checkbox, Avatar, CircularProgress } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useCreateEmployee, useCompanies } from '../hooks/hooksemployees';
import { employeeSchema, type EmployeeFormData } from '../utils/validation';
import { getGravatarUrl, getInitials, stringToColor } from '../utils/gravatar';

export default function CreateEmployee() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const createMutation = useCreateEmployee();
  const { data: companies, isLoading: companiesLoading } = useCompanies();
  
  const [avatarError, setAvatarError] = useState(false);
  const [gravatarUrl, setGravatarUrl] = useState('');

  const { control, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      jobTitle: '',
      companyId: 0,
      isActive: true,
    },
  });

  const name = watch('name');
  const email = watch('email');

  // Update Gravatar URL when email changes
  useEffect(() => {
    if (email) {
      setGravatarUrl(getGravatarUrl(email, 80));
      setAvatarError(false);
    } else {
      setGravatarUrl('');
    }
  }, [email]);

  const onSubmit = async (data: EmployeeFormData) => {
    try {
      await createMutation.mutateAsync(data);
      enqueueSnackbar('Employee created successfully', { variant: 'success' });
      navigate('/');
    } catch (error: any) {
      if (error?.details?.Email) {
        enqueueSnackbar(error.details.Email[0], { variant: 'error' });
      } else {
        enqueueSnackbar(error?.message || 'Failed to create employee', { variant: 'error' });
      }
    }
  };

  if (companiesLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" mb={3}>
        Create Employee
      </Typography>

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            {/* Avatar Preview */}
            <Box display="flex" justifyContent="center">
              <Avatar
                src={avatarError ? undefined : gravatarUrl}
                alt="Employee Avatar"
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: avatarError || !gravatarUrl ? stringToColor(`${name}`) : undefined,
                }}
                imgProps={{
                  onError: () => setAvatarError(true),
                }}
              >
                {(avatarError || !gravatarUrl) && getInitials(name)}
              </Avatar>
            </Box>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Full Name"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    required
                    fullWidth
                  />
                )}
              />
            </Stack>

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  type="email"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  required
                  fullWidth
                />
              )}
            />

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Phone"
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                    fullWidth
                  />
                )}
              />

              <Controller
                name="jobTitle"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Job Title"
                    error={!!errors.jobTitle}
                    helperText={errors.jobTitle?.message}
                    fullWidth
                  />
                )}
              />
            </Stack>

            <Controller
              name="companyId"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Company"
                  error={!!errors.companyId}
                  helperText={errors.companyId?.message}
                  required
                  fullWidth
                  onChange={(e) => field.onChange(Number(e.target.value))}
                >
                  <MenuItem value={0} disabled>
                    Select a company
                  </MenuItem>
                  {companies?.map((company) => (
                    <MenuItem key={company.id} value={company.id}>
                      {company.companyName}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />

            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox {...field} checked={field.value} />}
                  label="Active"
                />
              )}
            />

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button variant="outlined" onClick={() => navigate('/')}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Employee'}
              </Button>
            </Stack>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}
