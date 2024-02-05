'use client';
// import { Metadata } from 'next';
// import Image from 'next/image';
// import Link from 'next/link';

// import { cn } from '@/lib/utils';
// import { buttonVariants } from '@/components/ui/shadcn/button';
// import { UserAuthForm } from '@/components/ui/forms/user-auth-form';
import AuthSignIn from '../components/SignIn';

export default function AuthenticationPage() {
	return (
		<div className='flex items-center justify-center h-screen -mt-[75px]'>
			<AuthSignIn />
		</div>
	);
}
