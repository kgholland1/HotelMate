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
    [Migration("20180702104232_InitialCreate")]
    partial class InitialCreate
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.0.3-rtm-10026")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

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
#pragma warning restore 612, 618
        }
    }
}
