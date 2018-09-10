using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace EPOS.API.Migrations
{
    public partial class AddTourist : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Tourists",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Address = table.Column<string>(maxLength: 250, nullable: true),
                    Direction = table.Column<string>(maxLength: 100, nullable: false),
                    Email = table.Column<string>(maxLength: 150, nullable: true),
                    Facebook = table.Column<string>(maxLength: 100, nullable: true),
                    HotelId = table.Column<int>(nullable: false),
                    OtFriday = table.Column<string>(maxLength: 70, nullable: true),
                    OtMessage = table.Column<string>(maxLength: 150, nullable: true),
                    OtMonday = table.Column<string>(maxLength: 70, nullable: true),
                    OtSaturday = table.Column<string>(maxLength: 70, nullable: true),
                    OtSunday = table.Column<string>(maxLength: 70, nullable: true),
                    OtThursday = table.Column<string>(maxLength: 70, nullable: true),
                    OtTuesday = table.Column<string>(maxLength: 70, nullable: true),
                    OtWednesday = table.Column<string>(maxLength: 70, nullable: true),
                    Phone = table.Column<string>(maxLength: 25, nullable: true),
                    TourDesc = table.Column<string>(nullable: true),
                    TourName = table.Column<string>(maxLength: 80, nullable: false),
                    TouristType = table.Column<string>(maxLength: 30, nullable: true),
                    Website = table.Column<string>(maxLength: 150, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tourists", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Tourists_Hotels_HotelId",
                        column: x => x.HotelId,
                        principalTable: "Hotels",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Tourists_HotelId",
                table: "Tourists",
                column: "HotelId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Tourists");
        }
    }
}
