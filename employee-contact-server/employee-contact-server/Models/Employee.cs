namespace employee_contact_server.Models
{
    public class Employee
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string JobTitle { get; set; }
        public string CompanyId { get; set; }    
        public string IsActive { get; set; }
        public int CreatedAt { get; set; }
    }
}
