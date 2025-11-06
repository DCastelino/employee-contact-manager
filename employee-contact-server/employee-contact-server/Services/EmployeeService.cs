using employee_contact_server.DBContext;
using employee_contact_server.DTOs;
using employee_contact_server.Models;
using Microsoft.EntityFrameworkCore;
using System.Net.Http.Headers;

namespace employee_contact_server.Services
{
    public class EmployeeService : IEmployeeService
    {
        private readonly ApplicationDbContext _context;
        public EmployeeService(ApplicationDbContext context) 
        {
            _context = context;
        }

        public async Task<EmployeeDTO> CreateEmployeeAsync(CreateEmployeeDTO createEmployeeDTO)
        {
            var existingEmployee = await _context.Employees
                .FirstOrDefaultAsync(e => e.Email == createEmployeeDTO.Email);

            // check if employee already exists
            if (existingEmployee != null)
                throw new Exception("Employee exists!");

            var existingCompany = await _context.Companies.AnyAsync(e => e.Id == createEmployeeDTO.CompanyId);
            // validate that it's a valid companuy
            if (!existingCompany)
                throw new Exception("Company doesn't exist!");

            var employee = new Employee
            {
                Name = createEmployeeDTO.Name,
                Email = createEmployeeDTO.Email,
                Phone = createEmployeeDTO.Phone,
                JobTitle = createEmployeeDTO.JobTitle,
                CompanyId = createEmployeeDTO.CompanyId,
                IsActive = createEmployeeDTO.IsActive,
                CreatedAt = DateTime.UtcNow
            };

            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();

            await _context.Entry(employee).Reference(e => e.Company).LoadAsync();

            return new EmployeeDTO
            {
                Id = employee.Id,
                Name = employee.Name,
                Email = employee.Email,
                Phone = employee.Phone,
                JobTitle = employee.JobTitle,
                CompanyId = employee.CompanyId,
                CompanyName = employee.Company?.CompanyName,
                IsActive = employee.IsActive,
                CreatedAt = employee.CreatedAt
            };
        }

        public async Task<bool> DeleteEmployeeAsync(int id)
        {
            var employee = await _context.Employees.FindAsync(id);

            if (employee == null)
                return false;

            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<EmployeeDTO?> GetEmployeeByIdAsync(int id)
        {
            var employee = await _context.Employees
                .Include(e => e.Company)
                .FirstOrDefaultAsync(e => e.Id == id);

            if (employee == null)
                return null;

            return new EmployeeDTO
            {
                Id = employee.Id,
                Name = employee.Name,
                Email = employee.Email,
                Phone = employee.Phone,
                JobTitle = employee.JobTitle,
                CompanyId   = employee.CompanyId,
                CompanyName = employee.Company?.CompanyName,
                IsActive = employee.IsActive,
                CreatedAt = employee.CreatedAt
            };
        }

        public async Task<PagedResultDTO<EmployeeDTO>> GetEmployeesAsync(int page, int pageSize, string? searchTerm)
        {
            var query = _context.Employees
                .Include(c => c.Company)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                searchTerm = searchTerm.ToLower();
                query = query.Where(e =>
                    e.Name.ToLower().Contains(searchTerm) ||
                    e.Email.ToLower().Contains(searchTerm) ||
                    (e.JobTitle != null && e.JobTitle.ToLower().Contains(searchTerm)) ||
                    (e.Company != null && e.Company.CompanyName.ToLower().Contains(searchTerm))
                );
            }

            var totalCount = await query.CountAsync();


            var employees = await query
                .OrderByDescending(e => e.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(e => new EmployeeDTO
                {
                    Id = e.Id,
                    Name = e.Name,
                    Email = e.Email,
                    Phone = e.Phone,
                    JobTitle = e.JobTitle,
                    CompanyId = e.CompanyId,
                    CompanyName = e.Company != null ? e.Company.CompanyName : null,
                    IsActive = e.IsActive,
                    CreatedAt = e.CreatedAt
                })
                .ToListAsync();

            return new PagedResultDTO<EmployeeDTO>
            {
                Items = employees,
                TotalCount = totalCount,
                PageNumber = page,
                PageSize = pageSize
            };
        }

        public async Task<EmployeeDTO> UpdateEmployeeAsync(int id, UpdateEmployeeDTO updateEmployeeDTO)
        {
            var employee = await _context.Employees
                .Include(e => e.Company)
                .FirstOrDefaultAsync(e => e.Id == id);

            if (employee == null)
                return null;


            // check if email is updated, and exists for other user in system
            if (employee.Email != updateEmployeeDTO.Email)
            {
                var existingEmployee = await _context.Employees
                    .FirstOrDefaultAsync(e => e.Email == updateEmployeeDTO.Email && e.Id != id);

                if (existingEmployee != null)
                    throw new Exception("Email already exists for another user");
            }

            if (employee.CompanyId != updateEmployeeDTO.CompanyId) 
            { 
                var companyExists = await _context.Companies.AnyAsync(c => c.Id == updateEmployeeDTO.CompanyId);
                if (!companyExists)
                    throw new Exception("Company to update does not exist");
            }

            employee.Name = updateEmployeeDTO.Name;
            employee.Email = updateEmployeeDTO.Email;
            employee.Phone = updateEmployeeDTO.Phone;
            employee.JobTitle = updateEmployeeDTO.JobTitle;
            employee.CompanyId = updateEmployeeDTO.CompanyId;
            employee.IsActive = updateEmployeeDTO.IsActive;

            await _context.SaveChangesAsync();

            // update company id in entity 
            if (employee.Company?.Id != updateEmployeeDTO.CompanyId)
            {
                await _context.Entry(employee).Reference(e => e.Company).LoadAsync();
            }

            return new EmployeeDTO 
            {
                Id = employee.Id,
                Name = employee.Name,
                Email = employee.Email,
                Phone = employee.Phone,
                JobTitle = employee.JobTitle,
                CompanyId = employee.CompanyId,
                CompanyName = employee.Company?.CompanyName,
                IsActive = employee.IsActive,
                CreatedAt = employee.CreatedAt
            };

        }
    }
}
