# Employee Management System

A full-stack employee management application built with **TurboRepo**, **GraphQL**, **React**, and **Prisma**.

## 🏗️ Architecture

This is a monorepo built with TurboRepo containing:

- **Backend**: Apollo Server with GraphQL, Prisma ORM, SQLite database
- **Frontend**: React with TypeScript and Apollo Client
- **Shared**: UI components and configurations

## 📁 Project Structure

```
employee-app/
├── apps/
│   ├── backend/          # GraphQL API server
│   │   ├── src/
│   │   │   ├── graphql/
│   │   │   │   ├── schema.ts      # GraphQL schema definitions
│   │   │   │   └── resolvers.ts   # GraphQL resolvers
│   │   │   ├── auth/
│   │   │   │   └── seed.ts        # Database seeding script
│   │   │   └── index.ts           # Server entry point
│   │   ├── prisma/
│   │   │   └── schema.prisma      # Database schema
│   │   └── package.json
│   ├── frontend/         # React application
│   │   ├── src/
│   │   └── package.json
│   ├── docs/            # Documentation site
│   └── web/             # Web application
├── packages/
│   └── ui/              # Shared UI components
├── turbo.json           # TurboRepo configuration
└── package.json         # Root package.json
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/thealchemist1307/employee-app.git
   cd employee-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   cd apps/backend
   npx prisma migrate dev
   npm run seed
   ```

4. **Start development servers**
   ```bash
   # From the root directory
   npm run dev
   ```

This will start:
- **Backend**: `http://localhost:4000/graphql`
- **Frontend**: `http://localhost:3000`

## 🗄️ Database Schema

### User Model
```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  role      Role     @default(EMPLOYEE)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Employee Model
```prisma
model Employee {
  id         Int      @id @default(autoincrement())
  name       String
  age        Int
  class      String?
  subjects   String   // JSON string of subjects array
  attendance Float?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}
```

### Role Enum
```prisma
enum Role {
  ADMIN
  EMPLOYEE
}
```

## 🔐 Authentication

### Default Admin User
- **Email**: `admin@demo.com`
- **Password**: `admin123`

### Login
```graphql
mutation {
  login(email: "admin@demo.com", password: "admin123")
}
```

Returns a JWT token that should be included in the Authorization header:
```json
{
  "authorization": "Bearer <your-jwt-token>"
}
```

## 📡 GraphQL API

### Queries

#### Get All Employees
```graphql
query {
  employees(
    filter: { class: "10th", minAge: 15, maxAge: 18 }
    page: 1
    pageSize: 10
    sortBy: "name"
  ) {
    id
    name
    age
    class
    subjects
    attendance
  }
}
```

#### Get Single Employee
```graphql
query {
  employee(id: "1") {
    id
    name
    age
    class
    subjects
    attendance
  }
}
```

#### Get Current User
```graphql
query {
  me {
    id
    email
    role
  }
}
```

### Mutations

#### Add Employee (Admin only)
```graphql
mutation {
  addEmployee(
    input: {
      name: "John Doe"
      age: 16
      class: "10th"
      subjects: ["Math", "Science", "English"]
      attendance: 85.5
    }
  ) {
    id
    name
    age
    class
    subjects
    attendance
  }
}
```

#### Update Employee (Admin only)
```graphql
mutation {
  updateEmployee(
    id: "1"
    input: {
      name: "John Doe Updated"
      age: 17
      class: "11th"
      subjects: ["Math", "Physics", "Chemistry"]
      attendance: 90.0
    }
  ) {
    id
    name
    age
    class
    subjects
    attendance
  }
}
```

## 🛠️ Development

### Backend Commands
```bash
cd apps/backend

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Seed database
npm run seed

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev
```

### Frontend Commands
```bash
cd apps/frontend

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

### Root Commands
```bash
# Start all apps in parallel
npm run dev

# Build all apps
npm run build

# Lint all packages
npm run lint

# Type checking
npm run check-types
```

## 🔧 Configuration

### Environment Variables

Create `.env` file in `apps/backend/`:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
```

### TurboRepo Configuration

The `turbo.json` file configures the build pipeline:
```json
{
  "$schema": "https://turborepo.org/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "dev": {
      "cache": false
    }
  }
}
```

## 🧪 Testing the API

1. **Start the backend server**
   ```bash
   cd apps/backend
   npm run dev
   ```

2. **Open GraphQL Playground**
   Navigate to `http://localhost:4000/graphql`

3. **Login to get a token**
   ```graphql
   mutation {
     login(email: "admin@demo.com", password: "admin123")
   }
   ```

4. **Add the token to HTTP Headers**
   ```json
   {
     "authorization": "Bearer <your-token>"
   }
   ```

5. **Test queries and mutations**

## 📦 Dependencies

### Backend
- `@apollo/server` - GraphQL server
- `@prisma/client` - Database ORM
- `express` - Web framework
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `cors` - CORS middleware
- `dotenv` - Environment variables

### Frontend
- `react` - UI library
- `@apollo/client` - GraphQL client
- `typescript` - Type safety

### Development
- `turbo` - Monorepo build system
- `ts-node-dev` - TypeScript development server
- `prisma` - Database toolkit

## 🚀 Deployment

### Backend Deployment
1. Build the application: `npm run build`
2. Set production environment variables
3. Deploy the `dist/` folder

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy the `build/` folder to a static hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please open an issue on GitHub or contact the development team.
