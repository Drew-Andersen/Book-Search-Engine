import { gql } from '@apollo/client';

export const GET_ME = gql`
{
    me {
      _id
      email
      username
      savedBooks {
        authors
        bookId
        description
        image
        link
        title
      }
    }
}
`;