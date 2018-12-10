using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(tommvc3.Startup))]
namespace tommvc3
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
