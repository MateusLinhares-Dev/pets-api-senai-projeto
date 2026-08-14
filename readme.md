# Pets API - Sistema de Adoção

API RESTful desenvolvida para gerenciar o processo de adoção de pets, vinculando animais resgatados a lares adotivos temporários ou definitivos.

## Tecnologias Utilizadas

*   **Node.js** com **Express**
*   **Banco de Dados:** PostgreSQL
*   **ORM:** TypeORM
*   **Autenticação:** JWT (JSON Web Token)

---

## Pré-requisitos

Antes de começar, você vai precisar ter as seguintes ferramentas instaladas na sua máquina:
*   [Node.js](https://nodejs.org/en/) (Versão 18 ou superior recomendada)
*   [PostgreSQL](https://www.postgresql.org/) rodando localmente ou em container.

---

## Como Executar o Projeto

Siga o passo a passo abaixo para rodar a aplicação no seu ambiente local:

### 1. Clone o repositório
```bash
git clone [https://github.com/MateusLinhares-Dev/pets-api-senai-projeto.git](https://github.com/MateusLinhares-Dev/pets-api-senai-projeto.git)
cd pets-api-senai-projeto
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configuração do Banco de Dados

1. Abra o seu gerenciador do PostgreSQL (pgAdmin, DBeaver, etc).
2. Crie um banco de dados em branco para o projeto.
3. Certifique-se de rodar os scripts SQL iniciais (se houver algum arquivo de seed/tabelas na pasta `src/database/seeds`).

### 4. Configuração das Variáveis de Ambiente (.env)

O arquivo `.env` não é enviado para o GitHub por questões de segurança. Você precisará criá-lo manualmente:

1. Na raiz do projeto, crie um arquivo chamado `.env`.
2. Copie o conteúdo do arquivo `.env_example` e cole dentro do seu novo `.env`.
3. Preencha as variáveis com os dados do seu banco de dados local e a sua chave secreta do JWT:

```env
PORT=8888
DB_HOST=localhost
DB_PORT=5432
DB_USER=seu_usuario_postgres
DB_PASS=sua_senha_postgres
DB_NAME=nome_do_banco_criado
JWT_SECRET=sua_chave_secreta_aqui
```

### 5. Inicie o Servidor

Com tudo configurado, basta iniciar a aplicação:

```bash
npm run dev
```
*(Ou `npm start`, dependendo de como está configurado o seu `package.json`)*

O servidor iniciará e você verá a mensagem no terminal indicando que está rodando (ex: `Servidor rodando na porta 8888`).

---

## Como Testar as Rotas

Para testar as requisições (GET, POST, PUT, DELETE), recomenda-se o uso do **Insomnia** ou **Postman**.

**Atenção ao fluxo de Autenticação:**

1. Solicite um usuário ao administrador do banco ou crie diretamente no DB.
2. Faça o login na rota `POST /auth/login`.
3. Copie o `token` retornado.
4. Nas demais rotas, vá na aba de Autenticação (Auth), selecione **Bearer Token** e cole o token copiado para conseguir acesso.
