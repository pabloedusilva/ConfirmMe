using Microsoft.EntityFrameworkCore;
using ConfirmMe.Models;

namespace ConfirmMe.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Confirmation> Confirmations { get; set; }
    public DbSet<AdditionalGuest> AdditionalGuests { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configurações do User
        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("users");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Username).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Password).IsRequired().HasMaxLength(255);
            entity.Property(e => e.Email).HasMaxLength(255);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.CreatedAt)
                .HasColumnType("timestamp with time zone")
                .HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.UpdatedAt)
                .HasColumnType("timestamp with time zone")
                .HasDefaultValueSql("CURRENT_TIMESTAMP");
            
            entity.HasIndex(e => e.Username).IsUnique();
        });

        // Configurações do Confirmation
        modelBuilder.Entity<Confirmation>(entity =>
        {
            entity.ToTable("confirmations");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.MainGuestName).IsRequired().HasMaxLength(255);
            entity.Property(e => e.MainGuestAttending).HasDefaultValue(true);
            entity.Property(e => e.CreatedAt)
                .HasColumnType("timestamp with time zone")
                .HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.UpdatedAt)
                .HasColumnType("timestamp with time zone")
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            // Relacionamento com AdditionalGuests
            entity.HasMany(e => e.AdditionalGuests)
                  .WithOne(ag => ag.Confirmation)
                  .HasForeignKey(ag => ag.ConfirmationId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Configurações do AdditionalGuest
        modelBuilder.Entity<AdditionalGuest>(entity =>
        {
            entity.ToTable("additional_guests");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.GuestName).IsRequired().HasMaxLength(255);
            entity.Property(e => e.Attending).HasDefaultValue(true);
            entity.Property(e => e.CreatedAt)
                .HasColumnType("timestamp with time zone")
                .HasDefaultValueSql("CURRENT_TIMESTAMP");
        });
    }
}
