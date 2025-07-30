document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const loginForm = document.getElementById('login-form');
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('login-password');
    const errorMessage = document.getElementById('error-message');
    const submitBtn = loginForm.querySelector('.auth-btn');

    // Função para mostrar/ocultar senha
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            const icon = this.querySelector('i');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    }

    // Função para mostrar erro
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        loginForm.classList.add('shake');
        
        setTimeout(() => {
            loginForm.classList.remove('shake');
        }, 500);
    }

    // Função para ocultar erro
    function hideError() {
        errorMessage.style.display = 'none';
    }

    // Função para desabilitar/habilitar botão
    function setSubmitButtonState(disabled, text) {
        submitBtn.disabled = disabled;
        const icon = submitBtn.querySelector('i');
        const originalText = submitBtn.innerHTML;
        
        if (disabled) {
            submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${text}`;
            submitBtn.style.opacity = '0.7';
        } else {
            submitBtn.innerHTML = originalText;
            submitBtn.style.opacity = '1';
        }
    }

    // Validação e envio do formulário
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        hideError();

        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value;
        const rememberMe = document.getElementById('remember-me').checked;

        // Validações básicas
        if (!username || !password) {
            showError('Por favor, preencha todos os campos');
            return;
        }

        if (username.length < 3) {
            showError('Nome de usuário deve ter pelo menos 3 caracteres');
            return;
        }

        if (password.length < 6) {
            showError('Senha deve ter pelo menos 6 caracteres');
            return;
        }

        // Preparar dados para envio
        const loginData = {
            username: username,
            password: password,
            rememberMe: rememberMe
        };

        try {
            setSubmitButtonState(true, 'Entrando...');

            const response = await fetch('/Auth/Login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'RequestVerificationToken': document.querySelector('input[name="__RequestVerificationToken"]')?.value || ''
                },
                body: JSON.stringify(loginData)
            });

            const result = await response.json();

            if (result.success) {
                // Login bem-sucedido
                setSubmitButtonState(true, 'Redirecionando...');
                
                // Pequeno delay para melhor UX
                setTimeout(() => {
                    window.location.href = result.redirectUrl || '/Home/Dashboard';
                }, 500);
            } else {
                // Erro no login
                showError(result.message || 'Erro ao fazer login');
                setSubmitButtonState(false, 'Entrar');
            }
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            showError('Erro de conexão. Tente novamente.');
            setSubmitButtonState(false, 'Entrar');
        }
    });

    // Limpar erro quando usuário começar a digitar
    const inputs = loginForm.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', hideError);
    });

    // Focar no primeiro campo
    const firstInput = document.getElementById('login-username');
    if (firstInput) {
        firstInput.focus();
    }
});
