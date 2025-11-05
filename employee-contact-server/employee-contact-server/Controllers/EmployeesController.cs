using employee_contact_server.DTOs;
using employee_contact_server.Models;
using employee_contact_server.Services;
using Microsoft.AspNetCore.Mvc;

namespace employee_contact_server.Controllers
{
    [ApiController]
    [Route("api/employees")]
    public class EmployeesController : ControllerBase
    {

        private readonly ILogger<EmployeesController> _logger;
        private readonly IEmployeeService _employeeService;

        public EmployeesController(ILogger<EmployeesController> logger, IEmployeeService employeeService)
        {
            _logger = logger;
            _employeeService = employeeService;
        }

        [HttpGet]
        public async Task<ActionResult<PagedResultDTO<EmployeeDTO>>> GetEmployeesAsync([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string? search = null)
        {
            try
            {
                if (page < 1) page = 1;
                if (pageSize < 1) pageSize = 10;
                if (pageSize > 100) pageSize = 100;

                var result = await _employeeService.GetEmployeesAsync(page, pageSize, search);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching employees");
                return BadRequest(ex.Message);
            }
        }

        // get all employees
        // get employee by id


        // create employee
        // delete employee

        //get companies --> for company controller


    }
}
