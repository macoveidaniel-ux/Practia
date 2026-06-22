// ==========================================================================
// STATUS JS - Tracker dinamic pentru verificarea statusului reparațiilor
// ==========================================================================

class RepairStatusTracker {
    constructor() {
        // Nomenclator / Bază de date simulată cu prețuri reale în MDL, date și note tehnice
        this.repairs = {
            'REP-2026-001': {
                device: 'iPhone 12 Pro',
                service: 'Înlocuire Ecran (OLED Soft)',
                price: 1850,
                date: '08.06.2026',
                status: 'progress',
                note: 'Ecranul nou a sosit în depozit. Tehnicianul a început asamblarea, curățarea de praf și calibrarea senzorilor.'
            },
            'REP-2026-002': {
                device: 'Samsung Galaxy S24',
                service: 'Reparație Placă de Bază / PMIC',
                price: 2400,
                date: '09.06.2026',
                status: 'pending',
                note: 'Dispozitivul se află în coada de așteptare pentru diagnosticarea microscopică avansată a circuitelor de alimentare.'
            },
            'REP-2026-003': {
                device: 'Xiaomi Mi 11',
                service: 'Înlocuire Acumulator Original',
                price: 650,
                date: '05.06.2026',
                status: 'ready',
                note: 'Reparație finalizată cu succes! Testele de încărcare/descărcare rapidă și calibrare software au fost trecute.'
            }
        };

        this.init();
    }

    /**
     * Inițializează ascultătorii de evenimente (Event Listeners)
     */
    init() {
        const searchBtn = document.getElementById('searchBtn');
        const repairCodeInput = document.getElementById('repairCode');

        // Declanșare căutare la click pe butonul verde
        if (searchBtn) {
            searchBtn.addEventListener('click', () => this.search());
        }

        // Declanșare căutare la apăsarea tastei Enter în interiorul câmpului text
        if (repairCodeInput) {
            repairCodeInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.search();
            });
        }
    }

    /**
     * Prelucrează textul introdus și validează codul reparației
     */
    search() {
        const inputElement = document.getElementById('repairCode');
        if (!inputElement) return;

        // Convertim în majuscule și eliminăm spațiile goale accidentale
        const code = inputElement.value.toUpperCase().trim();

        // Validare: verificăm dacă câmpul este gol
        if (!code) {
            this.showValidationError('Te rugăm să introduci un cod de reparație!');
            return;
        }

        // Verificăm existența codului în baza de date
        if (this.repairs[code]) {
            this.displayResult(code);
        } else {
            this.showNotFound('Codul introdus nu a fost găsit în sistem. Verifică biletul primit la recepție.');
        }
    }

    /**
     * Populează elementele din HTML cu datele extrase din baza de date
     */
    displayResult(code) {
        const repair = this.repairs[code];
        
        // Afișăm containerul cu rezultate și ascundem erorile
        document.getElementById('resultContainer').style.display = 'block';
        document.getElementById('notFoundContainer').style.display = 'none';
        
        // Populare date textuale standard
        document.getElementById('displayCode').textContent = code;
        document.getElementById('repairDevice').textContent = repair.device;
        document.getElementById('repairService').textContent = repair.service;

        // Populare dinamică pentru Data Recepție și Preț (folosind ordinea elementelor din structura row-ului)
        const textFields = document.getElementById('resultContainer').querySelectorAll('.fw-bold');
        if (textFields.length >= 4) {
            textFields[1].textContent = repair.date; // Setează a doua valoare (Data)
            textFields[3].innerHTML = `<span style="color: #00C853;">${repair.price} MDL</span>`; // Setează a patra valoare (Preț)
        }

        // Populare notă tehnică din interiorul alertului informativ albastru
        const infoAlert = document.getElementById('resultContainer').querySelector('.alert-info');
        if (infoAlert) {
            infoAlert.innerHTML = `<i class="fas fa-comment-alt me-2" style="color: #1976D2;"></i><strong>Notă tehnician:</strong> ${repair.note}`;
        }

        // Actualizare Badge și Timeline grafic
        this.updateStatusBadge(repair.status);
        this.generateAndFillTimeline(repair.status);
    }

    /**
     * Actualizează designul și textul badge-ului de status
     */
    updateStatusBadge(status) {
        const badge = document.getElementById('repairStatus');
        if (!badge) return;

        // Resetăm clasele vechi pentru a evita suprapunerea culorilor la căutări multiple
        badge.className = 'status-badge'; 

        const statusMap = {
            'pending': { class: 'status-pending', text: '<i class="fas fa-clock me-1"></i> În Așteptare' },
            'progress': { class: 'status-progress', text: '<i class="fas fa-tools me-1"></i> În Lucru' },
            'ready': { class: 'status-ready', text: '<i class="fas fa-check-circle me-1"></i> Gata de Ridicare' }
        };

        const statusInfo = statusMap[status] || statusMap['pending'];
        badge.classList.add(statusInfo.class);
        badge.innerHTML = statusInfo.text;
    }

    /**
     * Generează complet de la zero elementele din timeline și le activează pe cele parcurse
     */
    generateAndFillTimeline(status) {
        const timeline = document.getElementById('statusTimeline');
        if (!timeline) return;

        // Structura logică a pașilor dintr-un flux real de service gsm
        const steps = [
            { id: 'pending', title: 'Dispozitiv recepționat în sediu', desc: 'Telefonul a fost înregistrat în baza de date și urmează să fie diagnosticat.' },
            { id: 'diagnostic', title: 'Diagnosticare tehnică inițială', desc: 'Se verifică circuitele interne și senzorii pentru stabilirea pieselor necesare.' },
            { id: 'progress', title: 'Reparație în curs de execuție', desc: 'Tehnicianul înlocuiește componentele defecte și curăță oxizii sau impuritățile.' },
            { id: 'testing', title: 'Testare și control al calității', desc: 'Dispozitivul este testat intensiv (baterie, ecrane, semnal) pentru asigurarea calității.' },
            { id: 'ready', title: 'Pregătit pentru eliberare', desc: 'Procesul este finalizat cu succes! Dispozitivul poate fi ridicat de la sediul din Cahul.' }
        ];

        // Definirea numărului de pași compleți care se colorează (clasa active) în funcție de status
        const progressLevels = {
            'pending': 1,      // Pasul 1 completat
            'progress': 3,     // Pașii 1, 2 și 3 completați
            'ready': 5         // Toți cei 5 pași finalizați
        };

        const activeStepsCount = progressLevels[status] || 1;
        let htmlContent = '';

        steps.forEach((step, index) => {
            const isActive = index < activeStepsCount ? 'active' : '';
            // Dacă pasul e parcurs punem bifă plină (fa-check-circle), dacă nu, cerc gol (fa-circle)
            const checkIcon = index < activeStepsCount 
                ? '<i class="fas fa-check-circle text-success me-2" style="color: #00C853 !important;"></i>' 
                : '<i class="far fa-circle text-muted me-2"></i>';
            
            htmlContent += `
                <div class="timeline-item ${isActive}">
                    <h6 class="fw-bold mb-1">${checkIcon}${step.title}</h6>
                    <p class="text-muted small mb-0 ms-4" style="font-size: 12px;">${step.desc}</p>
                </div>
            `;
        });

        // Înlocuim conținutul gol din HTML cu timeline-ul generat dinamic
        timeline.innerHTML = htmlContent;
    }

    /**
     * Ascunde rezultatele și afișează caseta galbenă când codul nu există
     */
    showNotFound(message) {
        const errorContainer = document.getElementById('notFoundContainer');
        if (!errorContainer) return;

        document.getElementById('resultContainer').style.display = 'none';
        errorContainer.querySelector('p').textContent = message;
        errorContainer.style.display = 'block';
    }

    /**
     * Gestionează validarea codului gol folosind tot containerul de avertizare
     */
    showValidationError(message) {
        this.showNotFound(message);
    }
}

// Inițializarea automată a clasei tracker-ului după încărcarea completă a paginii DOM
document.addEventListener('DOMContentLoaded', () => {
    new RepairStatusTracker();
});