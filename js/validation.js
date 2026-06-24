class FormValidator {
    constructor(onSuccessCallback = null) {
        this.forms = document.querySelectorAll('form');
        this.onSuccess = onSuccessCallback; 
        
        this.initValidation();
    }

    initValidation() {
        if (this.forms.length === 0) return;

        this.forms.forEach(form => {
            form.setAttribute('novalidate', '');

            form.addEventListener('submit', (e) => this.validateForm(e));
            form.querySelectorAll('input, textarea, select').forEach(field => {
                field.addEventListener('blur', () => this.validateField(field));
                field.addEventListener('change', () => this.validateField(field));
                field.addEventListener('input', () => {
                    if (field.classList.contains('is-invalid')) {
                        this.validateField(field);
                    }
                });
            });
        });
    }

    validateForm(e) {
        const form = e.target;
        const allFields = form.querySelectorAll('input, textarea, select');
        let isValid = true;
        allFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        if (!isValid) {
            e.preventDefault();
            e.stopPropagation();
            
            const firstInvalid = form.querySelector('.is-invalid');
            if (firstInvalid) {
                firstInvalid.focus();
            }
        } else {
            if (this.onSuccess) {
                this.onSuccess(e, form);
            }
        }
    }

    validateField(field) {
        let isValid = true;
        const value = field.value.trim();
        
        field.classList.remove('is-invalid', 'is-valid');

        if (field.hasAttribute('required') && !value) {
            isValid = false;
        }

        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailRegex.test(value);
        }

        if (field.type === 'tel' && value) {
            const phoneRegex = /^(\+373|0)?[672]\d{7}$/; 
            isValid = phoneRegex.test(value);
        }

        if (field.id === 'repairCode' && value) {
            if (value.length < 12) {
                isValid = false;
            }
        }

        if (isValid) {
            if (value.length > 0) {
                field.classList.add('is-valid');
            }
        } else {
            field.classList.add('is-invalid');
        }

        return isValid;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (!window.customFormValidator) {
        window.customFormValidator = new FormValidator((e, form) => {
            alert('Formularul a fost transmis cu succes!');
        });
    }
});