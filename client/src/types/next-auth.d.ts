import type {Session, User, DefaultSession} from 'next-auth';
import type {JWT} from 'next-auth';

// type Role = 'Merchant' | 'Customer';

// type UserRole = 'Merchant' | 'Customer';
// interface Role {
//     role: UserRole;
// }

interface EmailAddress {
    email: string;
    verified: boolean;
    primary: boolean;
  }
  
  interface Profile {
    username: string;
    type: string;
    active: boolean;
  }
  interface JWT {
    access_token: string;
  }

  interface UserAuth0 {
    name: string;
    email: string;
    picture: string;
    id: string;
    sub: string;
    access_token: string;
  }
  
declare module 'next-auth' {
    interface Session {
        user: UserFromAuth0;
    }
}