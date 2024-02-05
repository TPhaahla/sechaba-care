'use client';
import React, { use, useState } from 'react';
import { useFormik } from 'formik';
import { pharmacyRegisterValidate } from '@/lib/validate';
import { Button } from '@/components/ui/shadcn/button';
import { CgSpinner } from 'react-icons/cg';
import Link from 'next/link';
import { ToastEnum, showToast } from '@/components/ui/Toast';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function SignUpPage() {
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const router = useRouter();

	const formik = useFormik({
		initialValues: {
			pharmacy_name: '',
			address: {
				country: '',
				city: '',
				street_address: '',
			},
			contact_information: {
				email: {
					email: '',
					// verified: false,
				},
				work_number: {
					phone_number: 0,
					country_code: 0,
					// verified: false,
				},
				emergency_number: {
					phone_number: 0,
					country_code: 0,
					// verified: false,
				},
			},
			password: '',
			confirm_password: '',
		},
		validate: pharmacyRegisterValidate,
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
				`${process.env.API_URL}/api/auth/pharmacy/register`,
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
				router.push('/pharmacy');
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
		try {
			const login_result = await signIn('credentials-pharmacy', {
				email: formik.values.contact_information.email.email,
				password: formik.values.password,
				redirect: false,
				callbackUrl: '/pharmacy',
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
				router.push('/pharmacy');
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

	return (
		<div className='flex items-center justify-center h-screen -mt-[45px]'>
			<form
				className='p-10 grid grid-cols-2 place-content-center place-items-center w-3/5 h-4/5 shadow-lg border rounded-xl'
				onSubmit={formik.handleSubmit}
			>
				<h1 className='col-span-2 text-3xl font-semibold -mt-[35px]'>
					Pharmacy Registration
				</h1>
				<div className=' w-80 p-5'>
					{/* Pharmacy Name */}
					<div className='col-span-2'>
						<label
							htmlFor='pharmacy_name'
							className='text-sm font-semibold text-gray-700'
						>
							Pharmacy Name
						</label>
						<input
							type='text'
							id='pharmacy_name'
							name='pharmacy_name'
							className='border-2 h-10 px-2 border-gray-200 rounded-md w-full'
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.pharmacy_name}
						/>
						{formik.touched.pharmacy_name && formik.errors.pharmacy_name ? (
							<div className='text-[#CD7687] text-xs  flex w-full justify-end'>
								{formik.errors.pharmacy_name}
							</div>
						) : null}
					</div>

					{/* Address */}
					{/* Add similar structure for address fields */}
					{/* Coordinates */}

					{/* Address */}

					<div className='col-span-2 '>
						<label
							htmlFor='email'
							className='text-sm font-semibold text-gray-700'
						>
							Email
						</label>
						<input
							type='email'
							id='email'
							name='contact_information.email.email'
							className='border-2 h-10 px-2 border-gray-200 rounded-md w-full'
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.contact_information.email.email}
						/>
						{formik.touched.contact_information?.email?.email &&
						formik.errors.contact_information &&
						formik.errors.contact_information?.email?.email ? (
							<div className='text-[#CD7687] text-xs  flex w-full justify-end'>
								{formik.errors.contact_information.email.email}
							</div>
						) : null}
					</div>
					{/* Country */}
					<div className='col-span-2 '>
						<label
							htmlFor='country'
							className='text-sm font-semibold text-gray-700'
						>
							Country
						</label>
						<input
							type='text'
							id='country'
							name='address.country'
							className='border-2 h-10 px-2 border-gray-200 rounded-md w-full'
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.address.country}
						/>
						{formik.touched.address?.country &&
						formik.errors.address?.country ? (
							<div className='text-[#CD7687] text-xs  flex w-full justify-end'>
								{formik.errors.address.country}
							</div>
						) : null}
					</div>

					{/* City */}
					<div className='col-span-2 '>
						<label
							htmlFor='city'
							className='text-sm font-semibold text-gray-700'
						>
							City
						</label>
						<input
							type='text'
							id='city'
							name='address.city'
							className='border-2 h-10 px-2 border-gray-200 rounded-md w-full'
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.address.city}
						/>
						{formik.touched.address?.city && formik.errors.address?.city ? (
							<div className='text-[#CD7687] text-xs  flex w-full justify-end'>
								{formik.errors.address.city}
							</div>
						) : null}
					</div>

					{/* Street Address */}
					<div className='col-span-2 '>
						<label
							htmlFor='street_address'
							className='text-sm font-semibold text-gray-700'
						>
							Street Address
						</label>
						<input
							type='text'
							id='street_address'
							name='address.street_address'
							className='border-2 h-10 px-2 border-gray-200 rounded-md w-full'
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.address.street_address}
						/>
						{formik.touched.address?.street_address &&
						formik.errors.address?.street_address ? (
							<div className='text-[#CD7687] text-xs  flex w-full justify-end'>
								{formik.errors.address.street_address}
							</div>
						) : null}
					</div>
				</div>

				<div className='w-80 p-5'>
					{/* Contact Information */}
					{/* Add similar structure for contact_information fields */}
					{/* Contact Information */}
					{/* Email */}

					{/* Work Number */}
					<div className='col-span-2 '>
						<label
							htmlFor='work_number'
							className='text-sm font-semibold text-gray-700'
						>
							Work Number
						</label>
						<div className='flex items-center'>
							<input
								type='tel'
								id='work_number_country_code'
								name='contact_information.work_number.country_code'
								className='mt-1 p-2 w-1/3 mr-2 border rounded-md'
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={
									formik.values.contact_information.work_number.country_code
								}
							/>
							<input
								type='tel'
								id='work_number'
								name='contact_information.work_number.phone_number'
								className='border-2 h-10 px-2 border-gray-200 rounded-md w-full'
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={
									formik.values.contact_information.work_number.phone_number
								}
							/>
						</div>
						{formik.touched.contact_information?.work_number?.phone_number &&
						formik.errors.contact_information?.work_number?.phone_number ? (
							<div className='text-[#CD7687] text-xs  flex w-full justify-end'>
								{formik.errors.contact_information.work_number.phone_number}
							</div>
						) : null}
					</div>

					{/* Emergency Number */}
					<div className='col-span-2 '>
						<label
							htmlFor='emergency_number'
							className='text-sm font-semibold text-gray-700'
						>
							Emergency Number
						</label>
						<div className='flex items-center'>
							<input
								type='tel'
								id='emergency_number_country_code'
								name='contact_information.emergency_number.country_code'
								className='mt-1 p-2 w-1/3 mr-2 border rounded-md'
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={
									formik.values.contact_information.emergency_number
										.country_code
								}
							/>
							<input
								type='tel'
								id='emergency_number'
								name='contact_information.emergency_number.phone_number'
								className='border-2 h-10 px-2 border-gray-200 rounded-md w-full'
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={
									formik.values.contact_information.emergency_number
										.phone_number
								}
							/>
						</div>
						{formik.touched.contact_information?.emergency_number
							?.phone_number &&
						formik.errors.contact_information?.emergency_number
							?.phone_number ? (
							<div className='text-[#CD7687] text-xs  flex w-full justify-end'>
								{
									formik.errors.contact_information.emergency_number
										.phone_number
								}
							</div>
						) : null}
					</div>

					{/* Password */}
					<div className='col-span-2 '>
						<label
							htmlFor='password'
							className='text-sm font-semibold text-gray-700'
						>
							Password
						</label>
						<input
							type='password'
							id='password'
							name='password'
							className='border-2 h-10 px-2 border-gray-200 rounded-md w-full'
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.password}
						/>
						{formik.touched.password && formik.errors.password ? (
							<div className='text-[#CD7687] text-xs  flex w-full justify-end'>
								{formik.errors.password}
							</div>
						) : null}
					</div>

					{/* Confirm Password */}
					<div className='col-span-2 '>
						<label
							htmlFor='confirm_password'
							className='text-sm font-semibold text-gray-700'
						>
							Confirm Password
						</label>
						<input
							type='password'
							id='confirm_password'
							name='confirm_password'
							className='border-2 h-10 px-2 border-gray-200 rounded-md w-full'
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.confirm_password}
						/>
						{formik.touched.confirm_password &&
						formik.errors.confirm_password ? (
							<div className='text-[#CD7687] text-xs  flex w-full justify-end'>
								{formik.errors.confirm_password}
							</div>
						) : null}
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
					>
						Create Account
						{isLoading ? (
							<span className='ml-2 animate-spin text-white'>
								<CgSpinner />
							</span>
						) : null}
					</Button>
				</div>

				{/* Sign Up Instead */}
				<div className='col-span-2 w-full'>
					<div className='flex items-center justify-center mt-3'>
						<p className='text-sm '>Already have an account?</p>
						<Link href='/auth/pharmacy'>
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
