using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace EPOS.API.Migrations
{
    public partial class AddCatHeaders : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AppertisersInUse",
                table: "Categories");

            migrationBuilder.DropColumn(
                name: "AppertisersSubs",
                table: "Categories");

            migrationBuilder.DropColumn(
                name: "BreakfastInUse",
                table: "Categories");

            migrationBuilder.DropColumn(
                name: "BreakfastSubs",
                table: "Categories");

            migrationBuilder.DropColumn(
                name: "DessertInUse",
                table: "Categories");

            migrationBuilder.DropColumn(
                name: "DessertSubs",
                table: "Categories");

            migrationBuilder.DropColumn(
                name: "DrinksInUse",
                table: "Categories");

            migrationBuilder.DropColumn(
                name: "DrinksSubs",
                table: "Categories");

            migrationBuilder.DropColumn(
                name: "MaincourseInUse",
                table: "Categories");

            migrationBuilder.DropColumn(
                name: "MaincourseSubs",
                table: "Categories");

            migrationBuilder.DropColumn(
                name: "SaladInUse",
                table: "Categories");

            migrationBuilder.DropColumn(
                name: "SaladSubs",
                table: "Categories");

            migrationBuilder.DropColumn(
                name: "SidesInUse",
                table: "Categories");

            migrationBuilder.DropColumn(
                name: "SidesSubs",
                table: "Categories");

            migrationBuilder.AddColumn<string>(
                name: "CatName",
                table: "Categories",
                maxLength: 60,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Categories",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "HeaderName",
                table: "Categories",
                maxLength: 60,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "CatHeaders",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    HeaderName = table.Column<string>(maxLength: 60, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CatHeaders", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CatHeaders");

            migrationBuilder.DropColumn(
                name: "CatName",
                table: "Categories");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Categories");

            migrationBuilder.DropColumn(
                name: "HeaderName",
                table: "Categories");

            migrationBuilder.AddColumn<bool>(
                name: "AppertisersInUse",
                table: "Categories",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "AppertisersSubs",
                table: "Categories",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "BreakfastInUse",
                table: "Categories",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "BreakfastSubs",
                table: "Categories",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "DessertInUse",
                table: "Categories",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "DessertSubs",
                table: "Categories",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "DrinksInUse",
                table: "Categories",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "DrinksSubs",
                table: "Categories",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "MaincourseInUse",
                table: "Categories",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "MaincourseSubs",
                table: "Categories",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "SaladInUse",
                table: "Categories",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "SaladSubs",
                table: "Categories",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "SidesInUse",
                table: "Categories",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "SidesSubs",
                table: "Categories",
                nullable: false,
                defaultValue: false);
        }
    }
}
