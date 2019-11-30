import { gql } from 'apollo-boost';
const CREATE_USER = gql`
    mutation createUser($email: String!, $name: String!) {
        createUser(email: $email, name: $name) {
            createdAt
            id
        }
    }
`;

export default CREATE_USER;
