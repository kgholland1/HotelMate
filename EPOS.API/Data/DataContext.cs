using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using EPOS.API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace EPOS.API.Data
{
    public class DataContext : IdentityDbContext<User, Role, int, 
        IdentityUserClaim<int>, UserRole, IdentityUserLogin<int>, 
        IdentityRoleClaim<int>, IdentityUserToken<int>>
    {
        private readonly IUserInfoService _userInfoService;

        public DbSet<Extra> Extras { get; set; }
        public DbSet<CatHeader> CatHeaders { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Menu> Menus { get; set; }
        public DbSet<Hotel> Hotels { get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Tourist> Tourists { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<Note> Notes { get; set; }  
        public DbSet<Reservation> Reservations { get; set; }   
        public DbSet<OpenTime> OpenTimes { get; set; }                                
        public DbSet<Taxi> Taxis { get; set; }    
        public DbSet<Restaurant> Restaurants { get; set; }
        public DbSet<Luggage> Luggages { get; set; }
        public DbSet<WakeUp> WakeUps { get; set; }   
        public DbSet<Notification> Notifications { get; set; }    
        public DbSet<MenuOrder> MenuOrders { get; set; }   
        public DbSet<MenuOrderDetail> MenuOrderDetails { get; set; }    
            
        public DataContext(DbContextOptions<DataContext> options, IUserInfoService userInfoService) 
        : base(options) {
            // userInfoService is a required argument
            _userInfoService = userInfoService ?? throw new ArgumentNullException(nameof(userInfoService));

        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<UserRole>(userRole => 
            {
                userRole.HasKey(ur => new {ur.UserId, ur.RoleId});

                userRole.HasOne(ur => ur.Role)
                    .WithMany(ur => ur.UserRoles)
                    .HasForeignKey(ur => ur.RoleId)
                    .IsRequired();

                userRole.HasOne(ur => ur.User)
                    .WithMany(ur => ur.UserRoles)
                    .HasForeignKey(ur => ur.UserId)
                    .IsRequired();
            });            
            modelBuilder.Entity<Category>()
                .HasMany(p => p.Menus)
                .WithOne(u => u.Category)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<MenuExtra>()
            .HasOne(m => m.Menu)
            .WithMany(u => u.MenuExtras)
            .HasForeignKey(m => m.MenuId);

            modelBuilder.Entity<MenuExtra>()
                .HasKey(t => new { t.MenuId, t.ExtraId });

            modelBuilder.Entity<MenuExtra>()
                .HasOne(pt => pt.Extra)
                .WithMany(p => p.MenuExtras)
                .HasForeignKey(pt => pt.ExtraId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Restrict);                

            modelBuilder.Entity<MenuOrder>()
                .HasMany(o => o.MenuOrderDetails)
                .WithOne(d => d.MenuOrder)
                .OnDelete(DeleteBehavior.Cascade);
        }
        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default(CancellationToken))
        {
            // get added or updated entries
            var addedOrUpdatedEntries = ChangeTracker.Entries()
                    .Where(x => (x.State == EntityState.Added || x.State == EntityState.Modified));

            // fill out the audit fields
            foreach (var entry in addedOrUpdatedEntries)
            {
                var entity = entry.Entity as AuditableEntity;

                if (entity != null)
                {
                    if (entry.State == EntityState.Added)
                    {
                        entity.CreatedBy = _userInfoService.Username;
                        entity.CreatedOn = DateTime.Now;
                    }

                    entity.UpdatedBy = _userInfoService.Username;
                    entity.UpdatedOn = DateTime.Now;
                }
            }

            return base.SaveChangesAsync(cancellationToken);
        }   
    }
}