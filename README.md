# API de Gerenciamento de Pacientes

## Visão Geral

A API de Gerenciamento de Pacientes Odapp é um serviço RESTful construído com Node.js como teste técnico para a vaga de desenvolvedor.

## Funcionalidades

- Operações CRUD: Crie, recupere, atualize e delete registros de pacientes.
- Paginação e Filtragem: Suporta paginação e filtragem para recuperação de dados.
- Ordenação: Ordene dados de pacientes com base em diferentes campos e ordens.
- Deleção em Massa: Delete múltiplos registros de pacientes em uma única operação.
- Cache: Implementa cache para otimizar o desempenho e reduzir a carga no banco de dados.
- Testes Unitários: Inclui testes unitários usando Jest para os métodos do controlador.
- Tratamento de Erros: Respostas de erro consistentes e descritivas.

## Instalação

Clone o Repositório

```bash
git clone https://github.com/LMPeron/odapp-challenge-api.git
cd odapp-challenge-api
```

Instale as Dependências

```bash
yarn
```

## Configuração

Variáveis de Ambiente

Crie um arquivo .env no diretório raiz e adicione as seguintes variáveis:

```env
PORT=3000
DATABASE_URL=sua-string-de-conexão-do-banco-de-dados
REDISCLOUD_URL=sua-string-de-conexão-do-redis
TOKEN_DURATION=1h
SECRET=sua-string-secreta
```

## Configuração do Banco de Dados

Inicialize o Banco de Dados

```bash
npx prisma init
```

Defina o Esquema

Atualize seu arquivo prisma/schema.prisma com os modelos necessários (por exemplo, Patient, Location, City, State).

```bash
npx prisma generate
```

Inicie o Servidor

```bash
npm run dev
```

O servidor iniciará na porta especificada em seu arquivo .env (padrão é 3000). Você pode acessar a API em http://localhost:3000.

Executando Testes
Para executar os testes unitários, execute:

```bash
npm test
```

## Documentação da API

### Endpoints

#### Obter Todos os Pacientes

**URL:** /patients
**Método:** GET

**Parâmetros de Consulta:**

- offset (opcional): Número de registros a pular (padrão: 0).
- limit (opcional): Número de registros a recuperar (padrão: 5).
- filter (opcional): Filtrar pacientes por nome.
- sortBy (opcional): Campo para ordenar (padrão: createdAt).
- sortOrder (opcional): Ordem de classificação (asc ou desc, padrão: desc).

Resposta de Sucesso:

**Código:** 200 OK

**Conteúdo:**

```json
{
  "success": true,
  "patients": [
    {
      "id": 1,
      "name": "John Doe",
      "age": 30,
      ...
    },
    ...
  ],
  "count": 100
}
```

#### Obter Paciente por ID

**URL:** /patients/:id
**Método:** GET

Parâmetros de URL:

- id: ID do paciente.

**Resposta de Sucesso:**

**Código:** 200 OK
Conteúdo:

```json
{
  "success": true,
  "patient": {
    "id": 1,
    "name": "John Doe",
    "age": 30,
    ...
  }
}
```

#### Criar um Novo Paciente

**URL:** /patients
**Método:** POST
Parâmetros do Corpo:

```json
{
  "name": "Jane Smith",
  "age": 28,
  "city": 1,
  "state": 1
}
```

**Resposta de Sucesso:**

**Código:** 200 OK
Conteúdo:

```json
{
  "success": true,
  "data": {
    "id": 2,
    "name": "Jane Smith",
    "age": 28,
    ...
  }
}
```

#### Atualizar um Paciente

**URL:** /patients/:id
**Método:** PUT

**Parâmetros de URL:**

- id: ID do paciente.

**Parâmetros do Corpo:**

```json
{
  "name": "Jane Doe",
  "age": 29,
  "city": 2,
  "state": 2
}
```

**Resposta de Sucesso:**

**Código:** 200 OK

**Conteúdo:**

```json
{
  "success": true,
  "data": {
    "id": 2,
    "name": "Jane Doe",
    "age": 29,
    ...
  }
}
```

#### Deletar um Paciente

**URL:** /patients/:id
**Método:** DELETE

Parâmetros de URL:

- id: ID do paciente.

**Resposta de Sucesso:**

**Código:** 200 OK

**Conteúdo:**

```json
{
  "success": true
}
```

#### Deleção em Massa de Pacientes

**URL:** /patients/deleteBulk
**Método:** POST
Parâmetros do Corpo:

```json
{
  "ids": [2, 3, 4]
}
```

**Resposta de Sucesso:**

**Código:** 200 OK

**Conteúdo:**

```json
{
  "success": true
}
```

#### Tratamento de Erros

Erros são tratados de forma consistente em todos os endpoints. Uma resposta de erro inclui:

Código: Código de status HTTP correspondente.
**Conteúdo:**

```json
{
  "success": false,
  "message": "Mensagem de erro descrevendo o que deu errado."
}
```

Por exemplo, se um paciente não for encontrado:

```json
{
  "success": false,
  "message": "Paciente não encontrado."
}
```

## Estrutura do Projeto

```
odapp-challenge-api/
├── controllers/
│ └── PatientController.js
├── database/
│ └── PatientRepository.js
├── tests/
│ └── PatientController.test.js
├── utils/
│ └── ErrorHandler.js
├── app.js
├── package.json
├── .env
└── README.md
```

**controllers/**: Contém a lógica do controlador para lidar com as requisições.
**database/**: Contém a lógica de interação com o banco de dados.
**tests/**: Contém testes unitários e de integração.
**utils/**: Contém funções utilitárias, como tratamento de erros.
**app.js**: Ponto de entrada da aplicação.
**package.json**: Lista dependências e scripts.
**.env**: Variáveis de ambiente (não deve ser commitado no controle de versão).
**README.md**: Documentação.

## Tecnologias Utilizadas

- Node.js: Ambiente de execução JavaScript.
- Express.js: Framework web para Node.js.
- Prisma ORM (ou o ORM de sua escolha): Para interações com o banco de dados.
- Redis: Usado para cache de dados para melhorar o desempenho.
- Jest: Framework de testes.

## Licença

Este projeto está licenciado sob a Licença MIT.

## Contato

Se você tiver alguma dúvida ou precisar de mais assistência, sinta-se à vontade para abrir uma issue ou entrar em contato com o mantenedor do projeto:

GitHub: LMPeron
Email: peronleonardo0@gmail.com

```

```
