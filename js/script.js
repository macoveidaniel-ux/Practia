// ==========================================================================
// SCRIPT.JS - Carusel Fix It (Autoplay Forțat + Scroll Infinit + Drag + Click)
// La ce folosește: Controlează caruselul interactiv de pe site. Rulează o 
// mișcare automată a cardurilor de servicii la fiecare 2.5 secunde, permite 
// utilizatorului să le reordoneze manual prin Drag & Drop și redirecționează 
// către pagina de prețuri la un click normal pe card.
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Selectăm containerul vizual (fereastra de vizualizare) și lista fizică de carduri
    const caruselZone = document.querySelector('.zona-carusel');
    const list = document.getElementById('sortable-list');
    
    // Protecție: Dacă elementele caruselului nu se află pe pagina curentă, scriptul se oprește fără erori
    if (!caruselZone || !list) return;

    let draggingElement = null; // Va păstra o referință către cardul care este mutat în mod activ
    let autoplayTimer = null;    // Va stoca ID-ul intervalului de timp pentru autoplay
    const intervalTimp = 2500;   // Setează pauza de mișcare automată (2.5 secunde)

    /**
     * getScrollAmount()
     * La ce folosește: Calculează dinamic distanța de derulare (lățimea unui card + spațiul dintre ele / gap).
     * Acest lucru asigură că scroll-ul se oprește întotdeauna perfect la marginea următorului card.
     */
    function getScrollAmount() {
        const firstItem = caruselZone.querySelector('.item-categorie-dreptunghi');
        if (firstItem) {
            // Preluăm lățimea fizică actuală a elementului din browser și adăugăm gap-ul din CSS
            return firstItem.getBoundingClientRect().width + 25; 
        }
        return 285; // Valoare implicită (fallback) în caz că elementul nu este detectat instant
    }

    // ==========================================================================
    // LOGICĂ AUTOPLAY (MIȘCARE AUTOMATĂ & SCROLL INFINIT)
    // ==========================================================================
    
    /**
     * startAutoplay()
     * La ce folosește: Pornește un cronometru ciclic care mișcă automat caruselul spre dreapta.
     * Pentru a crea efectul de infinit, mută primul card la sfârșitul listei după derulare.
     */
    function startAutoplay() {
        if (autoplayTimer) return; // Evită pornirea mai multor cronometre simultan

        autoplayTimer = setInterval(() => {
            // Se efectuează mișcarea doar dacă utilizatorul nu trage un card în acel moment
            if (!draggingElement) {
                const amount = getScrollAmount();
                
                // Realizează un scroll fluid către dreapta în interiorul containerului
                caruselZone.scrollBy({ left: amount, behavior: 'smooth' });
                
                // Așteptăm 300ms (timpul necesar pentru ca animația de scroll să se finalizeze)
                setTimeout(() => {
                    const firstChild = list.querySelector('.item-categorie-dreptunghi');
                    // Dacă starea este stabilă, mutăm primul element fizic la capătul listei în DOM
                    if (firstChild && !draggingElement) {
                        list.appendChild(firstChild); 
                        caruselZone.scrollLeft -= amount; // Corectăm instant poziția scroll-ului pentru continuitate
                    }
                }, 300); 
            }
        }, intervalTimp);
    }

    /**
     * stopAutoplay()
     * La ce folosește: Oprește complet cronometrul de mișcare automată.
     * Este apelat când utilizatorul interacționează direct cu zona caruselului.
     */
    function stopAutoplay() {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
    }

    // Pornim automatismul imediat la încărcarea paginii
    startAutoplay();

    // Îmbunătățire experiență: Oprim mișcarea când mouse-ul este deasupra caruselului și o repornim la ieșire
    caruselZone.addEventListener('mouseenter', stopAutoplay);
    caruselZone.addEventListener('mouseleave', startAutoplay);


    // ==========================================================================
    // LOGICĂ CLICK PENTRU REDIRECȚIONARE (PAGINA PREȚURI)
    // ==========================================================================
    
    // Ascultăm evenimentul de click direct pe listă pentru o performanță mai bună (Event Delegation)
    list.addEventListener('click', (e) => {
        // Identificăm dacă elementul pe care s-a dat click este un card sau se află în interiorul unui card
        const card = e.target.closest('.item-categorie-dreptunghi');
        
        // Redirecționăm DOAR dacă s-a dat click pe un card valid și utilizatorul NU făcea drag în acel moment
        if (card && !card.classList.contains('dragging')) {
            window.location.href = 'prices.html'; // Trimite utilizatorul către pagina de prețuri
        }
    });


    // ==========================================================================
    // LOGICĂ DRAG & DROP (SORTARE INTELIGENTĂ PRIN TRAGERE)
    // ==========================================================================
    
    // Eveniment declanșat când utilizatorul apasă și începe să tragă un card
    list.addEventListener('dragstart', (e) => {
        draggingElement = e.target.closest('.item-categorie-dreptunghi');
        if (draggingElement) {
            stopAutoplay(); // Protecție critică: Oprim autoplay-ul ca să nu modifice ordinea în timpul tragerii
            // Adăugăm clasa de styling pentru drag utilizând un artificiu de asincronism (setTimeout 0)
            setTimeout(() => draggingElement.classList.add('dragging'), 0);
        }
    });

    // Eveniment declanșat când utilizatorul eliberează cardul tras
    list.addEventListener('dragend', () => {
        if (draggingElement) {
            draggingElement.classList.remove('dragging'); // Eliminăm efectul vizual de transparență
            draggingElement = null;
            startAutoplay(); // Reconfigurăm și repornim ciclul de autoplay
        }
    });

    // Eveniment care detectează poziția cursorului în timp ce un card este plimbat peste listă
    list.addEventListener('dragover', (e) => {
        e.preventDefault(); // Permite plasarea elementului (anulează interdicția implicită a browserului)
        if (!draggingElement) return;

        // Calculăm care este cel mai apropiat card față de poziția X a mouse-ului
        const afterElement = getDragAfterElement(list, e.clientX);
        if (afterElement == null) {
            list.appendChild(draggingElement); // Dacă suntem la capăt, îl trimitem la final
        } else {
            list.insertBefore(draggingElement, afterElement); // Îl inserăm dinamic înaintea cardului țintă
        }
    });

    /**
     * getDragAfterElement()
     * La ce folosește: Algoritm matematic care determină care este elementul din listă 
     * cel mai apropiat de cursorul utilizatorului, pe axa orizontală (X).
     */
    function getDragAfterElement(container, x) {
        // Colectăm într-un array toate cardurile stabile (care NU sunt mutate în acel moment)
        const dragElements = [...container.querySelectorAll('.item-categorie-dreptunghi:not(.dragging)')];

        // Rulăm o funcție de reducere pentru a găsi elementul cu cel mai mic offset negativ
        return dragElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            // Calculăm distanța dintre centrul cardului curent și poziția X a mouse-ului
            const offset = x - box.left - box.width / 2;
            
            // Dacă mouse-ul se află în stânga centrului unui element și mai aproape decât precedentul detectat
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element; // Punct de start la infinit negativ
    }
});