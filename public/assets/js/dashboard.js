const token = localStorage.getItem('token');
let username = 'Usuário';
let currentCursoId = null;
let currentCurso = null;

if (!token) {
    window.location.href = '/login';
} else {
    try {
        const decoded = jwt_decode(token);
        username = decoded.name;
    } catch (error) {
        console.error('Token inválido:', error);
        displayMessage('Token inválido. Por favor, faça login novamente.', 'error');
        setTimeout(() => {
            window.location.href = '/login';
        }, 3000);
    }
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
}

function displayMessage(msg, type) {
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = msg;
    document.body.appendChild(messageDiv); 

    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

async function showHome() {
    const content = document.getElementById('content-text');
    content.innerHTML = `
        <h2>Bem-vindo, <span id="username">${username}</span>!</h2>
        <p>Você está autenticado. Utilize as opções acima para navegar.</p>
        <h3>Sobre a Plataforma</h3>
        <p>Esta plataforma oferece diversos cursos com foco em linguagens de programação, como JavaScript e Python. Inscreva-se nos cursos de seu interesse e aprenda no seu próprio ritmo, com materiais práticos e interativos.</p>
        <h3>FAQs</h3>
        <div class="faq">
            <div class="faq-item">
                <h4 onclick="toggleElement('faq1')">Como participar de quizzes?</h4>
                <div id="faq1" class="faq-content hidden">
                    <p>Para participar de quizzes, vá até a seção "Explorar Cursos", inscreva-se em um curso e acesse as aulas que possuem quizzes interativos.</p>
                </div>
            </div>
            <div class="faq-item">
                <h4 onclick="toggleElement('faq2')">Como acessar os módulos?</h4>
                <div id="faq2" class="faq-content hidden">
                    <p>Na seção "Meus Cursos", você encontrará a lista de cursos nos quais está inscrito. Clique em um curso para visualizar os módulos disponíveis.</p>
                </div>
            </div>
            <div class="faq-item">
                <h4 onclick="toggleElement('faq3')">Como alterar meus dados?</h4>
                <div id="faq3" class="faq-content hidden">
                    <p>Para alterar seus dados pessoais, clique em "Meus Dados" na barra de navegação e edite suas informações.</p>
                </div>
            </div>
            <div class="faq-item">
                <h4 onclick="toggleElement('faq4')">Como sair da conta?</h4>
                <div id="faq4" class="faq-content hidden">
                    <p>Para sair da sua conta, clique no botão "Logout" no canto superior direito da página.</p>
                </div>
            </div>
        </div>
    `;
}


async function showExplorarCursos() {
    const content = document.getElementById('content-text');

    try {
        const response = await fetch('/cursos');
        if (!response.ok) {
            throw new Error('Erro ao buscar cursos.');
        }
        const cursos = await response.json();

        const inscricoesResponse = await fetch('/cursos/inscricoes', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        let inscricoes = [];
        if (inscricoesResponse.ok) {
            inscricoes = await inscricoesResponse.json();
        }

        let cursosHTML = `
            <h2>Explorar Cursos</h2>
            <div class="cursos-list">
                ${cursos.map(curso => {
                    const inscrito = inscricoes.some(inscricao => inscricao.curso_id === curso.id);
                    return `
                    <div class="curso-item">
                        <img src="/assets/img/${curso.imagem}" alt="${curso.nome}" class="curso-imagem">
                        <h3>${curso.nome}</h3>
                        <p>${curso.descricao}</p>
                        ${inscrito ? 
                            '<button class="btn inscrito-btn" disabled>Inscrito</button>' : 
                            `<button onclick="inscreverCurso(${curso.id})" class="btn inscrever-btn">Inscrever-se</button>`
                        }
                    </div>
                `;
                }).join('')}
            </div>
        `;

        content.innerHTML = cursosHTML;
    } catch (error) {
        console.error('Erro:', error);
        content.innerHTML = `<p>Erro ao carregar cursos. Por favor, tente novamente mais tarde.</p>`;
    }
}

async function inscreverCurso(cursoId) {
    try {
        const response = await fetch('/cursos/inscrever', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ curso_id: cursoId })
        });

        const data = await response.json();

        if (response.ok) {
            displayMessage(data.message, 'success');
            showExplorarCursos();
        } else {
            displayMessage(data.error, 'error');
        }
    } catch (error) {
        console.error('Erro:', error);
        displayMessage('Erro ao inscrever-se no curso. Por favor, tente novamente.', 'error');
    }
}

async function showMeusCursos() {
    const content = document.getElementById('content-text');

    try {
        const response = await fetch('/cursos/inscricoes', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        if (!response.ok) {
            throw new Error('Erro ao buscar suas inscrições.');
        }
        const inscricoes = await response.json();

        if (inscricoes.length === 0) {
            content.innerHTML = `<p>Você ainda não está inscrito em nenhum curso.</p>`;
            return;
        }

        let inscricoesHTML = `
            <h2>Meus Cursos</h2>
            <div class="inscricoes-list">
                ${inscricoes.map(inscricao => {
                    if (!inscricao.curso_id) {
                        console.warn('Inscrição sem curso_id:', inscricao);
                        return '';
                    }
                    return `
                    <div class="inscricao-item">
                        <img src="/assets/img/${inscricao.imagem}" alt="${inscricao.nome}" class="curso-imagem">
                        <h3>${inscricao.nome}</h3>
                        <p>${inscricao.descricao}</p>
                        <p><strong>Progresso:</strong> ${inscricao.progresso}%</p>
                        <button onclick="mostrarCursoDetalhes(${inscricao.curso_id})" class="btn secondary-btn">Ver Curso</button>
                    </div>
                `;
                }).join('')}
            </div>
        `;

        content.innerHTML = inscricoesHTML;
    } catch (error) {
        console.error('Erro:', error);
        content.innerHTML = `<p>Erro ao carregar seus cursos. Por favor, tente novamente mais tarde.</p>`;
    }
}

async function mostrarCursoDetalhes(cursoId) {
    if (!cursoId) {
        displayMessage('ID do curso inválido.', 'error');
        return;
    }

    const content = document.getElementById('content-text');
    currentCursoId = cursoId;

    try {
        const response = await fetch(`/cursos/${cursoId}`);
        if (!response.ok) {
            throw new Error('Erro ao buscar detalhes do curso.');
        }
        const curso = await response.json();
        currentCurso = curso;

        let detalhesHTML = `
            <h2>${curso.nome}</h2>
            <p>${curso.descricao}</p>
            <div class="modulos-list">
                ${curso.modulos.map(modulo => `
                    <div class="modulo-item">
                        <h3 onclick="toggleModulo('${modulo.id}', '${modulo.nome}')">Módulo ${modulo.ordem}: ${modulo.nome}</h3>
                        <div id="modulo-${modulo.id}" class="modules">
                            ${modulo.aulas.map(aula => `
                                <div class="lesson-item">
                                    <h4 onclick="mostrarAula(${aula.id}, ${curso.id})">${aula.titulo}</h4>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
            <button onclick="showMeusCursos()" class="btn voltar-btn">Voltar aos Meus Cursos</button>
        `;

        content.innerHTML = detalhesHTML;
    } catch (error) {
        console.error('Erro:', error);
        content.innerHTML = `<p>Erro ao carregar detalhes do curso. Por favor, tente novamente mais tarde.</p>`;
    }
}

function toggleModulo(moduloId, moduloNome) {
    const modulosList = document.querySelector('.modulos-list');
    const content = document.getElementById('content-text');

    const modulo = currentCurso.modulos.find(m => m.id == moduloId);

    if (modulo) {
        modulosList.style.display = 'none';

        let lessonsHTML = `
            <h2>${modulo.nome}</h2>
            <div class="lessons">
                ${modulo.aulas.map(aula => `
                    <div class="lesson-item">
                        <h4 onclick="mostrarAula(${aula.id}, ${currentCursoId})">${aula.titulo}</h4>
                    </div>
                `).join('')}
            </div>
            <button onclick="voltarParaModulos()" class="btn voltar-btn">Voltar aos Módulos</button>
        `;

        content.innerHTML = lessonsHTML;
    }
}

function voltarParaModulos() {
    mostrarCursoDetalhes(currentCursoId);
}

async function mostrarAula(aulaId, cursoId) {
    const content = document.getElementById('content-text');

    try {
        const response = await fetch(`/cursos/aulas/${aulaId}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar detalhes da aula.');
        }

        const aula = await response.json();

        const renderedContent = marked.parse(aula.conteudo);

        let aulaHTML = `
            <h2>${aula.titulo}</h2>
            <div class="lesson-content">
                ${renderedContent}
            </div>
            ${aula.quiz ? `
                <div class="lesson-buttons">
                    <button onclick="toggleQuiz()" class="btn btn-quiz">Mostrar Quiz</button>
                    <button onclick="marcarAulaConcluida(${aula.id}, ${cursoId})" class="btn btn-complete">Marcar Aula como Concluída</button>
                    <button onclick="mostrarCursoDetalhes(${cursoId})" class="btn btn-back">Voltar ao Curso</button>
                </div>
                <div id="quiz-section" class="quiz-section hidden">
                    ${aula.quiz.questions.map((q, index) => `
                        <div class="quiz-question">
                            <p><strong>Pergunta ${index + 1}:</strong> ${q.question}</p>
                            <ul>
                                ${q.options.map(option => `
                                    <li><label><input type="radio" name="quiz-q${q.id}" value="${option.charAt(0)}"> ${option}</label></li>
                                `).join('')}
                            </ul>
                            <button onclick="verificarResposta(${q.id}, '${q.correct_option}')" class="btn quiz-button">Enviar Resposta</button>
                            <p id="quiz-answer-${q.id}" class="quiz-answer"></p>
                        </div>
                    `).join('')}
                </div>
            ` : `
                <div class="lesson-buttons">
                    <button onclick="marcarAulaConcluida(${aula.id}, ${cursoId})" class="btn btn-complete">Marcar Aula como Concluída</button>
                    <button onclick="mostrarCursoDetalhes(${cursoId})" class="btn btn-back">Voltar ao Curso</button>
                </div>
            `}
        `;

        content.innerHTML = aulaHTML;

        // Adicionar botões de copiar aos blocos de código
        const codeBlocks = document.querySelectorAll('.lesson-content pre code');
        codeBlocks.forEach((block) => {
            const pre = block.parentElement;
            const copyButton = document.createElement('button');
            copyButton.className = 'copy-code-btn';
            copyButton.textContent = 'Copiar Código';
            copyButton.addEventListener('click', () => {
                navigator.clipboard.writeText(block.textContent).then(() => {
                    displayMessage('Código copiado para a área de transferência!', 'success');
                }, (err) => {
                    displayMessage('Erro ao copiar o código.', 'error');
                });
            });
            pre.appendChild(copyButton);
        });

    } catch (error) {
        console.error('Erro:', error);
        content.innerHTML = `<p>Erro ao carregar a aula. Por favor, tente novamente mais tarde.</p>`;
    }
}


function toggleQuiz() {
    const quizSection = document.getElementById('quiz-section');
    if (quizSection) {
        quizSection.classList.toggle('hidden');
    }
}

async function marcarAulaConcluida(aulaId, cursoId) {
    try {
        const response = await fetch('/cursos/progresso/concluir', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ aula_id: aulaId })
        });

        const data = await response.json();

        if (response.ok) {
            displayMessage(data.message, 'success');
            mostrarCursoDetalhes(cursoId);
        } else {
            displayMessage(data.error, 'error');
        }
    } catch (error) {
        console.error('Erro:', error);
        displayMessage('Erro ao marcar aula como concluída. Por favor, tente novamente.', 'error');
    }
}

function toggleElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.toggle('hidden');
    }
}

function verificarResposta(questionId, correctOption) {
    const selectedOption = document.querySelector(`input[name="quiz-q${questionId}"]:checked`);
    const answerPara = document.getElementById(`quiz-answer-${questionId}`);

    if (selectedOption) {
        const userAnswer = selectedOption.value;
        if (userAnswer === correctOption) {
            answerPara.textContent = 'Correto! 🎉';
            answerPara.style.color = '#28BDD2';
        } else {
            const correctOptionLabel = Array.from(document.querySelectorAll(`input[name="quiz-q${questionId}"]`))
                .find(input => input.value === correctOption)?.parentElement.textContent.trim();
            answerPara.textContent = 'Incorreto. A resposta correta é: ' + correctOptionLabel;
            answerPara.style.color = '#f8d7da';
        }
    } else {
        answerPara.textContent = 'Por favor, selecione uma opção.';
        answerPara.style.color = '#f8d7da';
    }
}

async function viewMembers() {
    fetch('/users/', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao buscar membros.');
        }
        return response.json();
    })
    .then(data => {
        let membersTable = `
            <table class="members-list">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
        `;
        data.forEach((member) => {
            membersTable += `
                <tr>
                    <td>${member.name}</td>
                    <td>${member.email}</td>
                </tr>
            `;
        });
        membersTable += `
                </tbody>
            </table>
        `;

        const content = document.getElementById('content-text');
        content.innerHTML = `
            <h2>Outros Membros</h2>
            ${membersTable}
        `;
    })
    .catch(error => {
        console.error('Erro:', error);
        displayMessage('Erro ao carregar os membros. Por favor, tente novamente.', 'error');
    });
}

async function viewProfile() {
    fetch('/users/me', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao buscar dados do usuário.');
        }
        return response.json();
    })
    .then(data => {
        const content = document.getElementById('content-text');
        content.innerHTML = `
            <h2>Meus Dados</h2>
            <div class="profile-info">
                <div class="profile-field">
                    <label>Nome:</label>
                    <span>${data.name}</span>
                </div>
                <div class="profile-field">
                    <label>Email:</label>
                    <span>${data.email}</span>
                </div>
                <div class="profile-buttons">
                    <button onclick="editProfile('${data.name}', '${data.email}')" class="btn secondary-btn">Editar Dados</button>
                    <button onclick="changePassword()" class="btn secondary-btn">Alterar Senha</button>
                    <button onclick="confirmDeleteAccount()" class="btn danger-btn">Apagar Conta</button>
                </div>
            </div>
        `;
    })
    .catch(error => {
        console.error('Erro:', error);
        displayMessage('Erro ao carregar seus dados. Por favor, tente novamente.', 'error');
    });
}

function editProfile(currentName, currentEmail) {
    const content = document.getElementById('content-text');
    content.innerHTML = `
        <h2>Editar Meus Dados</h2>
        <div class="edit-profile-form">
            <label for="edit-name">Nome:</label>
            <input type="text" id="edit-name" name="edit-name" value="${currentName}">
            <label for="edit-email">Email:</label>
            <input type="email" id="edit-email" name="edit-email" value="${currentEmail}">
            <label for="current-password">Senha Atual:</label>
            <input type="password" id="current-password" name="current-password">
            <div class="form-buttons">
                <button onclick="saveProfile()" class="btn primary-btn">Salvar Alterações</button>
                <button onclick="viewProfile()" class="btn secondary-btn">Cancelar</button>
            </div>
        </div>
    `;
}


async function saveProfile() {
    const name = document.getElementById('edit-name').value.trim();
    const email = document.getElementById('edit-email').value.trim();
    const currentPassword = document.getElementById('current-password').value;

    if (!currentPassword) {
        displayMessage('Por favor, insira sua senha atual para confirmar.', 'error');
        return;
    }

    try {
        const response = await fetch('/users/me', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ name, email, currentPassword })
        });

        const data = await response.json();

        if (response.ok) {
            displayMessage('Dados atualizados com sucesso!', 'success');
            viewProfile();
        } else {
            displayMessage(data.error || 'Erro ao atualizar os dados.', 'error');
        }
    } catch (error) {
        console.error('Erro:', error);
        displayMessage('Erro ao atualizar os dados. Por favor, tente novamente.', 'error');
    }
}

function changePassword() {
    const content = document.getElementById('content-text');
    content.innerHTML = `
        <h2>Alterar Senha</h2>
        <div class="change-password-form">
            <label for="current-password">Senha Atual:</label>
            <input type="password" id="current-password" name="current-password">
            <label for="new-password">Nova Senha:</label>
            <input type="password" id="new-password" name="new-password">
            <label for="confirm-password">Confirme a Nova Senha:</label>
            <input type="password" id="confirm-password" name="confirm-password">
            <div class="form-buttons">
                <button onclick="savePassword()" class="btn primary-btn">Alterar Senha</button>
                <button onclick="viewProfile()" class="btn secondary-btn">Cancelar</button>
            </div>
        </div>
    `;
}

async function savePassword() {
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (newPassword !== confirmPassword) {
        displayMessage('A nova senha e a confirmação não correspondem.', 'error');
        return;
    }

    try {
        const response = await fetch('/users/me/password', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ currentPassword, newPassword })
        });

        const data = await response.json();

        if (response.ok) {
            displayMessage('Senha alterada com sucesso!', 'success');
            viewProfile();
        } else {
            displayMessage(data.error, 'error');
        }
    } catch (error) {
        console.error('Erro:', error);
        displayMessage('Erro ao alterar a senha. Por favor, tente novamente.', 'error');
    }
}

function confirmDeleteAccount() {
    const content = document.getElementById('content-text');
    content.innerHTML = `
        <h2>Confirmar Exclusão da Conta</h2>
        <div class="delete-account-form">
            <p>Digite sua senha para confirmar a exclusão da conta.</p>
            <label for="delete-password">Senha:</label>
            <input type="password" id="delete-password" name="delete-password">
            <div class="form-buttons">
                <button onclick="deleteAccount()" class="btn danger-btn">Apagar Conta</button>
                <button onclick="viewProfile()" class="btn secondary-btn">Cancelar</button>
            </div>
        </div>
    `;
}

async function deleteAccount() {
    const password = document.getElementById('delete-password').value;

    if (!password) {
        displayMessage('Por favor, insira sua senha para confirmar.', 'error');
        return;
    }

    try {
        const response = await fetch('/users/me', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ password })
        });

        const data = await response.json();

        if (response.ok) {
            displayMessage('Conta deletada com sucesso.', 'success');
            setTimeout(() => {
                logout();
            }, 2000);
        } else {
            displayMessage(data.error, 'error');
        }
    } catch (error) {
        console.error('Erro:', error);
        displayMessage('Erro ao apagar a conta. Por favor, tente novamente.', 'error');
    }
}

showHome();
