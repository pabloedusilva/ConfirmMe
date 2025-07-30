using ConfirmMe.Data;
using ConfirmMe.Models;
using ConfirmMe.Models.DTOs;
using Microsoft.EntityFrameworkCore;

namespace ConfirmMe.Services;

public interface IAuthService
{
    Task<LoginResponseDto> AuthenticateAsync(LoginRequestDto loginDto);
    Task<User?> GetUserByUsernameAsync(string username);
    Task<bool> ValidatePasswordAsync(string password, string storedPassword);
}

public class AuthService : IAuthService
{
    private readonly ApplicationDbContext _context;

    public AuthService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<LoginResponseDto> AuthenticateAsync(LoginRequestDto loginDto)
    {
        try
        {
            var user = await GetUserByUsernameAsync(loginDto.Username);
            
            if (user == null || !user.IsActive)
            {
                return new LoginResponseDto
                {
                    Success = false,
                    Message = "Usuário ou senha inválidos"
                };
            }

            var isValidPassword = await ValidatePasswordAsync(loginDto.Password, user.Password);
            
            if (!isValidPassword)
            {
                return new LoginResponseDto
                {
                    Success = false,
                    Message = "Usuário ou senha inválidos"
                };
            }

            return new LoginResponseDto
            {
                Success = true,
                Message = "Login realizado com sucesso",
                RedirectUrl = "/Home/Dashboard"
            };
        }
        catch (Exception)
        {
            return new LoginResponseDto
            {
                Success = false,
                Message = "Erro interno do servidor"
            };
        }
    }

    public async Task<User?> GetUserByUsernameAsync(string username)
    {
        return await _context.Users
            .FirstOrDefaultAsync(u => u.Username == username && u.IsActive);
    }

    public async Task<bool> ValidatePasswordAsync(string password, string storedPassword)
    {
        return await Task.FromResult(password == storedPassword);
    }
}
