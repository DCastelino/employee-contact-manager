using employee_contact_server.DTOs;
using employee_contact_server.Services;
using Microsoft.AspNetCore.Mvc;

namespace employee_contact_server.Controllers
{
    [ApiController]
    [Route("api/companies")]
    public class CompaniesController : ControllerBase
    {
        private readonly ILogger<CompaniesController> _logger;
        private readonly ICompanyService _companyService;
        public CompaniesController(ILogger<CompaniesController> logger, ICompanyService companyService)
        {
            _logger = logger;
            _companyService = companyService;
        }

        [HttpGet]
        public async Task<ActionResult<List<CompanyDTO>>> GetAllCompaniesAsync()
        {
            try
            {
                var companies = await _companyService.GetAllCompaniesAsync();
                return Ok(companies);
            }
            catch (Exception ex) 
            {
                _logger.LogError(ex, "Error attempting to retrieve companies");
                return BadRequest(ex.Message);
            }

        }
    }
}
