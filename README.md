# Trabalho Final da IA22 - Site de Cursos de Programação

Bem-vindo ao **Kodix Cursos**! Este projeto consiste em um site básico completo de cursos de programação, incluindo frontend, backend, banco de dados, validação, autenticação e medidas básicas de segurança. O site oferece funcionalidades como registro de usuários, login, inscrição em cursos, visualização de aulas e quizzes, acompanhamento de progresso, atualização de dados pessoais, alteração de senha e logout. Além disso, há páginas públicas acessíveis para usuários não autenticados.

Atualmente, a plataforma disponibiliza dois cursos de programação: **Python** e **JavaScript**. Cada curso é composto por módulos e aulas interativas com quizzes para avaliar o aprendizado dos usuários. Veja abaixo uma imagem da página inicial (Home) pública, acessível a todos, mesmo sem login:

![Página Principal Home](./public/assets/img/kodix.png) 

---

## Índice

1. [Introdução](#1-introdução)
2. [Sumário Geral](#2-sumário-geral)
3. [Sumário Técnico](#3-sumário-técnico)
4. [Pré-requisitos](#4-pré-requisitos)
5. [Métodos de Configuração e Execução](#5-métodos-de-configuração-e-execução)
   - [5.1. Usando GitHub Codespaces](#51-usando-github-codespaces)
   - [5.2. Clonando o Repositório com Git](#52-clonando-o-repositório-com-git)
6. [Configuração do Ambiente de Desenvolvimento](#6-configuração-do-ambiente-de-desenvolvimento)
7. [Rodando o Projeto](#7-rodando-o-projeto)
8. [Estrutura do Projeto](#8-estrutura-do-projeto)
9. [Rotas, Páginas e Funcionalidades](#9-rotas-páginas-e-funcionalidades)
10. [Comandos Úteis](#10-comandos-úteis)
11. [Testando o Projeto](#11-testando-o-projeto)
12. [Tratando Erros Comuns](#12-tratando-erros-comuns)
13. [Contribuindo](#13-contribuindo)
14. [Licença](#14-licença)
15. [Contato](#15-contato)
16. [Boas Práticas e Recomendações](#16-boas-práticas-e-recomendações)
17. [Recursos Adicionais](#17-recursos-adicionais)
18. [Agradecimentos Finais](#18-agradecimentos-finais)

---

## 1. Introdução

Neste projeto, desenvolvi um site de cursos de programação com funcionalidades completas, incluindo autenticação, validação e medidas básicas de segurança. A plataforma permite que os usuários:

- Realizem registro e login;
- Inscrevam-se nos cursos disponíveis;
- Acessem aulas e quizzes interativos;
- Visualizem e acompanhem seu progresso nos cursos;
- Atualizem seus dados pessoais e senhas;
- Apaguem suas contas;
- Efetuem logout.

O objetivo é proporcionar uma experiência de aprendizado funcional e segura, alinhada às melhores práticas de desenvolvimento web.

---

## 2. Sumário Geral

- **Frontend**: Desenvolvido com HTML, CSS e JavaScript para interação do usuário.
- **Backend**: Construído com Node.js e Express, utilizando TypeScript para tipagem estática.
- **Banco de Dados**: SQLite para armazenamento de dados de usuários, cursos, módulos, aulas e progresso.
- **Autenticação e Validação**: Implementação de JWT para autenticação e validação de dados com Zod.
- **Segurança**: Medidas básicas de segurança como CORS, Helmet e rate limiting.

---

## 3. Sumário Técnico

### Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript no servidor.
- **Express.js**: Framework para construção de APIs RESTful.
- **TypeScript**: Superset do JavaScript que adiciona tipagem estática.
- **SQLite**: Banco de dados relacional leve.
- **bcrypt**: Biblioteca para hashing de senhas.
- **jsonwebtoken**: Biblioteca para criação e verificação de tokens JWT.
- **Zod**: Biblioteca para validação de dados.
- **Helmet**: Middleware para segurança de cabeçalhos HTTP.
- **express-rate-limit**: Middleware para limitar requisições.
- **cors**: Middleware para habilitar CORS.
- **dotenv**: Biblioteca para gerenciamento de variáveis de ambiente.
- **Nodemon**: Ferramenta para reiniciar automaticamente o servidor durante o desenvolvimento.
- **VS Code**: Editor de código recomendado.

### Estrutura de Diretórios

```plaintext
2024-3TRI-IA22-TRABALHO-FINAL/
│
├── node_modules/               # Pacotes instalados pelo npm
│   └── ...
├── public/                     # Arquivos estáticos públicos
│   ├── assets/                 # Recursos como imagens e estilos
│   │   ├── img/
│   │   └── css/
│   │       ├── style.css
│   │       └── pages/
│   │           ├── 404.css
│   │           ├── dashboard.css
│   │           ├── home.css
│   │           ├── login.css
│   │           ├── ratelimit.css
│   │           └── registrar.css
│   ├── 404.html
│   ├── acesso-privado.html
│   ├── acesso-publico.html
│   ├── login.html
│   ├── ratelimit.html
│   └── registrar.html
├── src/                        # Código-fonte TypeScript do servidor
│   ├── controllers/            # Controladores da aplicação
│   │   ├── authController.ts
│   │   ├── courseController.ts
│   │   ├── enrollmentController.ts
│   │   ├── progressController.ts
│   │   └── userController.ts
│   ├── middlewares/            # Middlewares personalizados
│   │   ├── course.middleware.ts
│   │   ├── errorHandler.ts
│   │   ├── jwt.middleware.ts
│   │   ├── securityMiddleware.ts
│   │   └── user.middleware.ts
│   ├── routes/                 # Definição das rotas
│   │   ├── authRoutes.ts
│   │   ├── courseRoutes.ts
│   │   ├── index.ts
│   │   ├── staticRoutes.ts
│   │   └── userRoutes.ts
│   ├── schemas/                # Schemas de validação com Zod
│   │   ├── courseSchema.ts
│   │   └── userSchema.ts
│   ├── utils/                  # Funções utilitárias
│   │   └── jwtPromise.ts
│   ├── database.ts             # Configuração do banco de dados SQLite
│   └── index.ts                # Ponto de entrada da aplicação
├── dist/                       # Arquivos compilados do TypeScript
│   └── ...                     # Gerado após 'npm run build'
├── data/                       # Arquivos de dados iniciais
│   └── cursos.json
├── .env                        # Variáveis de ambiente
├── .gitignore                  # Arquivos ignorados pelo Git
├── package.json                # Dependências e scripts do npm
├── package-lock.json           # Versões exatas das dependências
├── tsconfig.json               # Configurações do TypeScript
└── README.md                   # Documentação do projeto
```

---

## 4. Pré-requisitos

Antes de iniciar, certifique-se de que você possui os seguintes softwares instalados em seu sistema:

### 4.1. Git

**Verificando a instalação do Git**

Abra o terminal (Linux/Mac) ou o Prompt de Comando (Windows) e digite:

```bash
git --version
```

Se o Git não estiver instalado, siga as instruções abaixo para instalá-lo.

#### 4.1.1. Instalando o Git

- **Windows**:
  - Baixe o instalador do Git [aqui](https://git-scm.com/download/win).
  - Execute o instalador e siga as instruções na tela.

- **Mac**:
  - Use o Homebrew:
    ```bash
    brew install git
    ```

- **Linux**:
  - **Debian/Ubuntu**:
    ```bash
    sudo apt update
    sudo apt install git
    ```
  - **Fedora**:
    ```bash
    sudo dnf install git
    ```
  - **Arch Linux**:
    ```bash
    sudo pacman -S git
    ```

### 4.2. Node.js

**Verificando a instalação do Node.js**

No terminal ou Prompt de Comando, digite:

```bash
node -v
npm -v
```

Se o Node.js não estiver instalado, siga as instruções abaixo para instalá-lo.

#### 4.2.1. Instalando o Node.js

- **Windows/Mac**:
  - Baixe o instalador do Node.js [aqui](https://nodejs.org/) e siga as instruções na tela.

- **Linux**:
  - **Debian/Ubuntu**:
    ```bash
    sudo apt update
    sudo apt install nodejs npm
    ```
  - **Fedora**:
    ```bash
    sudo dnf install nodejs npm
    ```
  - **Arch Linux**:
    ```bash
    sudo pacman -S nodejs npm
    ```

### 4.3. Visual Studio Code

**Verificando a instalação do Visual Studio Code**

Digite `code --version` no terminal ou verifique no menu de aplicativos. Se o VS Code não estiver instalado, siga as instruções abaixo para instalá-lo.

#### 4.3.1. Instalando o Visual Studio Code

- **Windows/Mac**:
  - Baixe o instalador do VS Code [aqui](https://code.visualstudio.com/) e siga as instruções na tela.

- **Linux**:
  - **Debian/Ubuntu**:
    ```bash
    sudo apt update
    sudo apt install software-properties-common apt-transport-https wget
    wget -q https://packages.microsoft.com/keys/microsoft.asc -O- | sudo apt-key add -
    sudo add-apt-repository "deb [arch=amd64] https://packages.microsoft.com/repos/vscode stable main"
    sudo apt update
    sudo apt install code
    ```
  - **Fedora**:
    ```bash
    sudo rpm --import https://packages.microsoft.com/keys/microsoft.asc
    sudo sh -c 'echo -e "[code]\nname=Visual Studio Code\nbaseurl=https://packages.microsoft.com/yumrepos/vscode\nenabled=1\ngpgcheck=1\ngpgkey=https://packages.microsoft.com/keys/microsoft.asc" > /etc/yum.repos.d/vscode.repo'
    sudo dnf install code
    ```
  - **Arch Linux**:
    ```bash
    sudo pacman -S code
    ```

---

## 5. Métodos de Configuração e Execução

Existem dois métodos principais para configurar e executar este projeto:

1. **Usando GitHub Codespaces**
2. **Clonando o Repositório com Git**

### 5.1. Usando GitHub Codespaces

**GitHub Codespaces** oferece um ambiente de desenvolvimento completo baseado em nuvem diretamente no GitHub. Siga os passos abaixo para configurar e executar o projeto usando Codespaces.

#### Passo a Passo

1. **Acesse o Repositório no GitHub**

   Vá para o repositório [2024-3TRI-IA22-TRABALHO-FINAL](https://github.com/YanWeberFrancelino/2024-3TRI-IA22-TRABALHO-FINAL) no GitHub.

2. **Inicie um Codespace**

   - Clique no botão **Code** (verde) e selecione a aba **Codespaces**.
   - Clique em **Create codespace on main**.

3. **Aguarde a Inicialização**

   O GitHub irá configurar e inicializar o Codespace. Este processo pode levar alguns minutos.

4. **Instale as Dependências**

   No terminal integrado do Codespace, execute:

   ```bash
   npm install
   ```

5. **Configure as Variáveis de Ambiente**

   Crie um arquivo `.env` na raiz do projeto caso não exista, com as seguintes variáveis:

   ```env
   PORT=4060
   JWT_SECRET=seu_segredo_jwt
   JWT_EXPIRES_IN=24h
   ```

6. **Compile o Projeto**

   Execute:

   ```bash
   npm run build
   ```

7. **Inicie o Servidor em Modo de Desenvolvimento**

   Execute:

   ```bash
   npm run dev
   ```

8. **Acesse o Aplicativo**

   No Codespace, clique em **Ports** e depois em **Open in Browser** para visualizar o site.

---

### 5.2. Clonando o Repositório com Git

Este método envolve clonar o repositório localmente no seu computador usando o Git.

#### Passo a Passo

1. **Abra o Terminal ou Prompt de Comando**

2. **Clone o Repositório**

   ```bash
   git clone https://github.com/YanWeberFrancelino/2024-3TRI-IA22-TRABALHO-FINAL.git
   ```

3. **Navegue para o Diretório do Projeto**

   ```bash
   cd 2024-3TRI-IA22-TRABALHO-FINAL
   ```

4. **Instale as Dependências**

   ```bash
   npm install
   ```

5. **Configure as Variáveis de Ambiente**

   Crie um arquivo `.env` na raiz do projeto caso não exista, com as seguintes variáveis:

   ```env
   PORT=4060
   JWT_SECRET=seu_segredo_jwt
   JWT_EXPIRES_IN=24h
   ```

6. **Compile o Projeto**

   ```bash
   npm run build
   ```

7. **Inicie o Servidor em Modo de Desenvolvimento**

   ```bash
   npm run dev
   ```

8. **Acesse o Aplicativo**

   Abra o navegador e vá para `http://localhost:4060` para visualizar o site.

---

## 6. Configuração do Ambiente de Desenvolvimento

Após seguir os passos de configuração via GitHub Codespaces ou clonando o repositório, certifique-se de que as variáveis de ambiente estão configuradas corretamente no arquivo `.env`. As variáveis essenciais são:

- `PORT`: Porta em que o servidor irá rodar (exemplo: 4060).
- `JWT_SECRET`: Chave secreta para a geração de tokens JWT.
- `JWT_EXPIRES_IN`: Tempo de expiração do token JWT (exemplo: 24h).

---

## 7. Rodando o Projeto

Para iniciar o servidor em modo de desenvolvimento, utilize o comando:

```bash
npm run dev
```

Isso iniciará o servidor com **Nodemon**, que reiniciará automaticamente o servidor sempre que houver alterações no código.

Para compilar o projeto TypeScript para JavaScript, execute:

```bash
npm run build
```

Para iniciar o servidor a partir dos arquivos compilados na pasta `dist`, execute:

```bash
npm start
```

---

## 8. Estrutura do Projeto

A estrutura de diretórios do projeto está organizada para facilitar a manutenção e o desenvolvimento:

- **`node_modules/`**: Diretório onde o npm instala os pacotes necessários para o projeto.
- **`public/`**: Contém os arquivos estáticos servidos ao cliente, como HTML, CSS e imagens.
- **`src/`**: Contém o código-fonte do servidor escrito em TypeScript.
- **`dist/`**: Diretório gerado após a compilação do TypeScript, contendo o código JavaScript.
- **`data/`**: Contém arquivos de dados iniciais, como `cursos.json`.
- **`.env`**: Arquivo que contém variáveis de ambiente.
- **`package.json`**: Define as dependências do projeto e scripts de execução.
- **`tsconfig.json`**: Arquivo de configuração do compilador TypeScript.
- **`README.md`**: Documentação do projeto.

---

## 9. Rotas, Páginas e Funcionalidades

### Rotas Públicas

- **`GET /`**: Página inicial pública.
- **`GET /login`**: Página de login.
- **`GET /registrar`**: Página de registro.
- **`GET /dashboard`**: Página de acesso privado (requer autenticação).
- **`GET /cursos`**: Lista todos os cursos disponíveis.
- **`GET /cursos/:id`**: Detalhes de um curso específico.
- **`GET /cursos/aulas/:id`**: Detalhes de uma aula específica.

### Rotas de Autenticação

- **`POST /auth/register`**: Registro de novo usuário.
- **`POST /auth/login`**: Login de usuário.

### Rotas Protegidas

- **`GET /users`**: Lista todos os usuários (requer autenticação).
- **`GET /users/me`**: Obtém os dados do usuário autenticado.
- **`PUT /users/me`**: Atualiza os dados do usuário autenticado.
- **`PUT /users/me/password`**: Altera a senha do usuário autenticado.
- **`DELETE /users/me`**: Apaga a conta do usuário autenticado.

- **`GET /cursos/inscricoes`**: Lista todas as inscrições do usuário autenticado.
- **`POST /cursos/inscrever`**: Inscreve o usuário em um curso.
- **`POST /cursos/progresso/concluir`**: Marca uma aula como concluída.
- **`GET /cursos/progresso/:curso_id`**: Obtém o progresso do usuário em um curso específico.

---

## 10. Comandos Úteis

- **Instalar Dependências**
  ```bash
  npm install
  ```

- **Compilar o Projeto**
  ```bash
  npm run build
  ```

- **Iniciar o Servidor em Modo de Desenvolvimento**
  ```bash
  npm run dev
  ```

- **Iniciar o Servidor a Partir dos Arquivos Compilados**
  ```bash
  npm start
  ```

- **Verificar Versão do TypeScript**
  ```bash
  npx tsc --version
  ```

---

## 11. Testando o Projeto

Atualmente, não há testes automatizados implementados. Recomenda-se utilizar ferramentas como **Postman** ou **Insomnia** para testar as rotas da API manualmente.

Futuros desenvolvimentos podem incluir a implementação de testes unitários e de integração para garantir a qualidade e a confiabilidade do código.

---

## 12. Tratando Erros Comuns

- **Erro de Porta Ocupada**
  - Verifique se a porta especificada no `.env` não está sendo usada por outro processo.
  - Altere a variável `PORT` no arquivo `.env` para uma porta disponível.

- **Problemas com Dependências**
  - Certifique-se de que todas as dependências estão instaladas corretamente executando `npm install`.
  - Tente remover a pasta `node_modules` e executar `npm install` novamente.

- **Falha na Conexão com o Banco de Dados**
  - Verifique se o arquivo `database.sqlite` existe na raiz do projeto.
  - Certifique-se de que o banco de dados está configurado corretamente no arquivo `src/database.ts`.

- **Token JWT Inválido ou Expirado**
  - Verifique se o token está sendo enviado corretamente no cabeçalho `Authorization` como `Bearer <token>`.
  - Certifique-se de que a chave `JWT_SECRET` no arquivo `.env` está correta.

---

## 13. Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e enviar pull requests.

### Passos para Contribuir

1. **Fork este Repositório**

2. **Crie uma Branch para sua Feature ou Correção**
   ```bash
   git checkout -b minha-nova-feature
   ```

3. **Faça as Alterações Necessárias**

4. **Faça Commit das Alterações**
   ```bash
   git commit -m "Descrição da feature ou correção"
   ```

5. **Envie para o Repositório Remoto**
   ```bash
   git push origin minha-nova-feature
   ```

6. **Abra um Pull Request**

---

## 14. Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

---

## 15. Contato

**Yohanna Weber Francelino**  
[GitHub](https://github.com/YanWeberFrancelino)  
Email: omelety15@gmail.com

---

## 16. Boas Práticas e Recomendações

Para manter o projeto organizado e eficiente, recomendamos seguir as boas práticas de desenvolvimento e estruturação de código. Abaixo estão algumas recomendações adicionais:

### 16.1. Manter o Código Limpo

- **Nomes Descritivos**: Use nomes claros e descritivos para variáveis, funções e arquivos.
- **Comentários**: Comente partes complexas do código para facilitar a compreensão.
- **Evitar Duplicação**: Reutilize código sempre que possível para evitar duplicação e facilitar a manutenção.

### 16.2. Segurança

- **Variáveis de Ambiente**: Nunca exponha informações sensíveis no código. Use arquivos `.env` para armazenar variáveis de ambiente.
- **Atualizações de Dependências**: Mantenha as dependências atualizadas para garantir que as últimas correções de segurança sejam aplicadas.
- **Validação de Dados**: Sempre valide os dados recebidos de usuários para prevenir injeção de código e outras vulnerabilidades.

### 16.3. Versionamento

- **Commits Frequentes**: Faça commits frequentes com mensagens claras e descritivas.
- **Branches**: Use branches para desenvolver novas funcionalidades ou corrigir bugs, evitando trabalhar diretamente na branch principal (`main`).

### 16.4. Documentação

- **README Atualizado**: Mantenha o README atualizado com informações relevantes sobre o projeto.
- **Documentação de API**: Considere usar ferramentas como Swagger para documentar as APIs do projeto, facilitando a interação com outros desenvolvedores.

### 16.5. Testes

- **Testes Unitários**: Implemente testes unitários para garantir que cada parte do código funcione conforme esperado.
- **Testes de Integração**: Realize testes de integração para garantir que diferentes partes do sistema funcionem bem juntas.

---

## 17. Recursos Adicionais

- **[Express.js Documentation](https://expressjs.com/)**: Documentação oficial do Express.js.
- **[TypeScript Documentation](https://www.typescriptlang.org/docs/)**: Documentação oficial do TypeScript.
- **[Zod Documentation](https://zod.dev/)**: Documentação oficial do Zod para validação de dados.
- **[SQLite Documentation](https://www.sqlite.org/docs.html)**: Documentação oficial do SQLite.
- **[Node.js Documentation](https://nodejs.org/en/docs/)**: Documentação oficial do Node.js.
- **[JWT.io](https://jwt.io/)**: Recursos sobre JSON Web Tokens.

---

## 18. Agradecimentos Finais

Obrigado por utilizar este projeto e por contribuir para seu desenvolvimento contínuo. Esperamos que este guia completo tenha facilitado sua compreensão e implementação do site de cursos de programação. Se tiver dúvidas ou sugestões, não hesite em entrar em contato!

Boa codificação!
