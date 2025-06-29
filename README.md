READ ME
# Trabalho 2 – Mashup de APIs (Cidades)

**Autores:**

* Diogo Ruivo (n.º 31817)
* Pedro Barreto (n.º 31661)

## Descrição

Este projeto é uma aplicação web que permite pesquisar cidades, mostrar o clima atual através da API OpenWeatherMap e dados do país através da API RestCountries. Inclui autenticação simples (registo/login/logout) e guarda o histórico de pesquisas no MongoDB.

## Tecnologias e APIs

* **Back-end**: Node.js, Express
* **Banco de Dados**: MongoDB via Mongoose
* **Autenticação**: express-session, bcryptjs
* **HTTP client**: axios
* **Front-end**: HTML, JavaScript (Fetch API)
* **APIs externas**:

  * [OpenWeatherMap](https://openweathermap.org/api) (clima)
  * [RestCountries](https://restcountries.com/) (dados do país)

## Pré-requisitos

* Node.js v18+ instalado
* Acesso a um cluster MongoDB (Atlas ou local)
* Chave de API do OpenWeatherMap

## Instalação

1. Clone este repositório:

   
   git clone https://github.com/SEU_USUARIO/trabalho2-mashup-apis-Diogoruivo31817.git
   cd trabalho2-mashup-apis-Diogoruivo31817
   
2. Instale dependências:

   
   npm install
   
3. Copie o ficheiro de ambiente e configure as variáveis de ambiente:

   
   cp .env.example .env
 

   Edite o `.env` com:

   
   PORT=4000
   MONGO_URI=mongodb+srv://<usuario>:<password>@cluster0.mongodb.net/trabalho2?retryWrites=true&w=majority
   SESSION_SECRET=umaStringMuitoSecreta
   OWM_KEY=<sua_openweathermap_key>
   

## Scripts

* `npm start` — inicia o servidor em modo de produção (Node)
* `npm run dev` — inicia o servidor em modo de desenvolvimento (nodemon)

## Uso

1. Inicie o servidor:

   
   npm run dev    # ou npm start
   
2. Aceda no browser:

   * **Registo**: `http://localhost:4000/register.html`
   * **Login**:   `http://localhost:4000/login.html`
   * **Pesquisa**: `http://localhost:4000/pesquisa.html`
   * **Histórico**: `http://localhost:4000/history.html`

## Deploy

A aplicação está publicada em: https://trabalho2-mashup-apis-diogoruivo31817.onrender.com


Endpoints disponíveis:

Registo: https://trabalho2-mashup-apis-diogoruivo31817.onrender.com/register.html

Login:   https://trabalho2-mashup-apis-diogoruivo31817.onrender.com/login.html

Pesquisa:https://trabalho2-mashup-apis-diogoruivo31817.onrender.com/pesquisa.html

Histórico:https://trabalho2-mashup-apis-diogoruivo31817.onrender.com/history.html

No painel do Render, defina as seguintes variáveis de ambiente:

* `MONGO_URI`
* `SESSION_SECRET`
* `OWM_KEY`
* `PORT`

## Estrutura do Projeto

```
trabalho2-mashup-apis-Diogoruivo31817/
├── .env.example       # modelo de variáveis de ambiente
├── .gitignore
├── package.json
├── server.js          # lógica do servidor, autenticação e mashup
└── public/
    ├── register.html
    ├── login.html
    ├── pesquisa.html
    ├── pesquisa.js
    ├── history.html
    └── history.js
