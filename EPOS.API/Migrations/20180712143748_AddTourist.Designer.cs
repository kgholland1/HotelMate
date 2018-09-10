﻿// <auto-generated />
using EPOS.API.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.EntityFrameworkCore.Storage.Internal;
using System;

namespace EPOS.API.Migrations
{
    [DbContext(typeof(DataContext))]
    [Migration("20180712143748_AddTourist")]
    partial class AddTourist
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.0.3-rtm-10026")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("EPOS.API.Models.Category", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<bool>("AppertisersInUse");

                    b.Property<bool>("AppertisersSubs");

                    b.Property<bool>("BreakfastInUse");

                    b.Property<bool>("BreakfastSubs");

                    b.Property<bool>("DessertInUse");

                    b.Property<bool>("DessertSubs");

                    b.Property<bool>("DrinksInUse");

                    b.Property<bool>("DrinksSubs");

                    b.Property<int>("HotelId");

                    b.Property<bool>("MaincourseInUse");

                    b.Property<bool>("MaincourseSubs");

                    b.Property<bool>("SaladInUse");

                    b.Property<bool>("SaladSubs");

                    b.Property<bool>("SidesInUse");

                    b.Property<bool>("SidesSubs");

                    b.HasKey("Id");

                    b.ToTable("Categories");
                });

            modelBuilder.Entity("EPOS.API.Models.Extra", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ExtraName")
                        .IsRequired()
                        .HasMaxLength(150);

                    b.Property<string>("ExtraType")
                        .IsRequired()
                        .HasMaxLength(150);

                    b.Property<int>("HotelId");

                    b.Property<decimal>("UnitPrice");

                    b.HasKey("Id");

                    b.HasIndex("HotelId");

                    b.ToTable("Extras");
                });

            modelBuilder.Entity("EPOS.API.Models.Hotel", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Address1")
                        .HasMaxLength(80);

                    b.Property<string>("Address2")
                        .HasMaxLength(80);

                    b.Property<string>("Country")
                        .HasMaxLength(40);

                    b.Property<string>("County")
                        .HasMaxLength(40);

                    b.Property<string>("CreatedBy")
                        .IsRequired();

                    b.Property<DateTime>("CreatedOn");

                    b.Property<string>("Email")
                        .HasMaxLength(150);

                    b.Property<string>("History");

                    b.Property<string>("HotelCode")
                        .HasMaxLength(30);

                    b.Property<string>("HotelName")
                        .HasMaxLength(160);

                    b.Property<string>("Introduction");

                    b.Property<string>("Phone")
                        .HasMaxLength(25);

                    b.Property<string>("PostCode")
                        .HasMaxLength(15);

                    b.Property<string>("Town")
                        .HasMaxLength(40);

                    b.Property<string>("UpdatedBy");

                    b.Property<DateTime>("UpdatedOn");

                    b.Property<string>("Website")
                        .HasMaxLength(150);

                    b.HasKey("Id");

                    b.ToTable("Hotels");
                });

            modelBuilder.Entity("EPOS.API.Models.Photo", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("DateAdded");

                    b.Property<string>("Description")
                        .HasMaxLength(250);

                    b.Property<int>("HotelId");

                    b.Property<bool>("IsMain");

                    b.Property<string>("PhotoType")
                        .HasMaxLength(40);

                    b.Property<int>("PhotoTypeId");

                    b.Property<string>("PublicId");

                    b.Property<string>("Url")
                        .HasMaxLength(150);

                    b.HasKey("Id");

                    b.HasIndex("HotelId");

                    b.ToTable("Photos");
                });

            modelBuilder.Entity("EPOS.API.Models.RoleClaim", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ClaimType")
                        .HasMaxLength(150);

                    b.Property<string>("RoleType")
                        .HasMaxLength(60);

                    b.HasKey("Id");

                    b.ToTable("RoleClaims");
                });

            modelBuilder.Entity("EPOS.API.Models.Room", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Building")
                        .HasMaxLength(60);

                    b.Property<string>("FloorNo")
                        .HasMaxLength(40);

                    b.Property<int>("HotelId");

                    b.Property<string>("RoomDesc")
                        .HasMaxLength(300);

                    b.Property<string>("RoomNo")
                        .IsRequired()
                        .HasMaxLength(30);

                    b.HasKey("Id");

                    b.HasIndex("HotelId");

                    b.ToTable("Rooms");
                });

            modelBuilder.Entity("EPOS.API.Models.Tourist", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Address")
                        .HasMaxLength(250);

                    b.Property<string>("Direction")
                        .IsRequired()
                        .HasMaxLength(100);

                    b.Property<string>("Email")
                        .HasMaxLength(150);

                    b.Property<string>("Facebook")
                        .HasMaxLength(100);

                    b.Property<int>("HotelId");

                    b.Property<string>("OtFriday")
                        .HasMaxLength(70);

                    b.Property<string>("OtMessage")
                        .HasMaxLength(150);

                    b.Property<string>("OtMonday")
                        .HasMaxLength(70);

                    b.Property<string>("OtSaturday")
                        .HasMaxLength(70);

                    b.Property<string>("OtSunday")
                        .HasMaxLength(70);

                    b.Property<string>("OtThursday")
                        .HasMaxLength(70);

                    b.Property<string>("OtTuesday")
                        .HasMaxLength(70);

                    b.Property<string>("OtWednesday")
                        .HasMaxLength(70);

                    b.Property<string>("Phone")
                        .HasMaxLength(25);

                    b.Property<string>("TourDesc");

                    b.Property<string>("TourName")
                        .IsRequired()
                        .HasMaxLength(80);

                    b.Property<string>("TouristType")
                        .HasMaxLength(30);

                    b.Property<string>("Website")
                        .HasMaxLength(150);

                    b.HasKey("Id");

                    b.HasIndex("HotelId");

                    b.ToTable("Tourists");
                });

            modelBuilder.Entity("EPOS.API.Models.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<bool>("Active");

                    b.Property<DateTime>("Created");

                    b.Property<string>("Email")
                        .HasMaxLength(150);

                    b.Property<int>("HotelId");

                    b.Property<DateTime>("LastActive");

                    b.Property<byte[]>("PasswordHash");

                    b.Property<byte[]>("PasswordSalt");

                    b.Property<string>("Role");

                    b.Property<string>("Username")
                        .HasMaxLength(100);

                    b.HasKey("Id");

                    b.HasIndex("HotelId");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("EPOS.API.Models.UserClaim", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ClaimType")
                        .HasMaxLength(150);

                    b.Property<string>("ClaimValue")
                        .HasMaxLength(15);

                    b.Property<int>("UserId");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("UserClaims");
                });

            modelBuilder.Entity("EPOS.API.Models.Extra", b =>
                {
                    b.HasOne("EPOS.API.Models.Hotel", "hotel")
                        .WithMany("Extras")
                        .HasForeignKey("HotelId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("EPOS.API.Models.Photo", b =>
                {
                    b.HasOne("EPOS.API.Models.Hotel", "hotel")
                        .WithMany("Photos")
                        .HasForeignKey("HotelId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("EPOS.API.Models.Room", b =>
                {
                    b.HasOne("EPOS.API.Models.Hotel", "hotel")
                        .WithMany()
                        .HasForeignKey("HotelId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("EPOS.API.Models.Tourist", b =>
                {
                    b.HasOne("EPOS.API.Models.Hotel", "hotel")
                        .WithMany()
                        .HasForeignKey("HotelId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("EPOS.API.Models.User", b =>
                {
                    b.HasOne("EPOS.API.Models.Hotel", "hotel")
                        .WithMany("Users")
                        .HasForeignKey("HotelId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("EPOS.API.Models.UserClaim", b =>
                {
                    b.HasOne("EPOS.API.Models.User")
                        .WithMany("Claims")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });
#pragma warning restore 612, 618
        }
    }
}
