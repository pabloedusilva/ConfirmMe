// JavaScript específico para o dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar dashboard
    initDashboard();
    
    // Configurar logout
    setupLogout();
});

async function initDashboard() {
    try {
        // Load confirmations from API
        const response = await fetch('/api/confirmations/dashboard');
        
        if (!response.ok) {
            throw new Error('Erro ao carregar dados do dashboard');
        }
        
        const data = await response.json();
        
        // Update stats
        document.getElementById('confirmed-count').textContent = data.confirmedCount;
        document.getElementById('declined-count').textContent = data.declinedCount;
        document.getElementById('total-count').textContent = data.totalCount;
        
        // Render guests table
        renderGuestsTable(data.guests);
        
        // Filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Filter guests
                const filter = this.dataset.filter;
                renderGuestsTable(data.guests, filter);
            });
        });
        
    } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
        showError('Erro ao carregar dados: ' + error.message);
    }
}

function renderGuestsTable(guests, filter = 'all') {
    const tbody = document.getElementById('guests-tbody');
    if (!tbody) return;
    
    let filteredGuests = guests;
    
    // Apply filter
    if (filter === 'confirmed') {
        filteredGuests = guests.filter(guest => guest.status === 'confirmed');
    } else if (filter === 'declined') {
        filteredGuests = guests.filter(guest => guest.status === 'declined');
    }
    
    // Clear table
    tbody.innerHTML = '';
    
    if (filteredGuests.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="no-data">Nenhum convidado encontrado</td></tr>';
        return;
    }
    
    // Render rows
    filteredGuests.forEach(guest => {
        const row = document.createElement('tr');
        
        const statusClass = guest.status === 'confirmed' ? 'confirmed' : 'declined';
        const statusText = guest.status === 'confirmed' ? 'Confirmado' : 'Não confirmado';
        const additionalGuestsText = guest.additionalGuests.length > 0 
            ? guest.additionalGuests.map(ag => ag.name).join(', ')
            : 'Nenhum';
        
        row.innerHTML = `
            <td>${escapeHtml(guest.name)}</td>
            <td><span class="status ${statusClass}">${statusText}</span></td>
            <td>${escapeHtml(additionalGuestsText)}</td>
        `;
        
        tbody.appendChild(row);
    });
}

function setupLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async function() {
            if (confirm('Tem certeza que deseja sair?')) {
                try {
                    const response = await fetch('/Auth/Logout', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    
                    const result = await response.json();
                    if (result.success) {
                        window.location.href = result.redirectUrl || '/';
                    } else {
                        showError('Erro ao fazer logout');
                    }
                } catch (error) {
                    console.error('Erro no logout:', error);
                    showError('Erro ao fazer logout');
                }
            }
        });
    }
}

function showError(message) {
    // Criar elemento de notificação se não existir
    let notification = document.getElementById('notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.className = 'notification error';
        document.body.appendChild(notification);
    }
    
    notification.textContent = message;
    notification.className = 'notification error show';
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 5000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
