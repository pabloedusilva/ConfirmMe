document.addEventListener('DOMContentLoaded', function() {
    initConfirmationPage();
});

function initConfirmationPage() {
    const guestNameInput = document.getElementById('guest-name');
    const addGuestBtn = document.getElementById('add-guest-btn');
    const confirmationForm = document.getElementById('confirmation-form');
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
            <button type="button" class="remove-guest" aria-label="Remover acompanhante">&times;</button>
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
    
    // Form submit handler
    confirmationForm.addEventListener('submit', async function(e) {
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
            additionalGuests.push({ name: name.trim(), attending: attending });
        });
        
        // Prepare data for API
        const confirmationData = {
            mainGuestName: guestNameInput.value.trim(),
            mainGuestAttending: isAttending,
            additionalGuests: additionalGuests
        };
        
        try {
            // Send to API
            const response = await fetch('/api/confirmations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(confirmationData)
            });
            
            if (response.ok) {
                // Show success modal
                successModal.classList.add('show');
                
                // Reset form
                guestNameInput.value = '';
                document.querySelector('input[name="attendance"][value="yes"]').checked = true;
                additionalGuestsContainer.innerHTML = '';
                guestCount = 0;
            } else {
                const errorData = await response.json();
                alert('Erro ao enviar confirmação: ' + (errorData.message || 'Erro desconhecido'));
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao enviar confirmação. Tente novamente.');
        }
    });
    
    // Close modal button click handler
    closeModalBtn.addEventListener('click', function() {
        successModal.classList.remove('show');
    });
}
