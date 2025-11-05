using employee_contact_server.DTOs;

namespace employee_contact_server.Services
{
    public interface IEmployeeService
    {
        Task<PagedResultDTO<EmployeeDTO>> GetEmployeesAsync(int page, int pageSize, string? searchTerm);
        Task<EmployeeDTO?> GetEmployeeByIdAsync(int id);
        Task<EmployeeDTO> CreateEmployeeAsync(CreateEmployeeDTO createEmployeeDTO);
        Task<EmployeeDTO> UpdateEmployeeAsync(int id, UpdateEmployeeDTO updateEmployeeDTO);
        Task<bool> DeleteEmployeeAsync(int id);
    }
    // what t
}
