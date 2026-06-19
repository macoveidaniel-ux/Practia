// ==========================================================================
// MAIN JS - Funcționalități generale site (Atelierul „Fix It”)
// La ce folosește: Gestionează interacțiunile globale de pe site: efectele 
// meniului, umbrele la scroll, validarea formularelor și animațiile cardurilor.
// ==========================================================================

class SiteManager {
    constructor() {
        // Constructorul rulează automat toate metodele la inițializarea clasei
        this.initNavigation();
        this.initScrollEffects();
        this.initFooterLinks();
        this.initContactForm();
        this.initServiceCards();
    }

    /**
     * 1. initNavigation()
     * La ce folosește: Gestionează starea vizuală a meniului de navigare.
     * Schimbă culoarea link-ului curent în verdele de accent (#00C853) la click.
     */
    initNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Notă: e.preventDefault() NU este pus pentru a permite navigarea reală între fișierele HTML separate.
                
                // Resetăm stilul pentru toate celelalte link-uri din meniu
                document.querySelectorAll('.nav-link').forEach(l => {
                    l.style.setProperty('color', '', 'important');
                    l.classList.remove('active');
                });
                
                // Aplicăm culoarea de branding pe link-ul selectat
                link.style.setProperty('color', '#00C853', 'important');
                link.classList.add('active');
            });
        });
    }

    /**
     * 2. initScrollEffects()
     * La ce folosește: Îmbunătățește experiența vizuală la derularea paginii.
     * Când utilizatorul coboară mai mult de 50px, adaugă o umbră fină sub navbar.
     */
    initScrollEffects() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return; // Protecție: oprește execuția dacă pagina curentă nu are navbar

        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.4)';
                navbar.style.transition = 'box-shadow 0.3s ease'; // Tranziție fluidă pentru umbră
            } else {
                navbar.style.boxShadow = 'none';
            }
        });
    }

    /**
     * 3. initFooterLinks()
     * La ce folosește: Gestionează efectul de hover pe link-urile din subsol (Footer).
     * Schimbă dinamic opacitatea și culoarea textului când mouse-ul trece peste ele.
     */
    initFooterLinks() {
        const footerLinks = document.querySelectorAll('.footer-link');
        
        footerLinks.forEach(link => {
            // Efect la intrarea mouse-ului (devine verde accent)
            link.addEventListener('mouseenter', () => {
                link.style.setProperty('color', '#00C853', 'important');
            });
            
            // Efect la ieșirea mouse-ului (revine la albul semi-transparent initial)
            link.addEventListener('mouseleave', () => {
                link.style.setProperty('color', 'rgba(255, 255, 255, 0.5)', 'important');
            });
        });
    }

    /**
     * 4. initContactForm()
     * La ce folosește: Gestionează trimiterea formularului de pe pagina contact.html.
     * Oprește reîncărcarea paginii, colectează datele introduse de client, afișează 
     * o alertă de mulțumire și resetează câmpurile.
     */
    initContactForm() {
        const form = document.getElementById('contactForm');
        
        if (!form) return; // Protecție: rulează doar pe pagina unde există formularul de contact

        form.addEventListener('submit', (e) => {
            e.preventDefault(); // Oprește trimiterea standard a formularului (evită refresh-ul paginii)
            
            const nameEl = document.getElementById('name');
            const emailEl = document.getElementById('email');
            const messageEl = document.getElementById('message');
            
            // Protecție suplimentară în caz că lipsesc elemente din structura HTML
            if (!nameEl || !emailEl || !messageEl) return;

            const name = nameEl.value;
            const email = emailEl.value;
            const message = messageEl.value;
            
            // Simulare trimitere date către server (afișare în consolă pentru debug)
            console.log('Formular trimis cu succes:', { name, email, message });
            
            // Feedback instant pentru utilizator
            alert(`Mulțumim, ${name}! Mesajul tău a fost trimis. Te vom contacta la ${email} în cel mai scurt timp!`);
            form.reset(); // Curăță toate input-urile din formular
        });
    }

    /**
     * 5. initServiceCards()
     * La ce folosește: Adaugă animații interactive cardurilor cu clasa `.transition-card`.
     * Creează un efect dinamic de ridicare (translateY) și o umbră verde-glow la hover.
     */
    initServiceCards() {
        const cards = document.querySelectorAll('.transition-card');
        
        cards.forEach(card => {
            // Setează tranziția direct din JavaScript pentru a garanta mișcarea fluidă
            card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';

            // Când mouse-ul intră pe card (ridicare și umbră verde)
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px)';
                card.style.boxShadow = '0 12px 24px rgba(0, 200, 83, 0.25)';
            });
            
            // Când mouse-ul părăsește cardul (revine la poziția inițială)
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = '';
            });
        });
    }
}

// Inițializare sigură: Codul pornește doar după ce toate elementele HTML au fost complet încărcate
document.addEventListener('DOMContentLoaded', () => {
    new SiteManager();
});