using System;
using System.Collections.Generic;

namespace employee_contact_server.Models;

public partial class Company
{
    public int Id { get; set; }

    public string CompanyName { get; set; } = null!;

    public string Domain { get; set; } = null!;

    public string? Industry { get; set; }

    public string? Website { get; set; }

    public virtual ICollection<Employee> Employees { get; set; } = new List<Employee>();
}
