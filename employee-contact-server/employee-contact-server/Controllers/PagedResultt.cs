using Microsoft.EntityFrameworkCore;

namespace employee_contact_server.Controllers
{
    public class PagedResultt<T>
    {
        public int TotalCount { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);
        public List<T> Items { get; set; }
    }

    public static class QueryableExtensions
    {
        public static async Task<PagedResultt<T>> PagedResulttAsync<T>(this IQueryable<T> query, int pageNumber, int pageSize)
        {
            var totalCount = await query.CountAsync();
            var items = await query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();

            return new PagedResultt<T> { TotalCount = totalCount, PageNumber = pageNumber, PageSize = pageSize, Items = items };
        }
    }
}
