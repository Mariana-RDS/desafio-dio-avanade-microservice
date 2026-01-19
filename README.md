# Vespertine - Sistema de Gestão de Venda

O **Vespertine** é um ecossistema de microsserviços voltado para o controle de estoque, vendas e gerenciamento de funcionários. O sistema utiliza uma arquitetura onde o frontend consome um API Gateway que centraliza a comunicação com os serviços de autenticação e produtos.

---

## Funcionalidades Principais

* Controle de Acessos Privado: Registro de novos usuários restrito apenas a administradores.
* Gestão de Roles: Diferenciação de permissões entre `Admin` (Gestão total) e `User` (Operacional/Vendas).
* Controle de Estoque: Monitoramento de produtos e atualização.
* Venda: Interface para realização de vendas.
* Relatórios: Visualização de histórico de vendas.

---

## Tecnologias Utilizadas

* Frontend: [React.js](https://reactjs.org/) + [Vite](https://vitejs.dev/)
* Backend: [.NET 9 Core](https://dotnet.microsoft.com/) (C#)
* Banco de Dados: [PostgreSQL](https://www.postgresql.org/)
* Autenticação: JWT (JSON Web Tokens) com autorização baseada em Roles
* Containerização: [Docker](https://www.docker.com/)

---
## Estrutura do Projeto

* frontend: Aplicação React.
* UserService: Microsserviço responsável por Login, Registro e Controle de Roles.
* InventoryService: Microsserviço de gestão de estoque e produtos.
* SalesService: Microsserviço de gestão de vendas.
* Gateway: API Gateway que roteia as requisições para os serviços corretos.

## Como Executar com Docker

Este projeto está configurado para rodar totalmente via containers, garantindo que o ambiente seja o mesmo em qualquer máquina.

### 1. Pré-requisitos
Certifique-se de ter instalado:
* Docker
* Docker Compose

### 2. Subindo o Ambiente
Na raiz do projeto (onde está o arquivo `docker-compose.yml`), execute:

```bash
# Construir as imagens e subir os containers em segundo plano:
docker compose up --build -d

# Verificar se os containers estão rodando:
docker compose ps

# Parar o sistema:
docker compose down
```
### 3. Acessar ao Sistema
Após os containers subirem, você poderá acessar as interfaces nos seguintes endereços:
Frontend (Interface)	http://localhost:5173