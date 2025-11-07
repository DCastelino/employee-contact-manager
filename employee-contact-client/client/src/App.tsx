import { Routes, Route, Navigate } from 'react-router-dom';
import { Container, AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import EmployeesList from './pages/EmployeesList';
import CreateEmployee from './pages/CreateEmployee';
import EditEmployee from './pages/EditEmployee';
import CompaniesList from './pages/CompaniesList';

function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Employee Management System
          </Typography>
          <Button color="inherit" component={RouterLink} to="/">
            Employees
          </Button>
          <Button color="inherit" component={RouterLink} to="/companies">
            Companies
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Routes>
          <Route path="/" element={<EmployeesList />} />
          <Route path="/employees/create" element={<CreateEmployee />} />
          <Route path="/employees/:id/edit" element={<EditEmployee />} />
          <Route path="/companies" element={<CompaniesList />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Container>
    </Box>
  );
}

export default App;
