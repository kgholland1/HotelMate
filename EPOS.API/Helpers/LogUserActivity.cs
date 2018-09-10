using System;
using System.Security.Claims;
using System.Threading.Tasks;
using EPOS.API.Data;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;

namespace EPOS.API.Helpers
{
    public class LogUserActivity : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var resultContext = await next();

            var userId = int.Parse(resultContext.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            if (userId > 0) {
                var repo = resultContext.HttpContext.RequestServices.GetService<IAuthRepository>();
                var user = await repo.GetUser(userId);
                user.LastActive = DateTime.Now;
                await repo.Save();
            }
        }
    }
}