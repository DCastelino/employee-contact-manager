import {
  Paper, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Link
} from '@mui/material';
import { useCompanies } from '../hooks/hooksemployees';

export default function CompaniesList() {
  const { data: companies, isLoading } = useCompanies();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" mb={3}>
        Companies
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Domain</strong></TableCell>
              <TableCell><strong>Industry</strong></TableCell>
              <TableCell><strong>Website</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {companies?.map((company) => (
              <TableRow key={company.id} hover>
                <TableCell>{company.companyName}</TableCell>
                <TableCell>{company.domain || '-'}</TableCell>
                <TableCell>{company.industry || '-'}</TableCell>
                <TableCell>
                  {company.website ? (
                    <Link href={company.website} target="_blank" rel="noopener noreferrer">
                      {company.website}
                    </Link>
                  ) : (
                    '-'
                  )}
                </TableCell>
              </TableRow>
            ))}
            {companies?.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No companies found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
