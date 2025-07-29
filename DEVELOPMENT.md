# ConfirmMe - Guia de Desenvolvimento

## 🚀 Status do Projeto

✅ **Projeto completamente funcional!**
- ASP.NET Core 8.0 com Entity Framework
- Banco PostgreSQL (NeonTech) conectado
- APIs REST funcionando
- Frontend com hot reload
- Formulário de confirmação operacional
- Dashboard com estatísticas em tempo real

## 🛠️ Comandos de Desenvolvimento

### Executar com Hot Reload (Recomendado)
```bash
dotnet watch run
```
- Hot reload habilitado 🔥
- Mudanças aplicadas automaticamente
- Ambiente de desenvolvimento
- URL: http://localhost:5000

### Build do Projeto
```bash
dotnet build
```

### Executar Produção
```bash
dotnet run
```

### Restaurar Dependências
```bash
dotnet restore
```

## 🌐 URLs Disponíveis

- **Página Principal**: http://localhost:5000
- **Dashboard**: http://localhost:5000/Home/Dashboard
- **API Dashboard**: http://localhost:5000/api/confirmations/dashboard
- **API Confirmações**: http://localhost:5000/api/confirmations

## 📊 APIs REST

### POST /api/confirmations
Criar nova confirmação de presença.

**Exemplo de Request:**
```json
{
  "mainGuestName": "João Silva",
  "mainGuestAttending": true,
  "additionalGuests": [
    {
      "name": "Maria Silva",
      "attending": true
    }
  ]
}
```

### GET /api/confirmations/dashboard
Obter estatísticas do dashboard.

**Exemplo de Response:**
```json
{
  "confirmedCount": 5,
  "declinedCount": 2,
  "totalCount": 7,
  "guests": [...]
}
```

## 🗄️ Banco de Dados NeonTech

**Status**: ✅ Conectado e funcionando
**Tabelas**: Criadas automaticamente via Entity Framework

### String de Conexão
```
Host=ep-muddy-bush-acw2dv72-pooler.sa-east-1.aws.neon.tech; 
Database=neondb; 
Username=neondb_owner; 
Password=npg_W70mBLYezQIv; 
SSL Mode=VerifyFull; 
Channel Binding=Require;
```

### Tabelas Criadas
1. **confirmations** - Confirmações principais
2. **additional_guests** - Acompanhantes

## 🎨 Frontend

- **Tecnologia**: HTML5 + CSS3 + JavaScript Vanilla
- **Design**: Responsivo e moderno
- **Interatividade**: APIs AJAX para comunicação com backend
- **Hot Reload**: Mudanças aplicadas automaticamente

## 🔧 Desenvolvimento

### Estrutura do Projeto
```
ConfirmMe/
├── Controllers/     # APIs REST
├── Data/           # Entity Framework
├── Models/         # Entidades e DTOs
├── Services/       # Lógica de negócio
├── Views/          # Views MVC
├── wwwroot/        # CSS, JS, imagens
└── Program.cs      # Configuração
```

### Features Implementadas
- ✅ Confirmação de presença
- ✅ Adição de acompanhantes
- ✅ Dashboard administrativo
- ✅ Estatísticas em tempo real
- ✅ Validação de formulários
- ✅ Persistência em PostgreSQL
- ✅ APIs RESTful
- ✅ Interface responsiva

## 📱 Como Testar

1. **Acesse**: http://localhost:5000
2. **Preencha** o formulário com seu nome
3. **Adicione** acompanhantes (opcional)
4. **Confirme** sua presença
5. **Visualize** o dashboard em `/Home/Dashboard`

## 🚨 Resolução de Problemas

### Processo em Execução
Se você ver erro de "arquivo sendo usado por outro processo":
```bash
taskkill /F /IM ConfirmMe.exe
```

### Rebuild Completo
```bash
dotnet clean
dotnet restore
dotnet build
```

### Verificar Logs
Os logs aparecem no terminal onde você executou `dotnet watch run`

## 🎯 Próximos Passos

1. **Deploy**: Configurar para produção
2. **Autenticação**: Adicionar login/logout
3. **Notificações**: Email confirmations
4. **Exportação**: PDF/Excel reports
5. **Temas**: Dark mode support

## 📞 Suporte

- Logs de erro aparecem no terminal
- APIs retornam mensagens de erro detalhadas
- Console do navegador mostra erros JavaScript

---

**Status**: 🟢 **Totalmente Operacional!**
