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
npm run start
```
---

## Como Testar as Rotas

Para testar as requisições (GET, POST, PUT, DELETE), recomenda-se o uso do **Insomnia** ou **Postman**.

**Atenção ao fluxo de Autenticação:**

1. Solicite um usuário ao administrador do banco ou crie diretamente no DB.
2. Faça o login na rota `POST /auth/login`.
3. Copie o `token` retornado.
4. Nas demais rotas, vá na aba de Autenticação (Auth), selecione **Bearer Token** e cole o token copiado para conseguir acesso.

## 6. Endpoints da API

Abaixo estão os principais endpoints para você testar no Insomnia ou Postman. Lembre-se de usar o `Bearer Token` gerado no login para acessar as rotas protegidas.

### Autenticação
* **POST** `/auth/login`
  * **Objetivo:** Gerar o token de acesso.
  * **Body:**
    ```json
    {
      "email": "seu_email@teste.com",
      "senha": "sua_senha"
    }
    ```

### Pets
* **GET** `/pets`
  * **Objetivo:** Listar todos os pets cadastrados.
* **POST** `/pets`
  * **Objetivo:** Cadastrar um novo pet.
  * **Body (Exemplo Básico):**
    ```json
    {
      "nome": "Caramelo",
      "tipo_id": 1,
      "raca_id": 1,
      "cor_id": 1,
      "porte": "M",
      "sexo": "M",
      "idade_meses": 24
    }
    ```
* **DELETE** `/pets/:id`
  * **Objetivo:** Realizar o soft delete de um pet (se ele não estiver adotado).

### Lares Adotivos
* **GET** `/lares`
  * **Objetivo:** Listar os lares (aceita filtros como `?estado=SC` ou `?tipo=TEMPORARIO`).
* **POST** `/lares`
  * **Objetivo:** Cadastrar um novo lar.
  * **Body (Exemplo Básico):**
    ```json
    {
      "nome": "Lar Esperança",
      "cep": "88330-000",
      "estado": "SC",
      "cidade": "Piçarras",
      "bairro": "Centro",
      "rua": "Av. Principal",
      "possui_telas_protecao": true,
      "tipo": "TEMPORARIO",
      "telefone": "(47) 99999-8888"
    }
    ```

### Processo de Adoção
* **POST** `/pets/adotar`
  * **Objetivo:** Iniciar uma adoção, vinculando um Pet a um Lar.
  * **Body:**
    ```json
    {
      "pet_id": 1,
      "lar_adotivo_id": 1,
      "observacao": "Iniciando a análise da adoção."
    }
    ```
* **PUT** `/atualizar_status_adocao`
  * **Objetivo:** Mudar o status de uma adoção em andamento.
  * **Body:**
    ```json
    {
      "adocao_id": 1,
      "status": "FINALIZADO",
      "observacao": "Adoção concluída com sucesso."
    }
    ```