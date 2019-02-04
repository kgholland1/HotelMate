using Microsoft.EntityFrameworkCore.Migrations;

namespace EPOS.API.Migrations
{
    public partial class FixOpentimes : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Restaurant",
                table: "OpenTimes",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Restaurant",
                table: "OpenTimes");
        }
    }
}
