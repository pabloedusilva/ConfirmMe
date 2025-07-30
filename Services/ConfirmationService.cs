using ConfirmMe.Data;
using ConfirmMe.Models;
using ConfirmMe.Models.DTOs;
using Microsoft.EntityFrameworkCore;

namespace ConfirmMe.Services;

public interface IConfirmationService
{
    Task<ConfirmationResponseDto> CreateConfirmationAsync(ConfirmationRequestDto request);
    Task<DashboardStatsDto> GetDashboardStatsAsync();
    Task<List<ConfirmationResponseDto>> GetAllConfirmationsAsync();
}

public class ConfirmationService : IConfirmationService
{
    private readonly ApplicationDbContext _context;

    public ConfirmationService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ConfirmationResponseDto> CreateConfirmationAsync(ConfirmationRequestDto request)
    {
        var confirmation = new Confirmation
        {
            MainGuestName = request.MainGuestName.Trim(),
            MainGuestAttending = request.MainGuestAttending,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Confirmations.Add(confirmation);
        await _context.SaveChangesAsync();

        // Adicionar acompanhantes
        if (request.AdditionalGuests.Any())
        {
            var additionalGuests = request.AdditionalGuests.Select(guest => new AdditionalGuest
            {
                ConfirmationId = confirmation.Id,
                GuestName = guest.Name.Trim(),
                Attending = guest.Attending,
                CreatedAt = DateTime.UtcNow
            }).ToList();

            _context.AdditionalGuests.AddRange(additionalGuests);
            await _context.SaveChangesAsync();
        }

        return await GetConfirmationByIdAsync(confirmation.Id);
    }

    public async Task<DashboardStatsDto> GetDashboardStatsAsync()
    {
        var confirmations = await _context.Confirmations
            .Include(c => c.AdditionalGuests)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();

        var stats = new DashboardStatsDto();
        var guestsList = new List<GuestListDto>();

        foreach (var confirmation in confirmations)
        {
            // Contar convidado principal
            if (confirmation.MainGuestAttending)
            {
                stats.ConfirmedCount++;
                stats.TotalAttendingCount++;
            }
            else
                stats.DeclinedCount++;

            stats.TotalCount++;

            // Contar acompanhantes
            foreach (var guest in confirmation.AdditionalGuests)
            {
                if (guest.Attending)
                {
                    stats.ConfirmedCount++;
                    stats.TotalAttendingCount++;
                }
                else
                    stats.DeclinedCount++;

                stats.TotalCount++;
            }

            // Adicionar à lista de convidados
            guestsList.Add(new GuestListDto
            {
                Name = confirmation.MainGuestName,
                Status = confirmation.MainGuestAttending ? "confirmed" : "declined",
                AdditionalGuests = confirmation.AdditionalGuests.Select(ag => new AdditionalGuestDto
                {
                    Name = ag.GuestName,
                    Attending = ag.Attending
                }).ToList()
            });
        }

        stats.Guests = guestsList;
        return stats;
    }

    public async Task<List<ConfirmationResponseDto>> GetAllConfirmationsAsync()
    {
        var confirmations = await _context.Confirmations
            .Include(c => c.AdditionalGuests)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();

        return confirmations.Select(c => new ConfirmationResponseDto
        {
            Id = c.Id,
            MainGuestName = c.MainGuestName,
            MainGuestAttending = c.MainGuestAttending,
            CreatedAt = c.CreatedAt,
            AdditionalGuests = c.AdditionalGuests.Select(ag => new AdditionalGuestDto
            {
                Name = ag.GuestName,
                Attending = ag.Attending
            }).ToList()
        }).ToList();
    }

    private async Task<ConfirmationResponseDto> GetConfirmationByIdAsync(int id)
    {
        var confirmation = await _context.Confirmations
            .Include(c => c.AdditionalGuests)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (confirmation == null)
            throw new InvalidOperationException("Confirmação não encontrada");

        return new ConfirmationResponseDto
        {
            Id = confirmation.Id,
            MainGuestName = confirmation.MainGuestName,
            MainGuestAttending = confirmation.MainGuestAttending,
            CreatedAt = confirmation.CreatedAt,
            AdditionalGuests = confirmation.AdditionalGuests.Select(ag => new AdditionalGuestDto
            {
                Name = ag.GuestName,
                Attending = ag.Attending
            }).ToList()
        };
    }
}
