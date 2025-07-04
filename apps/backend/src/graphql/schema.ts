import { gql } from 'graphql-tag';

export const typeDefs = gql`
  enum Role {
    ADMIN
    EMPLOYEE
  }

  type Employee {
    id: ID!
    name: String!
    age: Int!
    class: String
    subjects: [String!]!
    attendance: Float
  }

  type User {
    id: ID!
    email: String!
    role: Role!
  }

  input EmployeeInput {
    name: String!
    age: Int!
    class: String
    subjects: [String!]!
    attendance: Float
  }

  input EmployeeFilter {
    class: String
    minAge: Int
    maxAge: Int
  }

  type Query {
    employees(filter: EmployeeFilter, page: Int, pageSize: Int, sortBy: String): [Employee!]!
    employee(id: ID!): Employee
    me: User
  }

  type Mutation {
    addEmployee(input: EmployeeInput!): Employee!
    updateEmployee(id: ID!, input: EmployeeInput!): Employee!
    login(email: String!, password: String!): String
  }
`;
