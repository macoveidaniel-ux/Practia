// ==========================================================================
// VALIDATION JS - Validare dinamică formulare integrată cu Bootstrap
// ==========================================================================

class FormValidator {
    constructor(onSuccessCallback = null) {
        this.forms = document.querySelectorAll('form');
        // Callback-ul ne permite să trimitem datele prin main.js după ce validarea a trecut
        this.onSuccess = onSuccessCallback; 
        
        this.initValidation();
    }

    /**
     * Inițializează ascultătorii pentru evenimente pe toate formularele din pagină
     */
    initValidation() {
        if (this.forms.length === 0) return;

        this.forms.forEach(form => {
            // Dezactivăm validarea nativă a browserului (care arată învechită)
            form.setAttribute('novalidate', '');

            form.addEventListener('submit', (e) => this.validateForm(e));
            
            // Validare în timp real (când utilizatorul termină de scris sau schimbă opțiunea)
            form.querySelectorAll('input, textarea, select').forEach(field => {
                field.addEventListener('blur', () => this.validateField(field));
                field.addEventListener('change', () => this.validateField(field));
                // Opțional: scoate eroarea instant când utilizatorul reîncepe să scrie
                field.addEventListener('input', () => {
                    if (field.classList.contains('is-invalid')) {
                        this.validateField(field);
                    }
                });
            });
        });
    }

    /**
     * Validează întregul formular la acțiunea de Submit
     */
    validateForm(e) {
        const form = e.target;
        const allFields = form.querySelectorAll('input, textarea, select');
        let isValid = true;

        // Verificăm absolut toate câmpurile din formularul trimis
        allFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        // Dacă cel puțin un câmp e greșit, oprim trimiterea paginii/formularului
        if (!isValid) {
            e.preventDefault();
            e.stopPropagation();
            
            // UX Bonus: Facem scroll automat către primul element care are eroare
            const firstInvalid = form.querySelector('.is-invalid');
            if (firstInvalid) {
                firstInvalid.focus();
            }
        } else {
            // Dacă formularul este complet valid și avem un callback definit, rulăm logica specială
            if (this.onSuccess) {
                this.onSuccess(e, form);
            }
        }
    }

    /**
     * Validează un singur câmp pe baza tipului și atributelor sale
     */
    validateField(field) {
        let isValid = true;
        const value = field.value.trim();
        
        // Resetăm stările anterioare Bootstrap pentru a nu se suprapune
        field.classList.remove('is-invalid', 'is-valid');

        // 1. Validare pentru câmpuri obligatorii (required)
        if (field.hasAttribute('required') && !value) {
            isValid = false;
        }

        // 2. Validare specifică pentru Email (Regex stabil și complet)
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailRegex.test(value);
        }

        // 3. Validare specifică pentru Număr de Telefon (Format Moldova: minim 9 cifre)
        if (field.type === 'tel' && value) {
            // Permite formate ca: 068123456, +37368123456, etc.
            const phoneRegex = /^(\+373|0)?[672]\d{7}$/; 
            isValid = phoneRegex.test(value);
        }

        // 4. Validare specifică pentru Codul de Reparație (Dacă e folosit în status)
        if (field.id === 'repairCode' && value) {
            // Un cod valid trebuie să aibă lungimea minimă de 12 caractere (ex: REP-2026-001)
            if (value.length < 12) {
                isValid = false;
            }
        }

        // Aplicarea claselor vizuale din Bootstrap 5
        if (isValid) {
            // Adăugăm clasa verde doar dacă câmpul nu este complet gol (opțional, pentru aspect curat)
            if (value.length > 0) {
                field.classList.add('is-valid');
            }
        } else {
            field.classList.add('is-invalid');
        }

        return isValid;
    }
}

// Inițializare inteligentă:
// Dacă acest script rulează singur, se instanțiază automat.
// Dacă este importat sau integrat, poate fi apelat manual.
document.addEventListener('DOMContentLoaded', () => {
    // Verificăm dacă nu a fost deja definit un manager global care să-l instanțieze
    if (!window.customFormValidator) {
        window.customFormValidator = new FormValidator();
    }
});