import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Paper, Box, Typography, TextField, Button, Stack, MenuItem, FormControlLabel, Checkbox, Avatar, CircularProgress, Alert } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useEmployee, useUpdateEmployee, useCompanies } from '../hooks/hooksemployees';
import { employeeSchema, type EmployeeFormData } from '../utils/validation';
import { getGravatarUrl, getInitials, stringToColor } from '../utils/gravatar';

export default function EditEmployee() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const updateMutation = useUpdateEmployee();
  
  const { data: employee, isLoading: employeeLoading } = useEmployee(Number(id));
  const { data: companies, isLoading: companiesLoading } = useCompanies();
  
  const [avatarError, setAvatarError] = useState(false);
  const [gravatarUrl, setGravatarUrl] = useState('');

  const { control, handleSubmit, watch, reset, formState: { errors, isSubmitting } } = useForm<EmployeeFormData>({
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

  // Reset form when employee data is loaded
  useEffect(() => {
    if (employee) {
      reset({
        name: employee.name,
        email: employee.email,
        phone: employee.phone || '',
        jobTitle: employee.jobTitle || '',
        companyId: employee.companyId,
        isActive: employee.isActive,
      });
    }
  }, [employee, reset]);

  // updating gravatar on email change
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
      await updateMutation.mutateAsync({ id: Number(id), employee: data });
      enqueueSnackbar('Employee updated successfully', { variant: 'success' });
      navigate('/');
    } catch (error: any) {
      if (error?.details?.Email) {
        enqueueSnackbar(error.details.Email[0], { variant: 'error' });
      } else {
        enqueueSnackbar(error?.message || 'Failed to update employee', { variant: 'error' });
      }
    }
  };

  if (employeeLoading || companiesLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!employee) {
    return (
      <Box>
        <Alert severity="error">Employee not found</Alert>
        <Button sx={{ mt: 2 }} variant="outlined" onClick={() => navigate('/')}>
          Back to List
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" mb={3}>
        Edit Employee
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
                {isSubmitting ? 'Updating...' : 'Update Employee'}
              </Button>
            </Stack>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}
