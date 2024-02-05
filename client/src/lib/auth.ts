import { cookies } from 'next/headers';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { NextAuthOptions } from 'next-auth';

function getAuthOptions() {
    const secret = process.env.NEXTAUTH_SECRET;

    if(!secret || secret.length === 0) {
        throw new Error('Missing NEXTAUTH_SECRET');
    }

    return {secret};
}
export const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/auth',
    },
    secret: getAuthOptions().secret,
    providers: [
        CredentialsProvider({
            id: 'credentials-doctor',
            name: 'Credentials',
            credentials: {
                email: {
                    label: 'Email', type: 'email', placeholder: 'hello@example.com'
                },
                password: {
                    label: 'Password', type: 'password'
                },
            },
            async authorize(credentials) {
                console.log(process.env.API_URL)
                const res = await fetch(`${process.env.API_URL}/api/auth/doctor/login` ,{
                    method: 'POST',
                    headers: {
                      'accept': 'application/json',
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      email: credentials?.email,
                      password: credentials?.password,
                    }),
                  });

                if (res.status === 200) {
                    const user = await res.json();
                    
                    cookies().set({
                        name: 'access_token',
                        value: user.access_token,
                        path: '/',
                        httpOnly: true,
                        maxAge: 86400,
                        sameSite: 'lax'
                        // secure
                    });
                    cookies().set({
                        name: 'refresh_token',
                        value: user.refresh_token,
                        path: '/',
                        httpOnly: true,
                        maxAge: 86400,
                        sameSite: 'lax'
                        // secure
                    });
                    cookies().set({
                        name: 'logged_in',
                        value: 'true',
                        path: '/',
                        sameSite: 'lax'
                    });
                    // console.log(user.access_token);
                 
                    return user;
                } else {
                    return null;
                }
            },
        }),
        CredentialsProvider({
            id: 'credentials-pharmacy',
            name: 'Credentials',
            credentials: {
                email: {
                    label: 'Email', type: 'email', placeholder: 'hello@example.com'
                },
                password: {
                    label: 'Password', type: 'password'
                },
            },
            async authorize(credentials) {
                const res = await fetch(`${process.env.API_URL}/api/auth/pharmacy/login` ,{
                    method: 'POST',
                    headers: {
                      'accept': 'application/json',
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      email: credentials?.email,
                      password: credentials?.password,
                    }),
                  });

                if (res.status === 200) {
                    const user = await res.json();
                    
                    cookies().set({
                        name: 'access_token',
                        value: user.access_token,
                        path: '/',
                        httpOnly: true,
                        maxAge: 86400,
                        sameSite: 'lax'
                        // secure
                    });
                    cookies().set({
                        name: 'refresh_token',
                        value: user.refresh_token,
                        path: '/',
                        httpOnly: true,
                        maxAge: 86400,
                        sameSite: 'lax'
                        // secure
                    });
                    cookies().set({
                        name: 'logged_in',
                        value: 'true',
                        path: '/',
                        sameSite: 'lax'
                    });
                    // console.log(user.access_token);
                 
                    return user;
                } else {
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({token, user, trigger, session }) {
            if(trigger === 'update') {
                return {...token, ...session.user };
            }
            return { ...token, ...user};
        },

        async session ({ session, token }) {
            session.user = token as any;
            return session;
        },
    },
};