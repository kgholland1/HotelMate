using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace EPOS.API.Migrations
{
    public partial class Orders : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MenuOrders",
                columns: table => new
                {
                    CreatedOn = table.Column<DateTime>(nullable: false),
                    CreatedBy = table.Column<string>(nullable: false),
                    UpdatedOn = table.Column<DateTime>(nullable: false),
                    UpdatedBy = table.Column<string>(nullable: true),
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    GuestName = table.Column<string>(nullable: true),
                    Email = table.Column<string>(nullable: true),
                    Phone = table.Column<string>(nullable: true),
                    RoomNumber = table.Column<string>(nullable: true),
                    OrderStatus = table.Column<string>(maxLength: 30, nullable: false),
                    OrderDate = table.Column<string>(maxLength: 20, nullable: false),
                    OrderTime = table.Column<string>(maxLength: 30, nullable: false),
                    IsDeleted = table.Column<bool>(nullable: false),
                    Request = table.Column<string>(nullable: true),
                    Response = table.Column<string>(nullable: true),
                    Total = table.Column<decimal>(type: "decimal(10, 2)", nullable: false),
                    Paid = table.Column<bool>(nullable: false),
                    PaymentMethod = table.Column<string>(nullable: true),
                    Discount = table.Column<decimal>(type: "decimal(10, 2)", nullable: false),
                    PromotionCode = table.Column<string>(nullable: true),
                    PaymentSurcharge = table.Column<decimal>(type: "decimal(10, 2)", nullable: false),
                    PaymentGatewayID = table.Column<string>(nullable: true),
                    BookingId = table.Column<int>(nullable: false),
                    HotelId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MenuOrders", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MenuOrders_Bookings_BookingId",
                        column: x => x.BookingId,
                        principalTable: "Bookings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MenuOrderDetails",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    MenuOrderId = table.Column<int>(nullable: false),
                    MenuID = table.Column<int>(nullable: false),
                    MenuName = table.Column<string>(nullable: true),
                    Price = table.Column<decimal>(type: "decimal(10, 2)", nullable: false),
                    DishRequest = table.Column<string>(nullable: true),
                    MenuCount = table.Column<int>(nullable: false),
                    Options = table.Column<string>(nullable: true),
                    Extras = table.Column<string>(nullable: true),
                    OptionKeys = table.Column<string>(nullable: true),
                    ExtraKeys = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MenuOrderDetails", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MenuOrderDetails_MenuOrders_MenuOrderId",
                        column: x => x.MenuOrderId,
                        principalTable: "MenuOrders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MenuOrderDetails_MenuOrderId",
                table: "MenuOrderDetails",
                column: "MenuOrderId");

            migrationBuilder.CreateIndex(
                name: "IX_MenuOrders_BookingId",
                table: "MenuOrders",
                column: "BookingId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MenuOrderDetails");

            migrationBuilder.DropTable(
                name: "MenuOrders");
        }
    }
}
