using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace EPOS.API.Migrations
{
    public partial class Addtaxi : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Taxis",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    BookStatus = table.Column<string>(maxLength: 20, nullable: true),
                    BookingId = table.Column<int>(nullable: false),
                    CreatedBy = table.Column<string>(nullable: false),
                    CreatedOn = table.Column<DateTime>(nullable: false),
                    Email = table.Column<string>(maxLength: 150, nullable: true),
                    GuestName = table.Column<string>(maxLength: 100, nullable: true),
                    HotelId = table.Column<int>(nullable: false),
                    IsDeleted = table.Column<bool>(maxLength: 50, nullable: false),
                    NoOfPerson = table.Column<int>(nullable: false),
                    Phone = table.Column<string>(maxLength: 30, nullable: true),
                    Request = table.Column<string>(nullable: true),
                    ResDate = table.Column<string>(maxLength: 30, nullable: true),
                    ResTime = table.Column<string>(maxLength: 30, nullable: true),
                    Response = table.Column<string>(nullable: true),
                    RoomNumber = table.Column<string>(maxLength: 50, nullable: true),
                    UpdatedBy = table.Column<string>(nullable: true),
                    UpdatedOn = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Taxis", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Taxis_Bookings_BookingId",
                        column: x => x.BookingId,
                        principalTable: "Bookings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Taxis_BookingId",
                table: "Taxis",
                column: "BookingId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Taxis");
        }
    }
}
