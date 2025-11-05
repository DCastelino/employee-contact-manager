using employee_contact_server.DBContext;
using employee_contact_server.DTOs;
using Microsoft.EntityFrameworkCore;

namespace employee_contact_server.Services
{
    public class CompanyService : ICompanyService
    {
        private readonly ApplicationDbContext _context;
        public CompanyService(ApplicationDbContext context) 
        {
            _context = context;
        }
        public async Task<List<CompanyDTO>> GetAllCompaniesAsync()
        {
            return await _context.Companies
                .OrderBy(c => c.CompanyName)
                .Select(c => new CompanyDTO 
                {
                    Id = c.Id,
                    CompanyName = c.CompanyName,
                    Domain = c.Domain,
                    Industry = c.Industry,
                    Website = c.Website
                })
                .ToListAsync();
            // do i need to paginate this guy?
        }
    }
}
