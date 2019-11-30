import { gql } from 'apollo-boost';
const CREATE_USER = gql`
    subscription User {
        User(filter: { mutation_in: [CREATED, UPDATED] }) {
            mutation
            node {
                createdAt
                email
                id
                name
                updatedAt
            }
        }
    }
`;

export default CREATE_USER;
