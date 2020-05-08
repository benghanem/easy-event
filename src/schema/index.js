const { buildSchema } = require('graphql')

// language=GraphQL
module.exports.schema = buildSchema(`

    type User {
        _id: ID!
        name: String!
        email: String!
        password: String!
        createdEvents: [Event!]
    }

    type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
        creator: User!
        token: String
    }

    type Booking {
        _id: ID!
        event: Event!
        user: User!
        createdAt: String
        updatedAt: String
        token: String
    }

    type AuthData {
        _id: ID!
        token: String!
        tokenExpirationTime: Int!
    }

    input EventInput {
        creator: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
    }

    input UserInput {
        name: String!
        email: String!
        password: String!
    }

    input BookinInput {
        event: ID!
        user: ID!
    }

    type Token {
        _id: ID!
        token: String!
        tokenExpirationTime: Int!
    }

    type EventOutput {
        createdEvent: Event!,
        tokenInformations: Token
    }

    type RootQuery {
        event: Event!
        events:  [Event!]
        allEvents: [Event!]
        users: [User!]!
        bookings: [Booking!]
        login(email: String!, password: String!): AuthData!
        refreshToken: Token
    }

    type RootMutation {
        createEvent(eventInput: EventInput): EventOutput
        deleteEvent(eventInput: ID!): ID
        createUser(userInput: UserInput): User
        bookEvent(eventId: ID!): Booking
        cancelBooking(bookingId: ID!): Event
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`)
