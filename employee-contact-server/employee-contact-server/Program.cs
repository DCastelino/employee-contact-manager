using employee_contact_server.DBContext;
using employee_contact_server.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new()
    {
        Title = "MAD Elevator Inc. Employee Contact Management",
        Version = "v1",
        Description = "Description",
    });
});


builder.Services.AddScoped<IEmployeeService, EmployeeService>();
builder.Services.AddScoped<ICompanyService, CompanyService>();

builder.Services.AddDbContext<ApplicationDbContext>(options => {
    options.UseSqlServer(builder.Configuration.GetConnectionString("DBConnectionString"));
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


// test endpoint
//app.MapGet("/api/test", async (ApplicationDbContext dbContext) =>
//{
//    var results = await dbContext.Employees
//        .Select(e => new {
//            e.Id,
//            e.Name
//            e.Email,
//            e.Phone,
//            e.JobTitle,
//            CompanyName = e.Company.CompanyName
//        })
//        .ToListAsync();
//    return Results.Ok(results);
//});

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
