import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import AuthSignInChoice from '@/components/Auth/AuthSignInChoice';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';

export function Navbar() {
	const [isAuthChoiceOpen, setIsAuthChoiceOpen] = useState<boolean>(false);
	const { data: session } = useSession();
	return (
		<nav className='w-screen h-[75px] shadow-lg sticky top-0 backdrop-blur-sm flex justify-between items-center px-24 z-10'>
			{/* WRAPPER */}
			<div className='flex justify-start items-center h-16 w-full min-w-[320px] '>
				{/* LOGO */}
				<div className='font-semibold relative flex justify-center items-center w-[550px] h-[50px] transition-all duration-500 ease-in-out z-99 bg-blue-50'>
					<Link href='/'>PENDING: SECHABA CARE LOGO</Link>
				</div>

				{/* NAVBAR MENU ITEMS */}
				<ul className='flex justify-end items-center w-full gap-12 text-base pl-30'>
					{/* <li className=' uppercase cursor-pointer flex justify-center items-center min-w-min h-full mr-20 border-none bg-transparent hover:text-[#1877f2] text-sm transition-all duration-200 ease-in-out font-poppins focus:outline-none'>
						About Us
					</li>

					<li className='cursor-pointer hover:underline'>Home</li>
					<li className='cursor-pointer hover:underline'>About</li>
					<li className='cursor-pointer hover:underline'>Projects</li>
					<li className='cursor-pointer hover:underline'>Contact</li> */}
				</ul>

				{/* NAVBAR BUTTONS */}
				<div className='flex justify-end items-center gap-12'>
					{/* SIGN IN BUTTON */}
					{session ? (
						<button
							onClick={() => signOut()}
							className='uppercase relative flex-1 text-center transition-all duration-300 bg-[#1877f2] text-white rounded-xl h-[50px] w-[150px] border-none bg-cover bg-center font-semibold text-sm leading-none'
						>
							Sign Out
						</button>
					) : null}

					{/*  SIGN UP BUTTON */}
					{/* <button className='uppercase relative flex-1 text-center transition-all duration-300 bg-[#1877f2] text-white rounded-xl h-[50px] w-[150px] border-none bg-cover bg-center font-semibold text-sm leading-none'>
						Sign Up
					</button> */}
				</div>
			</div>

			{/* MODAL FOr AUTH CHOICE */}
			<Dialog
				open={isAuthChoiceOpen}
				onClose={() => setIsAuthChoiceOpen(false)}
				style={{
					position: 'relative',
					zIndex: 50,
				}}
			>
				<div
					style={{
						position: 'fixed',
						inset: 0,
						backgroundColor: 'black',
						opacity: '30%',
						backdropFilter: 'blur',
					}}
					aria-hidden='true'
				/>

				<div
					style={{
						position: 'fixed',
						inset: 0,
						display: 'flex',
						width: '100vw',
						alignItems: 'center',
						justifyContent: 'center',
						padding: '20px',
					}}
				>
					<Dialog.Panel>
						<div className='flex flex-col items-center justify-center  bg-white rounded-xl h-[270px] p-10 '>
							<AuthSignInChoice />
						</div>
					</Dialog.Panel>
				</div>
			</Dialog>
		</nav>
	);
}
