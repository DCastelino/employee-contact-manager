using System.ComponentModel.DataAnnotations;

namespace employee_contact_server.DTOs
{
    public class CreateEmployeeDTO
    {
        [Required(ErrorMessage = "Name is required")]
        [MaxLength(255, ErrorMessage = "Name cannot exceed 255 characters")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        [MaxLength(255, ErrorMessage = "Email cannot exceed 255 characters")]
        public string Email { get; set; } = string.Empty;

        [MaxLength(50, ErrorMessage = "Phone cannot exceed 50 characters")]
        [RegularExpression(@"^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$", ErrorMessage = "Invalid phone number format.")]
        public string? Phone { get; set; }

        [MaxLength(255, ErrorMessage = "Job title cannot exceed 255 characters")]
        public string? JobTitle { get; set; }

        [Required(ErrorMessage = "Company ID is required")]
        public int CompanyId { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
