using Microsoft.EntityFrameworkCore.Migrations;

namespace EPOS.API.Migrations
{
    public partial class MenuExtraFix : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ExtraName",
                table: "MenuExtra",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ExtraType",
                table: "MenuExtra",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "UnitPrice",
                table: "MenuExtra",
                type: "decimal(10, 2)",
                nullable: false,
                defaultValue: 0m);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ExtraName",
                table: "MenuExtra");

            migrationBuilder.DropColumn(
                name: "ExtraType",
                table: "MenuExtra");

            migrationBuilder.DropColumn(
                name: "UnitPrice",
                table: "MenuExtra");
        }
    }
}
