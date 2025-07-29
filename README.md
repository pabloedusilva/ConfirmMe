# ConfirmMe - Sistema de Confirmação de Presença

Um sistema completo de confirmação de presença para eventos desenvolvido em ASP.NET Core com Entity Framework e banco de dados PostgreSQL (NeonTech).

## ✨ Funcionalidades

- 📝 **Formulário de Confirmação**: Interface moderna para confirmar presença
- 👥 **Acompanhantes**: Possibilidade de adicionar múltiplos acompanhantes
- 📊 **Dashboard Administrativo**: Painel com estatísticas e lista de convidados
- 🗄️ **Banco de Dados**: Integração com PostgreSQL via NeonTech
- 🎨 **Design Responsivo**: Interface otimizada para mobile e desktop

## 🚀 Tecnologias Utilizadas

- **Backend**: ASP.NET Core 8.0
- **ORM**: Entity Framework Core
- **Banco de Dados**: PostgreSQL (NeonTech)
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **UI**: Design responsivo com CSS Grid/Flexbox

## 📋 Pré-requisitos

- .NET 8.0 SDK
- Conta no NeonTech (PostgreSQL)
- Visual Studio Code (recomendado)

## ⚙️ Configuração

### 1. Clone o repositório
```bash
git clone https://github.com/pabloedusilva/ConfirmMe.git
cd ConfirmMe
```

### 2. Configure o banco de dados
O projeto já está configurado para usar o NeonTech. A string de conexão está em:
- `appsettings.json`
- `appsettings.Development.json`

### 3. Execute o script SQL
Execute o script `bancodedados.sql` no console SQL do NeonTech para criar a estrutura do banco de dados.

### 4. Restaure as dependências
```bash
dotnet restore
```

### 5. Execute o projeto
```bash
dotnet run
```

O projeto estará disponível em: `http://localhost:5000`

## 📁 Estrutura do Projeto

```
ConfirmMe/
├── Controllers/           # Controladores da API
│   ├── HomeController.cs
│   └── ConfirmationsController.cs
├── Data/                 # Contexto do Entity Framework
│   └── ApplicationDbContext.cs
├── Models/               # Modelos de dados
│   ├── Confirmation.cs
│   ├── AdditionalGuest.cs
│   └── DTOs/            # Data Transfer Objects
├── Services/            # Serviços de negócio
│   └── ConfirmationService.cs
├── Views/               # Views do MVC
│   ├── Home/
│   └── Shared/
├── wwwroot/             # Arquivos estáticos
│   ├── css/
│   └── js/
├── bancodedados.sql     # Script do banco de dados
└── Program.cs           # Configuração da aplicação
```

## 🗄️ Banco de Dados

### Tabelas Criadas

#### `confirmations`
- `id`: Chave primária (serial)
- `main_guest_name`: Nome do convidado principal
- `main_guest_attending`: Se vai comparecer (boolean)
- `created_at`: Data de criação
- `updated_at`: Data de atualização

#### `additional_guests`
- `id`: Chave primária (serial)
- `confirmation_id`: Referência para confirmação
- `guest_name`: Nome do acompanhante
- `attending`: Se vai comparecer (boolean)
- `created_at`: Data de criação

## 🔧 APIs Disponíveis

### POST `/api/confirmations`
Cria uma nova confirmação de presença.

**Request Body:**
```json
{
  "mainGuestName": "Nome do Convidado",
  "mainGuestAttending": true,
  "additionalGuests": [
    {
      "name": "Nome do Acompanhante",
      "attending": true
    }
  ]
}
```

### GET `/api/confirmations`
Retorna todas as confirmações.

### GET `/api/confirmations/dashboard`
Retorna estatísticas do dashboard.

## 🎨 Páginas

- **Home** (`/`): Formulário de confirmação de presença
- **Dashboard** (`/Home/Dashboard`): Painel administrativo com estatísticas

## 🛠️ Desenvolvimento

### Executar em modo de desenvolvimento
```bash
dotnet run --environment Development
```

### Compilar para produção
```bash
dotnet build --configuration Release
```

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Se encontrar algum problema, abra uma [issue](https://github.com/pabloedusilva/ConfirmMe/issues) no GitHub.

---

Desenvolvido com ❤️ por [Paulo Eduardo Silva](https://github.com/pabloedusilva)