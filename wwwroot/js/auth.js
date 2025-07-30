document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.getElementById('logout-btn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async function() {
            if (confirm('Tem certeza que deseja sair?')) {
                try {
                    const response = await fetch('/Auth/Logout', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'RequestVerificationToken': document.querySelector('input[name="__RequestVerificationToken"]')?.value || ''
                        }
                    });

                    const result = await response.json();
                    
                    if (result.success) {
                        window.location.href = result.redirectUrl || '/';
                    } else {
                        alert('Erro ao fazer logout. Tente novamente.');
                    }
                } catch (error) {
                    console.error('Erro no logout:', error);
                    alert('Erro de conexão. Tente novamente.');
                }
            }
        });
    }
});
