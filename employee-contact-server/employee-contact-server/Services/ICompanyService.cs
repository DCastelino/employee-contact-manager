using employee_contact_server.DTOs;

namespace employee_contact_server.Services
{
    public interface ICompanyService
    {
        Task<List<CompanyDTO>> GetAllCompaniesAsync();
    }
}
