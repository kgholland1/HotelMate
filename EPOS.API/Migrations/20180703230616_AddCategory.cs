using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace EPOS.API.Migrations
{
    public partial class AddCategory : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Categories",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    AppertisersInUse = table.Column<bool>(nullable: false),
                    AppertisersSubs = table.Column<bool>(nullable: false),
                    BreakfastInUse = table.Column<bool>(nullable: false),
                    BreakfastSubs = table.Column<bool>(nullable: false),
                    DessertInUse = table.Column<bool>(nullable: false),
                    DessertSubs = table.Column<bool>(nullable: false),
                    DrinksInUse = table.Column<bool>(nullable: false),
                    DrinksSubs = table.Column<bool>(nullable: false),
                    HotelId = table.Column<int>(nullable: false),
                    MaincourseInUse = table.Column<bool>(nullable: false),
                    MaincourseSubs = table.Column<bool>(nullable: false),
                    SaladInUse = table.Column<bool>(nullable: false),
                    SaladSubs = table.Column<bool>(nullable: false),
                    SidesInUse = table.Column<bool>(nullable: false),
                    SidesSubs = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categories", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Categories");
        }
    }
}
