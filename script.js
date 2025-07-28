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
    submitBtn.addEventListener('click', function(e) {
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
        
        // Get main guest attendance
        const isAttending = document.querySelector('input[name="attendance"]:checked').value === 'yes';
        
        // Get additional guests data
        const additionalGuests = [];
        const guestElements = document.querySelectorAll('.additional-guest');
        
        guestElements.forEach(guest => {
            const name = guest.querySelector('input[type="text"]').value;
            const attending = guest.querySelector('input[type="radio"]:checked').value === 'yes';
            additionalGuests.push({ name, attending });
        });
        
        // Save to localStorage (in a real app, you would send to a server)
        const confirmation = {
            mainGuest: {
                name: guestNameInput.value.trim(),
                attending: isAttending
            },
            additionalGuests: additionalGuests,
            timestamp: new Date().toISOString()
        };
        
        // Get existing confirmations or initialize empty array
        const existingConfirmations = JSON.parse(localStorage.getItem('partyConfirmations')) || [];
        existingConfirmations.push(confirmation);
        localStorage.setItem('partyConfirmations', JSON.stringify(existingConfirmations));
        
        // Show success modal
        successModal.classList.add('show');
        
        // Reset form
        guestNameInput.value = '';
        document.querySelector('input[name="attendance"][value="yes"]').checked = true;
        additionalGuestsContainer.innerHTML = '';
        guestCount = 0;
    });
    
    // Close modal button click handler
    closeModalBtn.addEventListener('click', function() {
        successModal.classList.remove('show');
    });
}

function initDashboardPage() {
    // Load confirmations from localStorage
    const confirmations = JSON.parse(localStorage.getItem('partyConfirmations')) || [];
    
    // Calculate stats
    let confirmedCount = 0;
    let declinedCount = 0;
    let totalGuests = 0;
    
    const guestsList = [];
    
    confirmations.forEach(confirmation => {
        // Main guest
        const mainGuestStatus = confirmation.mainGuest.attending ? 'confirmed' : 'declined';
        guestsList.push({
            name: confirmation.mainGuest.name,
            status: mainGuestStatus,
            guests: []
        });
        
        if (confirmation.mainGuest.attending) {
            confirmedCount++;
        } else {
            declinedCount++;
        }
        totalGuests++;
        
        // Additional guests
        confirmation.additionalGuests.forEach(guest => {
            const guestStatus = guest.attending ? 'confirmed' : 'declined';
            guestsList[guestsList.length - 1].guests.push({
                name: guest.name,
                status: guestStatus
            });
            
            if (guest.attending) {
                confirmedCount++;
            } else {
                declinedCount++;
            }
            totalGuests++;
        });
    });
    
    // Update stats
    document.getElementById('confirmed-count').textContent = confirmedCount;
    document.getElementById('declined-count').textContent = declinedCount;
    document.getElementById('total-count').textContent = totalGuests;
    
    // Render guests table
    renderGuestsTable(guestsList);
    
    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter guests
            const filter = this.dataset.filter;
            renderGuestsTable(guestsList, filter);
        });
    });
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
            if (guest.guests.length > 0) {
                const guestsList = document.createElement('ul');
                guest.guests.forEach(g => {
                    const li = document.createElement('li');
                    li.textContent = `${g.name} (${g.status === 'confirmed' ? 'Confirmado' : 'Não confirmado'})`;
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
            guest.guests.forEach(g => {
                const row = document.createElement('tr');
                
                // Name cell (indented)
                const nameCell = document.createElement('td');
                nameCell.textContent = `↳ ${g.name}`;
                row.appendChild(nameCell);
                
                // Status cell
                const statusCell = document.createElement('td');
                const statusSpan = document.createElement('span');
                statusSpan.textContent = g.status === 'confirmed' ? 'Confirmado' : 'Não confirmado';
                statusSpan.className = g.status === 'confirmed' ? 'status-confirmed' : 'status-declined';
                statusCell.appendChild(statusSpan);
                row.appendChild(statusCell);
                
                // Empty cell for guests
                const emptyCell = document.createElement('td');
                emptyCell.textContent = '-';
                row.appendChild(emptyCell);
                
                tbody.appendChild(row);
            });
        } else if (filter === 'confirmed' || filter === 'declined') {
            guest.guests.forEach(g => {
                if (g.status === filter) {
                    const row = document.createElement('tr');
                    
                    // Name cell (indented)
                    const nameCell = document.createElement('td');
                    nameCell.textContent = `↳ ${g.name}`;
                    row.appendChild(nameCell);
                    
                    // Status cell
                    const statusCell = document.createElement('td');
                    const statusSpan = document.createElement('span');
                    statusSpan.textContent = g.status === 'confirmed' ? 'Confirmado' : 'Não confirmado';
                    statusSpan.className = g.status === 'confirmed' ? 'status-confirmed' : 'status-declined';
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