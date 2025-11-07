import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Paper, Box, Typography, Button, TextField, FormControlLabel, Checkbox, MenuItem, Stack, Avatar, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, } from '@mui/material';
import { DataGrid, type GridColDef, type GridPaginationModel } from '@mui/x-data-grid';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { useEmployees, useCompanies, useDeleteEmployee } from '../hooks/hooksemployees';
import { useEmployeesProvider  } from '../context/employeecontext';
import { getGravatarUrl, getInitials, stringToColor } from '../utils/gravatar';
import type { Employee } from '../models/index';

export default function EmployeesList() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { pageSize } = useEmployeesProvider();
  
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize,
  });
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [companyFilter, setCompanyFilter] = useState<number | ''>('');
  const [activeFilter, setActiveFilter] = useState<boolean | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [avatarErrors, setAvatarErrors] = useState<Record<number, boolean>>({});

  const { data, isLoading } = useEmployees({
    page: paginationModel.page + 1,
    pageSize: paginationModel.pageSize,
    search: search,
    companyId: companyFilter || undefined,
    active: activeFilter === null ? undefined : activeFilter,
  });

  const { data: companies } = useCompanies();
  const deleteMutation = useDeleteEmployee();

  const handleSearch = useCallback(() => {
    setSearch(searchInput);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  }, [searchInput]);

  const handleSearchKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSearch();
      }
    },
    [handleSearch]
  );

  const handleDeleteClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedEmployee) return;

    try {
      await deleteMutation.mutateAsync(selectedEmployee.id);
      enqueueSnackbar('Employee deleted successfully', { variant: 'success' });
      setDeleteDialogOpen(false);
      setSelectedEmployee(null);
    } catch (error: any) {
      enqueueSnackbar(error?.message || 'Failed to delete employee', { variant: 'error' });
    }
  };

  const handleAvatarError = (id: number) => {
    setAvatarErrors((prev) => ({ ...prev, [id]: true }));
  };

  const columns: GridColDef[] = [
    {
      field: 'avatar',
      headerName: 'Avatar',
      width: 80,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const employee = params.row as Employee;
        const initials = getInitials(employee.name);
        const gravatarUrl = getGravatarUrl(employee.email, 40);
        const hasError = avatarErrors[employee.id];

        return (
          <Avatar
            src={hasError ? undefined : gravatarUrl}
            alt={`${employee.name}`}
            sx={{
              bgcolor: hasError ? stringToColor(`${employee.name}`) : undefined,
            }}
            imgProps={{
              onError: () => handleAvatarError(employee.id),
            }}
          >
            {hasError ? initials : ''}
          </Avatar>
        );
      },
    },
    {
      field: 'fullName',
      headerName: 'Name',
      flex: 1,
      minWidth: 200,
      valueGetter: (_, row) => `${row.name}`,
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'jobTitle',
      headerName: 'Job Title',
      flex: 1,
      minWidth: 180,
    },
    {
      field: 'companyName',
      headerName: 'Company',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'phone',
      headerName: 'Phone',
      width: 140,
    },
    {
      field: 'isActive',
      headerName: 'Active',
      width: 100,
      type: 'boolean',
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <IconButton
            size="small"
            color="primary"
            onClick={() => navigate(`/employees/${params.row.id}/edit`)}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => handleDeleteClick(params.row)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Employees
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/employees/create')}
        >
          Add Employee
        </Button>
      </Stack>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
          <TextField
            label="Search"
            placeholder="Search by name, email, or job title"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleSearchKeyPress}
            size="small"
            fullWidth
          />
          <TextField
            select
            label="Company"
            value={companyFilter}
            onChange={(e) => {
              setCompanyFilter(e.target.value as number | '');
              setPaginationModel((prev) => ({ ...prev, page: 0 }));
            }}
            size="small"
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">All Companies</MenuItem>
            {companies?.map((company) => (
              <MenuItem key={company.id} value={company.id}>
                {company.companyName}
              </MenuItem>
            ))}
          </TextField>
          <FormControlLabel
            control={
              <Checkbox
                checked={activeFilter !== null}
                indeterminate={activeFilter === null}
                onChange={(e) => {
                  if (!e.target.checked) {
                    setActiveFilter(null);
                  } else if (activeFilter === null) {
                    setActiveFilter(true);
                  } else {
                    setActiveFilter(!activeFilter);
                  }
                  setPaginationModel((prev) => ({ ...prev, page: 0 }));
                }}
              />
            }
            label={activeFilter === null ? 'All' : activeFilter ? 'Active Only' : 'Inactive Only'}
          />
          <Button variant="contained" onClick={handleSearch}>
            Search
          </Button>
        </Stack>
      </Paper>

      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={data?.items || []}
          columns={columns}
          rowCount={data?.total || 0}
          loading={isLoading}
          pageSizeOptions={[10, 20, 50, 100]}
          paginationModel={paginationModel}
          paginationMode="server"
          onPaginationModelChange={setPaginationModel}
          disableRowSelectionOnClick
          sx={{
            '& .MuiDataGrid-cell:focus': {
              outline: 'none',
            },
          }}
        />
      </Paper>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete{' '}
            <strong>
              {selectedEmployee?.name}
            </strong>
            ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
