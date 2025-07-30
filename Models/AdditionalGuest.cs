using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ConfirmMe.Models;

[Table("additional_guests")]
public class AdditionalGuest
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Required]
    [Column("confirmation_id")]
    public int ConfirmationId { get; set; }

    [Required]
    [StringLength(255)]
    [Column("guest_name")]
    public string GuestName { get; set; } = string.Empty;

    [Column("attending")]
    public bool Attending { get; set; } = true;

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property
    [ForeignKey("ConfirmationId")]
    public virtual Confirmation? Confirmation { get; set; }
}
