document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    const telefoneInput = document.getElementById('telefone');
    const mensagemInput = document.getElementById('mensagem');
    const charCount = document.getElementById('char-count');
    const totalContactsSpan = document.getElementById('total-contacts');
    const toast = document.getElementById('toast');

    // Inicializar contador de contatos cadastrados
    atualizarContadorContatos();

    // 1. Máscara de Telefone (00) 00000-0000
    telefoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);

        if (value.length > 6) {
            value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
        } else if (value.length > 2) {
            value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
        } else if (value.length > 0) {
            value = `(${value}`;
        }
        e.target.value = value;
    });

    // 2. Contador de Caracteres na Mensagem
    mensagemInput.addEventListener('input', () => {
        charCount.textContent = mensagemInput.value.length;
    });

    // Validar E-mail com Regex
    function validarEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    // Exibir erro em um campo
    function mostrarErro(elementId, mensagem, inputElement) {
        const errorSpan = document.getElementById(`error-${elementId}`);
        if (errorSpan) errorSpan.textContent = mensagem;
        if (inputElement) {
            inputElement.classList.add('input-error');
            // Remove a classe de erro ao digitar novamente
            inputElement.addEventListener('input', () => {
                inputElement.classList.remove('input-error');
                if (errorSpan) errorSpan.textContent = '';
            }, { once: true });
        }
    }

    // Limpar todas as mensagens de erro
    function limparErros() {
        document.querySelectorAll('.error-message').forEach(span => span.textContent = '');
        document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
    }

    // 3. Submissão e Validação do Formulário
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Impede o recarregamento da página
        limparErros();

        let isValid = true;

        // Validar Nome
        const nome = document.getElementById('nome');
        if (!nome.value.trim()) {
            mostrarErro('nome', 'Por favor, informe seu nome.', nome);
            isValid = false;
        }

        // Validar E-mail
        const email = document.getElementById('email');
        if (!email.value.trim()) {
            mostrarErro('email', 'Por favor, informe seu e-mail.', email);
            isValid = false;
        } else if (!validarEmail(email.value.trim())) {
            mostrarErro('email', 'Insira um e-mail válido (ex: nome@dominio.com).', email);
            isValid = false;
        }

        // Validar Telefone
        if (!telefoneInput.value.trim()) {
            mostrarErro('telefone', 'Por favor, informe seu telefone.', telefoneInput);
            isValid = false;
        } else if (telefoneInput.value.replace(/\D/g, '').length < 10) {
            mostrarErro('telefone', 'Telefone incompleto. Digite com DDD.', telefoneInput);
            isValid = false;
        }

        // Validar Data de Nascimento
        const dataNascimento = document.getElementById('dataNascimento');
        if (!dataNascimento.value) {
            mostrarErro('dataNascimento', 'Selecione sua data de nascimento.', dataNascimento);
            isValid = false;
        }

        // Validar Assunto
        const assunto = document.getElementById('assunto');
        if (!assunto.value) {
            mostrarErro('assunto', 'Selecione um assunto.', assunto);
            isValid = false;
        }

        // Validar Tipo de Contato
        const tipoContato = document.querySelector('input[name="tipoContato"]:checked');
        if (!tipoContato) {
            mostrarErro('tipoContato', 'Selecione uma opção de contato.');
            isValid = false;
        }

        // Validar Mensagem
        if (!mensagemInput.value.trim()) {
            mostrarErro('mensagem', 'Escreva uma mensagem.', mensagemInput);
            isValid = false;
        }

        // Validar Termos
        const termos = document.getElementById('termos');
        if (!termos.checked) {
            mostrarErro('termos', 'Você deve aceitar os termos para continuar.', termos);
            isValid = false;
        }

        if (!isValid) {
            exibirToast('Por favor, corrija os erros no formulário! ❌', 'error');
            return;
        }

        // Salvar no localStorage
        const novoContato = {
            id: Date.now(),
            nome: nome.value.trim(),
            email: email.value.trim(),
            telefone: telefoneInput.value,
            dataNascimento: dataNascimento.value,
            assunto: assunto.value,
            tipoContato: tipoContato.value,
            mensagem: mensagemInput.value.trim(),
            dataCadastro: new Date().toLocaleString('pt-BR')
        };

        const contatos = JSON.parse(localStorage.getItem('contatos_site') || '[]');
        contatos.push(novoContato);
        localStorage.setItem('contatos_site', JSON.stringify(contatos));

        // Atualizar exibição
        atualizarContadorContatos();
        exibirToast('Mensagem enviada com sucesso! 🎉', 'success');
        form.reset();
        charCount.textContent = '0';
    });

    function atualizarContadorContatos() {
        const contatos = JSON.parse(localStorage.getItem('contatos_site') || '[]');
        totalContactsSpan.textContent = contatos.length;
    }

    function exibirToast(mensagem, tipo) {
        toast.textContent = mensagem;
        toast.className = `toast ${tipo}`;
        
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 3500);
    }
});