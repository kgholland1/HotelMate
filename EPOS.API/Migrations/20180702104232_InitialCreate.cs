using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace EPOS.API.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Hotels",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Address1 = table.Column<string>(maxLength: 80, nullable: true),
                    Address2 = table.Column<string>(maxLength: 80, nullable: true),
                    Country = table.Column<string>(maxLength: 40, nullable: true),
                    County = table.Column<string>(maxLength: 40, nullable: true),
                    CreatedBy = table.Column<string>(nullable: false),
                    CreatedOn = table.Column<DateTime>(nullable: false),
                    Email = table.Column<string>(maxLength: 150, nullable: true),
                    History = table.Column<string>(nullable: true),
                    HotelCode = table.Column<string>(maxLength: 30, nullable: true),
                    HotelName = table.Column<string>(maxLength: 160, nullable: true),
                    Introduction = table.Column<string>(nullable: true),
                    Phone = table.Column<string>(maxLength: 25, nullable: true),
                    PostCode = table.Column<string>(maxLength: 15, nullable: true),
                    Town = table.Column<string>(maxLength: 40, nullable: true),
                    UpdatedBy = table.Column<string>(nullable: true),
                    UpdatedOn = table.Column<DateTime>(nullable: false),
                    Website = table.Column<string>(maxLength: 150, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Hotels", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Hotels");
        }
    }
}
