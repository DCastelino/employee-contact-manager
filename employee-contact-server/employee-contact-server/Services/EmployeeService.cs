using employee_contact_server.DBContext;
using employee_contact_server.DTOs;
using Microsoft.EntityFrameworkCore;

namespace employee_contact_server.Services
{
    public class EmployeeService : IEmployeeService
    {
        private readonly ApplicationDbContext _context;
        public EmployeeService(ApplicationDbContext context) 
        {
            _context = context;
        }

        public Task<EmployeeDTO> CreateEmployeeAsync(CreateEmployeeDTO createEmployeeDTO)
        {
            throw new NotImplementedException();
        }

        public Task<bool> DeleteEmployeeAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<EmployeeDTO?> GetEmployeeByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<PagedResultDTO<EmployeeDTO>> GetEmployeesAsync(int page, int pageSize, string? searchTerm)
        {
            var query = _context.Employees
                .Include(c => c.Company)
                .AsQueryable();


            throw new NotImplementedException();
        }

        public Task<EmployeeDTO> UpdateEmployeeAsync(int id, UpdateEmployeeDTO updateEmployeeDTO)
        {
            throw new NotImplementedException();
        }
    }
}
