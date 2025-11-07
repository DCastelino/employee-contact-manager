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


        /// <summary>
        /// Creates the employee, validating the input data handling errors appropriately.
        /// </summary>
        /// <param name="createDto"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult<EmployeeDTO>> CreateEmployee([FromBody] CreateEmployeeDTO createDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var employee = await _employeeService.CreateEmployeeAsync(createDto);
                return Ok(employee);


            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error attempting to create employee");
                return BadRequest(ex.Message);
            }
        }


        /// <summary>
        /// Gets the employee with the corresponding id.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<EmployeeDTO>> GetEmployeeByIdAsync(int id)
        {
            try
            {
                var employee = await _employeeService.GetEmployeeByIdAsync(id);

                if (employee == null)
                    return NotFound(new { message = $"Employee with {id} not found" });

                return Ok(employee);

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error finding employee with Id: {id}");
                return BadRequest(ex.Message);
            }
        }

        /// <summary>
        /// Updates the employee's id with the given data verifies if the email and company id are valid.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="updateEmployeeDTO"></param>
        /// <returns></returns>
        [HttpPut("{id}")]
        public async Task<ActionResult<EmployeeDTO>> UpdateEmployee(int id, [FromBody] UpdateEmployeeDTO updateEmployeeDTO)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var employee = await _employeeService.UpdateEmployeeAsync(id, updateEmployeeDTO);

                if (employee == null)
                    return NotFound();

                return Ok(employee);
            }
            catch (Exception ex)
            {

                _logger.LogError(ex, $"Error attempting to update employee with id: {id}");
                return BadRequest(ex.Message);
            }
        }


        /// <summary>
        /// Deletes the employee with the given id.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            try
            {
                var result = await _employeeService.DeleteEmployeeAsync(id);
                if (!result)
                    return NotFound();

                return NoContent();
            }
            catch (Exception ex)
            {

                _logger.LogError(ex, $"Error deleting employee with Id: {id}");
                return BadRequest(ex.Message);
            }
        }
    }
}
