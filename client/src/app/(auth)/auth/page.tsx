'use client';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/shadcn/button';
import { UserAuthForm } from '@/components/ui/forms/user-auth-form';
// import AuthSignIn from './components/SignIn';
import AuthSignInChoice from '@/components/Auth/AuthSignInChoice';

export default function AuthenticationPage() {
	return (
		<div className='flex flex-col items-center justify-center h-screen -mt-[75px] '>
			<div className='border flex flex-col items-center justify-center p-8 rounded-lg shadow-lg bg-gray-100'>
				<h1 className='mb-10 font-semibold text-xl'>
					{' '}
					SELECT THE APPLICATION YOU WOULD LIKE TO ACCESS
				</h1>

				<AuthSignInChoice />
			</div>
		</div>
	);
}
