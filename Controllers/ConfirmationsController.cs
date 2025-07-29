using Microsoft.AspNetCore.Mvc;
using ConfirmMe.Models.DTOs;
using ConfirmMe.Services;

namespace ConfirmMe.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ConfirmationsController : ControllerBase
{
    private readonly IConfirmationService _confirmationService;

    public ConfirmationsController(IConfirmationService confirmationService)
    {
        _confirmationService = confirmationService;
    }

    [HttpPost]
    public async Task<ActionResult<ConfirmationResponseDto>> CreateConfirmation([FromBody] ConfirmationRequestDto request)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(request.MainGuestName))
            {
                return BadRequest(new { message = "Nome do convidado é obrigatório" });
            }

            var result = await _confirmationService.CreateConfirmationAsync(request);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
        }
    }

    [HttpGet]
    public async Task<ActionResult<List<ConfirmationResponseDto>>> GetAllConfirmations()
    {
        try
        {
            var confirmations = await _confirmationService.GetAllConfirmationsAsync();
            return Ok(confirmations);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
        }
    }

    [HttpGet("dashboard")]
    public async Task<ActionResult<DashboardStatsDto>> GetDashboardStats()
    {
        try
        {
            var stats = await _confirmationService.GetDashboardStatsAsync();
            return Ok(stats);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
        }
    }
}
