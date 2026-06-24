

class PriceCalculator {
    constructor() {
        this.services = {
            'ecran': { min: 400, max: 2500, name: 'Înlocuire Ecran' },
            'baterie': { min: 300, max: 1200, name: 'Înlocuire Baterie' },
            'camera': { min: 250, max: 1500, name: 'Reparație Cameră' },
            'hardware': { min: 200, max: 1800, name: 'Reparație Hardware' },
            'software': { min: 150, max: 500, name: 'Reparații Software' },
            'apa': { min: 300, max: 1000, name: 'Reparație Apă' }
        };

        this.discounts = {
            'client-loyal': 0.20 
        };

        this.init();
    }

    init() {
        this.createCalculatorWidget();
    }

    createCalculatorWidget() {
        if (document.getElementById('priceCalculator')) return;

        const calculator = document.createElement('div');
        calculator.id = 'priceCalculator';
        calculator.innerHTML = `
            <div style="position: fixed; bottom: 20px; right: 20px; z-index: 1050;">
                <div class="card shadow-lg border-0" style="width: 310px; display: none; border-radius: 12px; overflow: hidden;" id="calcPanel">
                    <div class="card-header text-white p-3 border-0 d-flex justify-content-between align-items-center" style="background-color: #111111; border-bottom: 2px solid #00C853 !important;">
                        <span class="fw-bold m-0" style="font-family: 'Montserrat', sans-serif; font-size: 14px; letter-spacing: 0.5px;">
                            <i class="fas fa-calculator me-2" style="color: #00C853;"></i>ESTIMATOR PREȚ
                        </span>
                        <button type="button" class="btn-close btn-close-white small" id="closeCalc" aria-label="Close"></button>
                    </div>
                    
                    <div class="card-body p-3" style="background-color: #ffffff;">
                        <div class="mb-3">
                            <label class="form-label small fw-bold text-secondary">Tipul Defecțiunii</label>
                            <select class="form-select form-select-sm border-1" id="serviceSelect" style="border-radius: 6px;">
                                <option value="">Selectează serviciu...</option>
                                <option value="ecran">Înlocuire Ecran</option>
                                <option value="baterie">Înlocuire Baterie</option>
                                <option value="camera">Reparație Cameră</option>
                                <option value="hardware">Reparație Hardware / Placă</option>
                                <option value="software">Reparații Software / Decodare</option>
                                <option value="apa">Curățare Oxidare (Apă)</option>
                            </select>
                        </div>

                        <div class="mb-3">
                            <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" id="loyalClient" style="cursor: pointer;">
                                <label class="form-check-label small fw-semibold" for="loyalClient" style="cursor: pointer; user-select: none;">
                                    Sunt client fidel (-20%)
                                </label>
                            </div>
                        </div>

                        <div class="alert alert-info py-2 px-3 mb-0 border-0" style="background-color: #e3f2fd; border-radius: 8px;">
                            <div class="d-flex align-items-start">
                                <i class="fas fa-info-circle me-2 mt-1" style="color: #1976D2; font-size: 14px;"></i>
                                <div>
                                    <span class="d-block small text-muted fw-medium">Cost estimat:</span>
                                    <span id="priceEstimate" class="fw-bold text-dark" style="font-size: 15px;">Selectează un serviciu</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <button class="btn btn-success rounded-circle fw-bold shadow-lg d-flex align-items-center justify-content-center" id="openCalc" 
                    style="background-color: #00C853; border: none; width: 60px; height: 60px; transition: transform 0.2s ease;">
                    <i class="fas fa-calculator" style="font-size: 22px;"></i>
                </button>
            </div>
        `;

        document.body.appendChild(calculator);
        this.attachCalculatorEvents();
    }

    attachCalculatorEvents() {
        const openBtn = document.getElementById('openCalc');
        const closeBtn = document.getElementById('closeCalc');
        const panel = document.getElementById('calcPanel');
        const serviceSelect = document.getElementById('serviceSelect');
        const loyalCheckbox = document.getElementById('loyalClient');

        openBtn.addEventListener('click', () => {
            panel.style.display = 'block';
            openBtn.style.transform = 'scale(0)';
            setTimeout(() => { openBtn.style.display = 'none'; }, 200);
        });

        closeBtn.addEventListener('click', () => {
            panel.style.display = 'none';
            openBtn.style.display = 'flex';
            setTimeout(() => { openBtn.style.transform = 'scale(1)'; }, 50);
        });

        serviceSelect.addEventListener('change', () => this.calculatePrice());
        loyalCheckbox.addEventListener('change', () => this.calculatePrice());
    }

    calculatePrice() {
        const serviceSelect = document.getElementById('serviceSelect');
        const loyalCheckbox = document.getElementById('loyalClient');
        const estimateDisplay = document.getElementById('priceEstimate');

        const service = serviceSelect.value;

        if (!service) {
            estimateDisplay.innerHTML = '<span class="text-muted small">Selectează un serviciu</span>';
            return;
        }

        const serviceInfo = this.services[service];
        const avgPrice = (serviceInfo.min + serviceInfo.max) / 2;

        let finalPrice = avgPrice;
        let discount = 0;

        if (loyalCheckbox.checked) {
            discount = this.discounts['client-loyal'];
        }

        finalPrice = finalPrice * (1 - discount);

        const discountBadge = discount > 0 ? ` <span class="badge bg-success ms-1" style="font-size: 10px;">-20% Fidelitate</span>` : '';

        estimateDisplay.innerHTML = `
            <span style="color: #00C853; font-size: 18px; font-family: 'Montserrat', sans-serif;">~ ${Math.round(finalPrice)} MDL</span>${discountBadge}
            <br><span class="text-muted" style="font-size: 11px; font-weight: normal;"><i class="far fa-clock me-1"></i>Timp mediu de execuție: 30-60 min</span>
        `;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PriceCalculator();
});