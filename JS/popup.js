/* Lead Qualification Popup - Dynamic & Robust Version */
(function() {
    const LeadPopup = {
        modal: null,
        formData: {},
        currentStep: 0,
        isLoaded: false,

        init() {
            // Global hook for all CTA buttons
            window.openLeadPopup = () => this.open();
        },

        async loadPopup() {
            if (this.isLoaded) return true;

            try {
                const response = await fetch('popup.html');
                const html = await response.text();
                
                // Use a temporary container to extract ONLY the #lead-modal
                const temp = document.createElement('div');
                temp.innerHTML = html;
                const modalHtml = temp.querySelector('#lead-modal');
                
                if (modalHtml) {
                    document.body.appendChild(modalHtml);
                    this.modal = modalHtml;
                    this.bindEvents();
                    this.isLoaded = true;
                    return true;
                }
            } catch (err) {
                console.error("Erro ao carregar o popup:", err);
            }
            return false;
        },

        async open() {
            const success = await this.loadPopup();
            if (!success) return;

            this.modal.style.display = 'flex';
            setTimeout(() => this.modal.classList.add('active'), 10);
            document.body.style.overflow = 'hidden';
            
            this.steps = Array.from(this.modal.querySelectorAll('.form-step'));
            this.progressBar = this.modal.querySelector('.progress-bar');
            this.prevBtn = this.modal.querySelector('.btn-prev');
            this.nextBtn = this.modal.querySelector('.btn-next');
            this.closeBtn = this.modal.querySelector('.modal-close');
            
            this.resetForm();
            this.showStep(0);
        },

        bindEvents() {
            this.modal.querySelector('.modal-close').addEventListener('click', () => this.close());
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) this.close();
            });

            this.modal.querySelector('.btn-next').addEventListener('click', () => this.handleNext());
            this.modal.querySelector('.btn-prev').addEventListener('click', () => this.handlePrev());

            this.modal.addEventListener('click', (e) => {
                const option = e.target.closest('.option-item');
                if (option) this.selectOption(option);
            });

            this.modal.addEventListener('input', () => this.syncData());
            this.modal.addEventListener('change', () => this.syncData());
        },

        close() {
            this.modal.classList.remove('active');
            setTimeout(() => {
                this.modal.style.display = 'none';
                document.body.style.overflow = '';
            }, 300);
        },

        resetForm() {
            this.currentStep = 0;
            this.formData = {
                empresa: '',
                presenca: '',
                site: '',
                instagram: '',
                interesse: '',
                volume: '',
                nivel: '',
                email: ''
            };
            this.modal.querySelectorAll('input').forEach(el => el.value = '');
            this.modal.querySelectorAll('.option-item').forEach(el => el.classList.remove('selected'));
            this.updateConditionalVisibility();
        },

        selectOption(target) {
            const field = target.dataset.field;
            const value = target.dataset.value;

            const container = target.closest('.options-grid');
            container.querySelectorAll('.option-item').forEach(opt => opt.classList.remove('selected'));
            target.classList.add('selected');

            this.formData[field] = value;
            this.updateConditionalVisibility();
            this.validate();
        },

        updateConditionalVisibility() {
            const presenca = this.formData.presenca || '';
            const siteGroup = document.getElementById('group-site');
            const instaGroup = document.getElementById('group-insta');

            if (siteGroup) siteGroup.classList.toggle('active', presenca.toLowerCase().includes('site'));
            if (instaGroup) instaGroup.classList.toggle('active', presenca.toLowerCase().includes('instagram'));
        },

        syncData() {
            this.formData.empresa = document.getElementById('nome-empresa')?.value.trim() || '';
            this.formData.site = document.getElementById('url-site')?.value.trim() || '';
            this.formData.instagram = document.getElementById('user-insta')?.value.trim() || '';
            this.formData.email = document.getElementById('email-contato')?.value.trim() || '';
            this.validate();
        },

        validate() {
            let isValid = false;
            const stepsCount = this.steps.length;

            switch(this.currentStep) {
                case 0: isValid = this.formData.empresa.length >= 2; break;
                case 1:
                    isValid = !!this.formData.presenca;
                    if (isValid && this.formData.presenca.toLowerCase().includes('site') && !this.formData.site) isValid = false;
                    if (isValid && this.formData.presenca.toLowerCase().includes('instagram') && !this.formData.instagram) isValid = false;
                    break;
                case 2: isValid = !!this.formData.interesse; break;
                case 3: isValid = !!this.formData.volume; break;
                case 4: isValid = !!this.formData.nivel; break;
                case 5: 
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    isValid = emailRegex.test(this.formData.email); 
                    break;
                case 6: isValid = true; break;
            }

            this.nextBtn.disabled = !isValid;
        },

        showStep(index) {
            this.currentStep = index;
            this.steps.forEach((step, i) => step.classList.toggle('active', i === index));

            const progress = ((index + 1) / this.steps.length) * 100;
            if (this.progressBar) this.progressBar.style.width = `${progress}%`;

            this.prevBtn.style.visibility = index === 0 ? 'hidden' : 'visible';
            
            if (index === this.steps.length - 1) {
                this.nextBtn.textContent = 'Ver como automatizar minha empresa';
                this.nextBtn.classList.add('btn-finish');
            } else {
                this.nextBtn.textContent = 'Próximo Passo';
                this.nextBtn.classList.remove('btn-finish');
            }
            
            this.validate();
            this.modal.querySelector('.modal-content').scrollTop = 0;
        },

        handleNext() {
            if (this.currentStep < this.steps.length - 1) {
                this.showStep(this.currentStep + 1);
            } else {
                this.sendWhatsApp();
            }
        },

        handlePrev() {
            if (this.currentStep > 0) this.showStep(this.currentStep - 1);
        },

        sendWhatsApp() {
            const phone = "5562984954032";
            const text = `Olá, vim pelo site da Next Flow AI e tenho interesse em aplicar automação na minha empresa.

Empresa: ${this.formData.empresa}

Presença online: ${this.formData.presenca}
${this.formData.site ? `Site: ${this.formData.site}` : ''}
${this.formData.instagram ? `Instagram: ${this.formData.instagram}` : ''}

Área que desejo automatizar:
${this.formData.interesse}

Volume de contatos/mensagens por mês:
${this.formData.volume}

Nível atual de automação:
${this.formData.nivel}

Email para contato:
${this.formData.email}

Podemos marcar uma conversa para entender como aplicar automação na minha empresa?`;

            const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
            window.open(url, '_blank');
            this.close();
        }
    };

    if (document.readyState === 'complete') LeadPopup.init();
    else window.addEventListener('load', () => LeadPopup.init());
})();
