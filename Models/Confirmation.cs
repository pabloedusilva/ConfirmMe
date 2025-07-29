using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ConfirmMe.Models;

[Table("confirmations")]
public class Confirmation
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Required]
    [StringLength(255)]
    [Column("main_guest_name")]
    public string MainGuestName { get; set; } = string.Empty;

    [Column("main_guest_attending")]
    public bool MainGuestAttending { get; set; } = true;

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property
    public virtual ICollection<AdditionalGuest> AdditionalGuests { get; set; } = new List<AdditionalGuest>();
}
