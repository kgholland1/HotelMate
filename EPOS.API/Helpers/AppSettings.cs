using System;
using Microsoft.Extensions.Configuration;

namespace EPOS.API.Helpers
{
    public class AppSettings
    {
        private readonly IConfiguration _config;
        public AppSettings(IConfiguration config)
        {
            _config = config;
        }
        public JwtSettings GetJwtSettings()
        {
            JwtSettings settings = new JwtSettings();

            settings.Key = _config["JwtSettings:key"];
            settings.Audience = _config["JwtSettings:audience"];
            settings.Issuer = _config["JwtSettings:issuer"];
            settings.MinutesToExpiration =
            Convert.ToInt32(
                _config["JwtSettings:minutesToExpiration"]);

            return settings;
        }
}
}