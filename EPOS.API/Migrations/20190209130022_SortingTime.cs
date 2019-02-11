using Microsoft.EntityFrameworkCore.Migrations;

namespace EPOS.API.Migrations
{
    public partial class SortingTime : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "SortingTime",
                table: "Taxis",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SortingTime",
                table: "MenuOrders",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SortingTime",
                table: "Luggages",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SortingTime",
                table: "Taxis");

            migrationBuilder.DropColumn(
                name: "SortingTime",
                table: "MenuOrders");

            migrationBuilder.DropColumn(
                name: "SortingTime",
                table: "Luggages");
        }
    }
}
