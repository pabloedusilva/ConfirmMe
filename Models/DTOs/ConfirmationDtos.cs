namespace ConfirmMe.Models.DTOs;

public class ConfirmationRequestDto
{
    public string MainGuestName { get; set; } = string.Empty;
    public bool MainGuestAttending { get; set; } = true;
    public List<AdditionalGuestDto> AdditionalGuests { get; set; } = new();
}

public class AdditionalGuestDto
{
    public string Name { get; set; } = string.Empty;
    public bool Attending { get; set; } = true;
}

public class ConfirmationResponseDto
{
    public int Id { get; set; }
    public string MainGuestName { get; set; } = string.Empty;
    public bool MainGuestAttending { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<AdditionalGuestDto> AdditionalGuests { get; set; } = new();
}

public class DashboardStatsDto
{
    public int ConfirmedCount { get; set; }
    public int DeclinedCount { get; set; }
    public int TotalCount { get; set; }
    public int TotalAttendingCount { get; set; }
    public List<GuestListDto> Guests { get; set; } = new();
}

public class GuestListDto
{
    public string Name { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public List<AdditionalGuestDto> AdditionalGuests { get; set; } = new();
}
