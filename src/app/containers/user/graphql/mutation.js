import { gql } from 'apollo-boost';
const CREATE_USER = gql`
    mutation createUser($email: String!, $name: String!) {
        createUser(email: $email, name: $name) {
            createdAt
            id
        }
    }
`;
const UPDATE_USER = gql`
    mutation updateUser($id: ID!, $email: String!, $name: String!) {
        updateUser(id: $id, email: $email, name: $name) {
            createdAt
            id
        }
    }
`;

const DELETE_USER = gql`
    mutation deleteUser($id: ID!) {
        deleteUser(id: $id) {
            createdAt
            id
        }
    }
`;

export { CREATE_USER, UPDATE_USER, DELETE_USER };
