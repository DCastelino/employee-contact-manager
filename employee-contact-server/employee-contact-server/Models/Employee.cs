using System;
using System.Collections.Generic;

namespace employee_contact_server.Models;

public partial class Employee
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string? Phone { get; set; }

    public string? JobTitle { get; set; }

    public int CompanyId { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? CreatedAt { get; set; }

    public bool Deleted { get; set; } = false;

    public virtual Company Company { get; set; } = null!;
}
