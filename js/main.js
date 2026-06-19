
class SiteManager {
    constructor() {
        this.initNavigation();
        this.initScrollEffects();
        this.initFooterLinks();
        this.initContactForm();
        this.initServiceCards();
    }


    initNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {

                document.querySelectorAll('.nav-link').forEach(l => {
                    l.style.setProperty('color', '', 'important');
                    l.classList.remove('active');
                });

                link.style.setProperty('color', '#00C853', 'important');
                link.classList.add('active');
            });
        });
    }


    initScrollEffects() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.4)';
                navbar.style.transition = 'box-shadow 0.3s ease';
            } else {
                navbar.style.boxShadow = 'none';
            }
        });
    }


    initFooterLinks() {
        const footerLinks = document.querySelectorAll('.footer-link');

        footerLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                link.style.setProperty('color', '#00C853', 'important');
            });

            link.addEventListener('mouseleave', () => {
                link.style.setProperty('color', 'rgba(255, 255, 255, 0.5)', 'important');
            });
        });
    }


    initContactForm() {
        const form = document.getElementById('contactForm');

        if (!form) return;
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameEl = document.getElementById('name');
            const emailEl = document.getElementById('email');
            const messageEl = document.getElementById('message');

            if (!nameEl || !emailEl || !messageEl) return;

            const name = nameEl.value;
            const email = emailEl.value;
            const message = messageEl.value;

            console.log('Formular trimis cu succes:', { name, email, message });

            alert(`Mulțumim, ${name}! Mesajul tău a fost trimis. Te vom contacta la ${email} în cel mai scurt timp!`);
            form.reset();
        });
    }


    initServiceCards() {
        const cards = document.querySelectorAll('.transition-card');

        cards.forEach(card => {

            card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';


            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px)';
                card.style.boxShadow = '0 12px 24px rgba(0, 200, 83, 0.25)';
            });


            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = '';
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SiteManager();
});