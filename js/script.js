
document.addEventListener('DOMContentLoaded', () => {

    const caruselZone = document.querySelector('.zona-carusel');
    const list = document.getElementById('sortable-list');


    if (!caruselZone || !list) return;

    let draggingElement = null;
    let autoplayTimer = null;
    const intervalTimp = 2500;


    function getScrollAmount() {
        const firstItem = caruselZone.querySelector('.item-categorie-dreptunghi');
        if (firstItem) {
            return firstItem.getBoundingClientRect().width + 25;
        }
        return 285;
    }


    function startAutoplay() {
        if (autoplayTimer) return;
        autoplayTimer = setInterval(() => {

            if (!draggingElement) {
                const amount = getScrollAmount();


                caruselZone.scrollBy({ left: amount, behavior: 'smooth' });


                setTimeout(() => {
                    const firstChild = list.querySelector('.item-categorie-dreptunghi');

                    if (firstChild && !draggingElement) {
                        list.appendChild(firstChild);
                        caruselZone.scrollLeft -= amount;
                    }
                }, 300);
            }
        }, intervalTimp);
    }


    function stopAutoplay() {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
    }


    startAutoplay();


    caruselZone.addEventListener('mouseenter', stopAutoplay);
    caruselZone.addEventListener('mouseleave', startAutoplay);





    list.addEventListener('click', (e) => {

        const card = e.target.closest('.item-categorie-dreptunghi');


        if (card && !card.classList.contains('dragging')) {
            window.location.href = 'prices.html';
        }
    });





    list.addEventListener('dragstart', (e) => {
        draggingElement = e.target.closest('.item-categorie-dreptunghi');
        if (draggingElement) {
            stopAutoplay();

            setTimeout(() => draggingElement.classList.add('dragging'), 0);
        }
    });


    list.addEventListener('dragend', () => {
        if (draggingElement) {
            draggingElement.classList.remove('dragging');
            draggingElement = null;
            startAutoplay();
        }
    });


    list.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (!draggingElement) return;


        const afterElement = getDragAfterElement(list, e.clientX);
        if (afterElement == null) {
            list.appendChild(draggingElement);
        } else {
            list.insertBefore(draggingElement, afterElement);
        }
    });


    function getDragAfterElement(container, x) {

        const dragElements = [...container.querySelectorAll('.item-categorie-dreptunghi:not(.dragging)')];


        return dragElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();

            const offset = x - box.left - box.width / 2;


            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
});