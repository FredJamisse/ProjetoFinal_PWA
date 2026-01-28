# Enquadramento

Este projeto foi desenvolvido no âmbito da unidade curricular Projeto Final de Curso, tendo como objetivo a conceção e implementação de uma aplicação web full-stack, baseada em JavaScript, que permita a gestão e consulta de propostas de temas para projetos finais de curso.

A aplicação responde a um cenário académico realista, no qual docentes submetem propostas de temas e os utilizadores podem consultá-las publicamente, garantindo diferentes níveis de acesso consoante o perfil do utilizador.

#   Objetivos do Projeto

### Os principais objetivos do projeto são:

- Desenvolver uma aplicação web com separação clara entre frontend e backend;

- Implementar autenticação e controlo de acesso por perfis de utilizador;

- Permitir a gestão completa (CRUD) de propostas de projeto por parte dos docentes;

- Disponibilizar uma área pública para consulta das propostas;

- Aplicar boas práticas de desenvolvimento web, tanto ao nível da arquitetura como da experiência do utilizador (UX).

#   Perfis de Utilizador

### A aplicação contempla os seguintes perfis:

##  Administrador

- Acesso à área de administração;

- Gestão de docentes, alunos e palavras-chave;

- Supervisão global do sistema.

##  Docente

- Autenticação no sistema;

- Criação, edição, visualização e remoção das suas propostas de projeto;

- Associação de coorientadores, alunos e palavras-chave às propostas.

## Utilizador Anónimo

- Consulta pública das propostas disponíveis;

- Visualização das propostas organizadas por docente;

- Acesso apenas em modo leitura.

##     Arquitetura da Aplicação

A aplicação segue uma arquitetura cliente–servidor, organizada em dois componentes principais:

###   Backend

- Node.js

- Express

- SQLite (base de dados relacional)

- API REST para comunicação com o frontend

### Frontend

- Vue.js 3 (Composition API)

- Vite (ferramenta de build)

- Bootstrap (interface gráfica)

- Comunicação com o backend via Axios

Esta separação permite uma clara distinção de responsabilidades, facilitando a manutenção e evolução do sistema.



#   Como correr o projeto

### Pré-requisitos

Antes de iniciar, certifica-te que tens instalado no teu computador:

Node.js (versão 18 ou superior)
https://nodejs.org

npm (incluído com o Node.js)

Git (opcional, mas recomendado)

Para verificar se está tudo instalado:

    node -v
    npm -v

📁 Estrutura resumida do projeto 
        
              ProjetoFinal/
              │
              ├── backend/
              │   ├── server.js
              │   ├── database.db
              │   ├── routes/
              │   └── package.json
              │
              ├── frontend/
              │   ├── src/
              │   ├── index.html
              │   └── package.json
              │
              └── README.md

### Passo 1 — Executar o Backend

1️⃣ Abrir o terminal na pasta backend

    cd backend

2️⃣ Instalar dependências

    npm install

3️⃣ Iniciar o servidor backend
    
    node server.js


Ou, se tiveres nodemon:

    npm run dev

Resultado esperado

O backend ficará disponível em:
http://localhost:3000


E deverás ver no terminal algo como:

    Servidor a correr na porta 3000

### Passo 2 — Executar o Frontend

1️⃣ Abrir outro terminal na pasta frontend
    
    cd frontend

2️⃣ Instalar dependências

    npm install

3️⃣ Iniciar o frontend (Vite)

    npm run dev

Resultado esperado

    O frontend ficará disponível em:

    http://localhost:5173


O browser abrirá automaticamente (ou podes abrir manualmente).


## Acesso ao Sistema

Acede a:

*http://localhost:5173/login*


Introduz as credenciais de um utilizador existente na base de dados.

ADMINISTRADOR:

    username: admin@admin.pt
    password: admin

DOCENTE:

    username:docente@test.pt
    password: 1234



## Base de Dados

O projeto utiliza SQLite

O ficheiro da base de dados encontra-se em:

*backend/database.db*


A base de dados pode ser inspecionada com:

DB Browser for SQLite
https://sqlitebrowser.org/

Parar a aplicação

### Para parar o backend ou frontend:

CTRL + C

(em cada terminal respetivo)