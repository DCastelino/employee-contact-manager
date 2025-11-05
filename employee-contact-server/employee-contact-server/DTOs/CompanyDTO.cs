namespace employee_contact_server.DTOs
{
    public class CompanyDTO
    {
        public int Id { get; set; }
        public string CompanyName { get; set; } = string.Empty;
        public string Domain { get; set; } = string.Empty;
        public string? Industry { get; set; }
        public string? Website { get; set; }
    }
}
