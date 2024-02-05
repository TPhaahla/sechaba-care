'use client';
import React, { useState } from 'react';
import { useFormik } from 'formik';
import { doctorRegisterValidate } from '@/lib/validate';
import { Button } from '@/components/ui/shadcn/button';
import { CgSpinner } from 'react-icons/cg';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { ToastEnum, showToast } from '@/components/ui/Toast';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
	const router = useRouter();

	const formik = useFormik({
		initialValues: {
			first_name: '',
			last_name: '',
			government_id_number: '',
			medical_license_number: '',
			specialization: '',
			contact_info: {
				email: {
					email: '',
					// verified: false,
				},
				work_number: {
					phone_number: 0,
					country_code: 267,
					// verified: false,
				},
				emergency_number: {
					phone_number: 0,
					country_code: 267,
					// verified: false,
				},
			},
			password: '',
			confirm_password: '',
		},
		validate: doctorRegisterValidate,
		onSubmit,
	});

	async function onSubmit() {
		handleSignUp();
	}
	const handleSignUp = async () => {
		try {
			// Set loading state to true to show the loading spinner
			setIsLoading(true);

			// Make an API request to your backend to handle signup
			const response = await fetch(
				`${process.env.API_URL}/api/auth/doctor/register`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(formik.values), // Assuming your backend expects JSON data
				}
			);

			const data = await response.json();

			// Check if the signup was successful
			if (response.ok) {
				// Show success toast or redirect to a success page
				// showToast(ToastEnum.SUCCESS, 'Account created successfully');
				showToast({
					title: 'Account Successfully Created:',
					type: ToastEnum.SUCCESS,
					description: 'You will be logged in shortly',
				});
				await handleSignIn();
				// Redirect to a success page or any other desired action
				router.push('/dashboard');
			} else {
				// If signup fails, show error toast or handle the error accordingly
				// showToast(ToastEnum.ERROR, data.message || 'Signup failed');
				showToast({
					title: 'Error during signup:',
					type: ToastEnum.ERROR,
					description: data.detail || 'Sign Up failed',
				});
			}
		} catch (error) {
			// Handle any unexpected errors
			// console.error('Error during signup:', error);
			showToast({
				title: 'Error during signup:',
				type: ToastEnum.ERROR,
				description: 'An unexpected error occurred',
			});
		} finally {
			// Set loading state back to false after the signup process completes
			setIsLoading(false);
		}
	};
	const handleSignIn = async () => {
		setIsLoading(true);
		// setInvalidCredentialsError(false);

		try {
			const login_result = await signIn('credentials-doctor', {
				email: formik.values.contact_info.email.email,
				password: formik.values.password,
				redirect: false,
				callbackUrl: '/dashboard',
			});
			// console.log(login_result, 'Login Result');
			if (login_result?.error === 'CredentialsSignin') {
				showToast({
					title: 'Error 401: Permission Is Denied',
					description: 'Failed to Sign In',
					type: ToastEnum.ERROR,
				});
				// setInvalidCredentialsError(true);
				setIsLoading(false);
				return;
			} else {
				// setErrorLogin(false);
				showToast({
					title: 'Login Successful',
					description: 'Welcome to Sechaba Care',
					type: ToastEnum.SUCCESS,
				});
				router.push('/dashboard');
			}
		} catch (error) {
			showToast({
				title: 'Error 401: Permission Is Denied',
				description: 'Invalid Credentials',
				type: ToastEnum.ERROR,
			});
		} finally {
			setIsLoading(false);
		}
	};

	const [isLoading, setIsLoading] = useState<boolean>(false);

	return (
		<div className='flex items-center justify-center h-screen -mt-[75px]'>
			<form
				className=' p-10 grid grid-cols-2 place-content-center place-items-center w-3/5 h-3/4 shadow-lg border rounded-xl'
				onSubmit={formik.handleSubmit}
			>
				<h1 className='col-span-2 text-3xl font-semibold -mt-[35px]'>
					Doctor Registration
				</h1>
				<div className=' w-80 p-5'>
					{/* First Name */}
					<label className='text-sm font-semibold' htmlFor='first_name'>
						First Name
					</label>
					<div>
						<input
							className='border-2 h-10 px-2 border-gray-200 rounded-md w-full'
							type='text'
							id='first_name'
							name='first_name'
							onChange={formik.handleChange}
							value={formik.values.first_name}
						/>
						{formik.errors.first_name && (
							<div className='text-[#CD7687] text-xs  flex w-full justify-end'>
								{formik.errors.first_name}
							</div>
						)}
					</div>

					{/* Last Name */}
					<label className='text-sm font-semibold' htmlFor='last_name'>
						Last Name
					</label>
					<div>
						<input
							className='border-2 h-10 px-2 border-gray-200 rounded-md w-full'
							type='text'
							id='last_name'
							name='last_name'
							onChange={formik.handleChange}
							value={formik.values.last_name}
						/>
						{formik.errors.last_name && (
							<div className='text-[#CD7687] text-xs  flex w-full justify-end'>
								{formik.errors.last_name}
							</div>
						)}
					</div>

					{/* Government ID Number */}
					<label
						className='text-sm font-semibold'
						htmlFor='government_id_number'
					>
						Government ID Number
					</label>
					<div>
						<input
							className='border-2 h-10 px-2 border-gray-200 rounded-md w-full'
							type='text'
							id='government_id_number'
							name='government_id_number'
							onChange={formik.handleChange}
							value={formik.values.government_id_number}
						/>
						{formik.errors.government_id_number && (
							<div className='text-[#CD7687] text-xs  flex w-full justify-end'>
								{formik.errors.government_id_number}
							</div>
						)}
					</div>

					{/* Medical License Number */}
					<label
						className='text-sm font-semibold'
						htmlFor='medical_license_number'
					>
						Medical License Number
					</label>
					<div>
						<input
							className='border-2 h-10 px-2 border-gray-200 rounded-md w-full'
							type='text'
							id='medical_license_number'
							name='medical_license_number'
							onChange={formik.handleChange}
							value={formik.values.medical_license_number}
						/>
						{formik.errors.medical_license_number && (
							<div className='text-[#CD7687] text-xs  flex w-full justify-end'>
								{formik.errors.medical_license_number}
							</div>
						)}
					</div>

					{/* Specialization */}
					<label className='text-sm font-semibold' htmlFor='specialization'>
						Specialization
					</label>
					<div>
						<input
							className='border-2 h-10 px-2 border-gray-200 rounded-md w-full'
							type='text'
							id='specialization'
							name='specialization'
							onChange={formik.handleChange}
							value={formik.values.specialization}
						/>
						{formik.errors.specialization && (
							<div className='text-[#CD7687] text-xs  flex w-full justify-end'>
								{formik.errors.specialization}
							</div>
						)}
					</div>
				</div>

				<div className=' w-80 p-5'>
					{/* Email */}
					<label
						className='text-sm font-semibold'
						htmlFor='contact_info.email.email'
					>
						Email
					</label>
					<div>
						<input
							className='border-2 h-10 px-2 border-gray-200 rounded-md w-full'
							type='email'
							id='contact_info.email.email'
							name='contact_info.email.email'
							onChange={formik.handleChange}
							value={formik.values.contact_info.email.email}
						/>
						{formik.errors.contact_info && formik.errors.contact_info.email && (
							<div className='text-[#CD7687] text-xs  flex w-full justify-end'>
								{formik.errors.contact_info.email.email}
							</div>
						)}
					</div>

					{/* Work Number */}
					<label
						className='text-sm font-semibold'
						htmlFor='contact_info.work_number.phone_number'
					>
						Work Number
					</label>
					<div className='flex items-center'>
						<input
							type='tel'
							id='contact_info.work_number.contry_code'
							name='contact_info.work_number.country_code'
							className=' p-2 w-1/3 mr-2 border-2 h-10 px-2 border-gray-200 rounded-md'
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.contact_info.work_number.country_code}
						/>
						<input
							className='border-2 h-10 px-2 border-gray-200 rounded-md w-full'
							type='tel'
							id='contact_info.work_number.phone_number'
							name='contact_info.work_number.phone_number'
							onChange={formik.handleChange}
							value={formik.values.contact_info.work_number.phone_number}
						/>
						{formik.errors.contact_info &&
							formik.errors.contact_info.work_number &&
							formik.errors.contact_info.work_number.phone_number && (
								<div className='text-[#CD7687] text-xs  flex w-full justify-end'>
									{formik.errors.contact_info.work_number.phone_number}
								</div>
							)}
					</div>

					{/* Emergency Number */}
					<label
						className='text-sm font-semibold'
						htmlFor='contact_info.emergency_number.phone_number'
					>
						Emergency Number
					</label>
					<div className='flex items-center'>
						<input
							type='tel'
							id='contact_info.emergency_number.country_code'
							name='contact_info.emergency_number.country_code'
							className='p-2 w-1/3 mr-2 border-2 h-10 px-2 border-gray-200 rounded-md'
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.contact_info.emergency_number.country_code}
						/>
						<input
							className='border-2 h-10 px-2 border-gray-200 rounded-md w-full'
							type='tel'
							id='contact_info.emergency_number.phone_number'
							name='contact_info.emergency_number.phone_number'
							onChange={formik.handleChange}
							value={formik.values.contact_info.emergency_number.phone_number}
						/>
						{formik.errors.contact_info &&
							formik.errors.contact_info.emergency_number &&
							formik.errors.contact_info.emergency_number.phone_number && (
								<div className='text-[#CD7687] text-xs  flex w-full justify-end'>
									{formik.errors.contact_info.emergency_number.phone_number}
								</div>
							)}
					</div>
					{/* Password */}
					<label className='text-sm font-semibold' htmlFor='password'>
						Password
					</label>
					<div className=''>
						<input
							className='border-2 h-10 px-2 border-gray-200 rounded-md w-full'
							type='password'
							id='password'
							name='password'
							onChange={formik.handleChange}
							value={formik.values.password}
						/>
						{formik.errors.password && (
							<div className='text-[#CD7687] text-xs  flex w-full justify-end'>
								{formik.errors.password}
							</div>
						)}
					</div>
					{/* <div className='border-b mt- mb-5 border-black shadow-lg' /> */}

					{/* Confirm Password */}
					<label className='text-sm font-semibold' htmlFor='confirm_password'>
						Confirm Password
					</label>
					<div>
						<input
							className=' border-2 h-10 px-2 border-gray-200 rounded-md w-full'
							type='password'
							id='confirm_password'
							name='confirm_password'
							onChange={formik.handleChange}
							value={formik.values.confirm_password}
						/>
						{formik.errors.confirm_password && (
							<div className='text-[#CD7687] text-xs  flex w-full justify-end'>
								{formik.errors.confirm_password}
							</div>
						)}
					</div>
				</div>

				{/* Submit Button */}
				<div className='col-span-2 w-full flex items-center justify-center'>
					<Button
						type='submit'
						variant='outline'
						size='lg'
						className='bg-[#1877F2] cursor-pointer'
						disabled={isLoading}
						// onClick=
					>
						Create Account
						{isLoading ? (
							<span className='ml-2 animate-spin text-white'>
								<CgSpinner />
							</span>
						) : null}
					</Button>
				</div>

				{/* Sign Up Instead*/}
				<div className='col-span-2 w-full'>
					<div className='flex items-center justify-center mt-3'>
						<p className='text-sm '>Already have an account?</p>
						<Link href='/auth/doctor'>
							<span className='text-[#1877F2] ml-2 cursor-pointer'>
								Sign In
							</span>
						</Link>
					</div>
				</div>

				{/* Legal */}
				<div className='h-[70px] w-full col-span-2 mt-[15px] text-[#b2b2b2] text-sm text-center'>
					By creating an account, you agree to our{' '}
					<Link href='#' target='_blank'>
						<span className='text-[#5c5c5c]'>Terms of Service</span>
					</Link>{' '}
					and{' '}
					<Link href='#' target='_blank'>
						<span className='text-[#5c5c5c]'>Privacy Policy</span>
					</Link>
				</div>
			</form>
		</div>
	);
}
