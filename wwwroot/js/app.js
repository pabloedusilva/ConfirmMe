// Configuração da API
const API_BASE_URL = '/api/confirmations';

document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the confirmation page or dashboard
    if (document.querySelector('#guest-name')) {
        initConfirmationPage();
    } else if (document.querySelector('#guests-tbody')) {
        initDashboardPage();
    }
});

function initConfirmationPage() {
    const guestNameInput = document.getElementById('guest-name');
    const addGuestBtn = document.getElementById('add-guest-btn');
    const submitBtn = document.getElementById('submit-btn');
    const additionalGuestsContainer = document.getElementById('additional-guests');
    const successModal = document.getElementById('success-modal');
    const closeModalBtn = document.getElementById('close-modal');
    
    let guestCount = 0;
    
    // Add guest button click handler
    addGuestBtn.addEventListener('click', function() {
        guestCount++;
        const guestDiv = document.createElement('div');
        guestDiv.className = 'additional-guest';
        guestDiv.innerHTML = `
            <button class="remove-guest" aria-label="Remover acompanhante">&times;</button>
            <div class="form-group">
                <label for="guest-name-${guestCount}">Nome do acompanhante</label>
                <input type="text" id="guest-name-${guestCount}" placeholder="Nome completo" required>
            </div>
            <div class="form-group">
                <label>Este acompanhante vai comparecer?</label>
                <div class="radio-group">
                    <label class="radio-option">
                        <input type="radio" name="guest-attendance-${guestCount}" value="yes" checked>
                        <span class="radio-custom"></span>
                        Sim
                    </label>
                    <label class="radio-option">
                        <input type="radio" name="guest-attendance-${guestCount}" value="no">
                        <span class="radio-custom"></span>
                        Não
                    </label>
                </div>
            </div>
        `;
        
        additionalGuestsContainer.appendChild(guestDiv);
        
        // Add event listener to the remove button
        guestDiv.querySelector('.remove-guest').addEventListener('click', function() {
            guestDiv.remove();
        });
    });
    
    // Submit button click handler
    submitBtn.addEventListener('click', async function(e) {
        e.preventDefault();
        
        // Validate main guest name
        if (!guestNameInput.value.trim()) {
            alert('Por favor, insira seu nome completo.');
            return;
        }
        
        // Validate additional guests names
        const additionalNames = document.querySelectorAll('#additional-guests input[type="text"]');
        let allNamesValid = true;
        
        additionalNames.forEach(input => {
            if (!input.value.trim()) {
                allNamesValid = false;
                input.focus();
                return;
            }
        });
        
        if (!allNamesValid) {
            alert('Por favor, insira o nome completo de todos os acompanhantes.');
            return;
        }
        
        // Disable submit button during request
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';
        
        try {
            // Get main guest attendance
            const isAttending = document.querySelector('input[name="attendance"]:checked').value === 'yes';
            
            // Get additional guests data
            const additionalGuests = [];
            const guestElements = document.querySelectorAll('.additional-guest');
            
            guestElements.forEach(guest => {
                const name = guest.querySelector('input[type="text"]').value.trim();
                const attending = guest.querySelector('input[type="radio"]:checked').value === 'yes';
                additionalGuests.push({ name, attending });
            });
            
            // Prepare request data
            const requestData = {
                mainGuestName: guestNameInput.value.trim(),
                mainGuestAttending: isAttending,
                additionalGuests: additionalGuests
            };
            
            // Send to API
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao enviar confirmação');
            }
            
            const result = await response.json();
            
            // Show success modal
            successModal.classList.add('show');
            
            // Reset form
            guestNameInput.value = '';
            document.querySelector('input[name="attendance"][value="yes"]').checked = true;
            additionalGuestsContainer.innerHTML = '';
            guestCount = 0;
            
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao enviar confirmação: ' + error.message);
        } finally {
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.textContent = 'Confirmar';
        }
    });
    
    // Close modal button click handler
    closeModalBtn.addEventListener('click', function() {
        successModal.classList.remove('show');
    });
}

async function initDashboardPage() {
    try {
        // Load confirmations from API
        const response = await fetch(`${API_BASE_URL}/dashboard`);
        
        if (!response.ok) {
            throw new Error('Erro ao carregar dados do dashboard');
        }
        
        const data = await response.json();
        
        // Update stats
        document.getElementById('confirmed-count').textContent = data.confirmedCount;
        document.getElementById('declined-count').textContent = data.declinedCount;
        document.getElementById('total-count').textContent = data.totalCount;
        document.getElementById('total-attending-count').textContent = data.totalAttendingCount;
        
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
        alert('Erro ao carregar dados: ' + error.message);
    }
}

function renderGuestsTable(guests, filter = 'all') {
    const tbody = document.getElementById('guests-tbody');
    tbody.innerHTML = '';
    
    guests.forEach(guest => {
        // Check if we should show this guest based on filter
        if (filter === 'all' || 
            (filter === 'confirmed' && guest.status === 'confirmed') || 
            (filter === 'declined' && guest.status === 'declined')) {
            
            const row = document.createElement('tr');
            
            // Main guest cell
            const nameCell = document.createElement('td');
            nameCell.textContent = guest.name;
            row.appendChild(nameCell);
            
            // Status cell
            const statusCell = document.createElement('td');
            const statusSpan = document.createElement('span');
            statusSpan.textContent = guest.status === 'confirmed' ? 'Confirmado' : 'Não confirmado';
            statusSpan.className = guest.status === 'confirmed' ? 'status-confirmed' : 'status-declined';
            statusCell.appendChild(statusSpan);
            row.appendChild(statusCell);
            
            // Guests cell
            const guestsCell = document.createElement('td');
            if (guest.additionalGuests.length > 0) {
                const guestsList = document.createElement('ul');
                guest.additionalGuests.forEach(g => {
                    const li = document.createElement('li');
                    li.textContent = `${g.name} (${g.attending ? 'Confirmado' : 'Não confirmado'})`;
                    guestsList.appendChild(li);
                });
                guestsCell.appendChild(guestsList);
            } else {
                guestsCell.textContent = 'Nenhum';
            }
            row.appendChild(guestsCell);
            
            tbody.appendChild(row);
        }
        
        // Handle additional guests if filter applies
        if (filter === 'all') {
            guest.additionalGuests.forEach(g => {
                const row = document.createElement('tr');
                
                // Name cell (indented)
                const nameCell = document.createElement('td');
                nameCell.textContent = `↳ ${g.name}`;
                row.appendChild(nameCell);
                
                // Status cell
                const statusCell = document.createElement('td');
                const statusSpan = document.createElement('span');
                statusSpan.textContent = g.attending ? 'Confirmado' : 'Não confirmado';
                statusSpan.className = g.attending ? 'status-confirmed' : 'status-declined';
                statusCell.appendChild(statusSpan);
                row.appendChild(statusCell);
                
                // Empty cell for guests
                const emptyCell = document.createElement('td');
                emptyCell.textContent = '-';
                row.appendChild(emptyCell);
                
                tbody.appendChild(row);
            });
        } else if (filter === 'confirmed' || filter === 'declined') {
            guest.additionalGuests.forEach(g => {
                const guestStatus = g.attending ? 'confirmed' : 'declined';
                if (guestStatus === filter) {
                    const row = document.createElement('tr');
                    
                    // Name cell (indented)
                    const nameCell = document.createElement('td');
                    nameCell.textContent = `↳ ${g.name}`;
                    row.appendChild(nameCell);
                    
                    // Status cell
                    const statusCell = document.createElement('td');
                    const statusSpan = document.createElement('span');
                    statusSpan.textContent = g.attending ? 'Confirmado' : 'Não confirmado';
                    statusSpan.className = g.attending ? 'status-confirmed' : 'status-declined';
                    statusCell.appendChild(statusSpan);
                    row.appendChild(statusCell);
                    
                    // Empty cell for guests
                    const emptyCell = document.createElement('td');
                    emptyCell.textContent = '-';
                    row.appendChild(emptyCell);
                    
                    tbody.appendChild(row);
                }
            });
        }
    });
    
    // If no results, show message
    if (tbody.children.length === 0) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 3;
        cell.textContent = 'Nenhum resultado encontrado';
        cell.style.textAlign = 'center';
        cell.style.padding = '2rem';
        cell.style.color = 'var(--text-light)';
        row.appendChild(cell);
        tbody.appendChild(row);
    }
}

// Copy link functionality
function initCopyLinkFeature() {
    const copyBtn = document.getElementById('copy-link-btn');
    const linkInput = document.getElementById('page-link');
    
    if (copyBtn && linkInput) {
        copyBtn.addEventListener('click', async function() {
            try {
                // Select the text in the input
                linkInput.select();
                linkInput.setSelectionRange(0, 99999); // For mobile devices
                
                // Copy to clipboard using the modern Clipboard API
                if (navigator.clipboard && window.isSecureContext) {
                    await navigator.clipboard.writeText(linkInput.value);
                } else {
                    // Fallback for older browsers
                    document.execCommand('copy');
                }
                
                // Update button to show success
                const originalContent = copyBtn.innerHTML;
                copyBtn.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 6L9 17l-5-5"></path>
                    </svg>
                    Copiado!
                `;
                copyBtn.classList.add('copied');
                
                // Reset button after 2 seconds
                setTimeout(() => {
                    copyBtn.innerHTML = originalContent;
                    copyBtn.classList.remove('copied');
                }, 2000);
                
            } catch (err) {
                console.error('Erro ao copiar link:', err);
                // Show error feedback
                const originalContent = copyBtn.innerHTML;
                copyBtn.innerHTML = 'Erro ao copiar';
                copyBtn.style.backgroundColor = 'var(--error-color)';
                
                setTimeout(() => {
                    copyBtn.innerHTML = originalContent;
                    copyBtn.style.backgroundColor = '';
                }, 2000);
            }
        });
        
        // Allow clicking on the input to select all text
        linkInput.addEventListener('click', function() {
            this.select();
        });
    }
}

// Initialize copy link feature when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the confirmation page or dashboard
    if (document.querySelector('#guest-name')) {
        initConfirmationPage();
    } else if (document.querySelector('#guests-tbody')) {
        initDashboardPage();
        initCopyLinkFeature(); // Initialize copy link feature on dashboard
    }
});
