const {buildSchema} = require('graphql')

module.exports = buildSchema(`
    type User {
        name: String!
        age: Int!
        email: String!
    }

    type TestType {
        count: Int!
        users: [User!]!
    }

    type Todo {
        id: ID!
        title: String!
        done: Boolean!
        createdAt: String
        updatedAt: String
    }

    type Query {
        test: TestType!
        random(min: Int!, max: Int!, count: Int!) : [Float!]!
        getTodos: [Todo!]!
    }

    input UserInput {
        name: String!
        email: String!
    }

    type Mutation {
        addTestUser(user: UserInput!): User!
    }
`)