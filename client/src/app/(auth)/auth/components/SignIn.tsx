import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaApple, FaTwitter } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { BsEye, BsEyeSlash, BsMeta } from 'react-icons/bs';
import { CgSpinner } from 'react-icons/cg';

import { useFormik } from 'formik';
import loginValidate, { registerValidate } from '@/lib/validate';
import * as Styles from './Auth.styled';
import { ButtonMolecule, ButtonState, Size } from '@/components/ui/Button';
import { Button } from '@/components/ui/shadcn/button';
import { ToastEnum, showToast } from '@/components/ui/Toast';
import { signIn } from 'next-auth/react';

const AuthSignIn = () => {
	// const auth_active = useAppSelector(state => state.authReducer.active);

	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [showPasswordConfirm, setShowPasswordConfirm] =
		useState<boolean>(false);
	const [authForm, setAuthForm] = useState<string>('SignIn');
	// const authForm = useAppSelector(state => state.authReducer.authComponent);
	const router = useRouter();
	const formik = useFormik({
		initialValues: {
			email: '',
			password: '',
			password_confirm: '',
			name: '',
			role: undefined,
		},
		validate: authForm === 'SignIn' ? loginValidate : registerValidate,
		onSubmit,
	});

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [invalidCredentials, setInvalidCredentialsError] =
		useState<boolean>(false);

	async function onSubmit() {
		// showToast({
		// 	title: 'Error 401: Permission Is Denied',
		// 	description:
		// 		'You currently do not have access to this application. Please contact the administrator',
		// 	type: ToastEnum.ERROR,
		// });
		handleSignIn();
	}

	const handleSignIn = async () => {
		setIsLoading(true);
		setInvalidCredentialsError(false);

		try {
			const login_result = await signIn('credentials-doctor', {
				email: formik.values.email,
				password: formik.values.password,
				redirect: false,
				callbackUrl: '/dashboard',
			});
			// console.log(login_result, 'Login Result');
			if (login_result?.error === 'CredentialsSignin') {
				showToast({
					title: 'Error 401: Permission Is Denied',
					description: 'Invalid Credentials',
					type: ToastEnum.ERROR,
				});
				setInvalidCredentialsError(true);
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

	const [formValues, setFormValues] = useState<{
		[key: string]: { value: string; showPassword: boolean };
	}>({});

	// const handleButtonClick = () => {
	// 	showToast({
	// 		title: 'Error 401: Permission Is Denied',
	// 		description:
	// 			'You currently do not have access to this application. Please contact the administrator',
	// 		type: ToastEnum.ERROR,
	// 	});
	// };
	// const [isLoading, setIsLoading] = useState<boolean>(false);
	// const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
	// 	const { name, value } = event.target;
	// 	setFormValues(prevState => ({
	// 		...prevState,
	// 		[name]: { ...prevState[name], value },
	// 	}));
	// };

	const togglePassword = (name: string) => {
		setFormValues((prevState) => {
			if (!prevState[name]) {
				return prevState;
			}
			return {
				...prevState,
				[name]: {
					...prevState[name],
					showPassword: !prevState[name].showPassword,
				},
			};
		});
	};

	return (
		<Styles.StyledAuthFormContainer onSubmit={formik.handleSubmit}>
			<Styles.StyledAuthFormHeader>
				<h1>
					{!(authForm === 'SignIn')
						? 'Create an account'
						: 'Sign In using Doctor Credentials'}
				</h1>
				{/* <IoIosCloseCircle
					size={24}
					onClick={() => dispatch(setActiveModalInSearchPage(null))}
				/> */}
			</Styles.StyledAuthFormHeader>

			<Styles.StyledAuthFormInputContainer>
				{!(authForm === 'SignIn') ? (
					<>
						Name
						<div>
							<Styles.StyledAuthFormInput
								// required
								placeholder='Enter your name'
								type='name'
								// name='name'
								// onChange={handleInputChange}
								{...formik.getFieldProps('name')}
							/>
						</div>
						{formik.errors.name && formik.touched.name ? (
							<Styles.StyledErrorSpan>
								{formik.errors.name}
							</Styles.StyledErrorSpan>
						) : (
							<></>
						)}
					</>
				) : null}
				Email
				<div>
					<Styles.StyledAuthFormInput
						// required
						placeholder='Enter your email'
						type='email'
						// name='email'
						// onChange={handleInputChange}
						{...formik.getFieldProps('email')}
					/>
				</div>
				{formik.errors.email && formik.touched.email ? (
					<Styles.StyledErrorSpan>{formik.errors.email}</Styles.StyledErrorSpan>
				) : (
					<></>
				)}
				{!(authForm === 'SignIn') ? 'Create' : ''} Password
				<div>
					<Styles.StyledAuthFormInput
						// required
						placeholder='Password'
						type={showPassword ? 'text' : 'password'}
						// name='password'
						// onChange={handleInputChange}
						{...formik.getFieldProps('password')}
					/>
					<span onClick={() => setShowPassword(!showPassword)}>
						{showPassword ? <BsEyeSlash /> : <BsEye />}
					</span>
				</div>
				{formik.errors.password && formik.touched.password ? (
					<Styles.StyledErrorSpan>
						{formik.errors.password}
					</Styles.StyledErrorSpan>
				) : (
					<></>
				)}
				{invalidCredentials ? (
					<span className='text-red-500 text-xs  animate-bounce'>
						Invalid Credentials !
					</span>
				) : null}
				<Button
					type='submit'
					variant='outline'
					size='lg'
					className='bg-[#1877F2] cursor-pointer'
					disabled={isLoading}
				>
					{!(authForm === 'SignIn') ? 'Create Account' : 'Sign In'}
					{isLoading ? (
						<span className='ml-2 animate-spin text-white'>
							<CgSpinner />
						</span>
					) : null}
				</Button>
			</Styles.StyledAuthFormInputContainer>

			<Styles.StyledAuthFormGoLogin>
				<span>
					{!(authForm === 'SignIn')
						? 'Already have an account?'
						: 'Don’t have an account?'}
					<Link href='/auth/doctor/signup'>
						<span className='text-[#1877F2]  cursor-pointer'>Sign Up</span>
					</Link>
				</span>
			</Styles.StyledAuthFormGoLogin>

			{/* <Styles.StyledAuthFormSocialMedia>
				<div>
					<FcGoogle />
				</div>
				<div>
					<FaApple />
				</div>
				<div>
					<FaTwitter />
				</div>
				<div>
					<BsMeta />
				</div>
			</Styles.StyledAuthFormSocialMedia> */}

			<Styles.StyledAuthAgreement>
				By continuing, you agree to the{' '}
				<Link href='#' target='_blank'>
					<span>Terms of use, Privacy Policy,</span>{' '}
				</Link>
				and
				<Link href='#' target='_blank'>
					<span> Community Standards</span>
				</Link>{' '}
				of
			</Styles.StyledAuthAgreement>
		</Styles.StyledAuthFormContainer>
	);
};

export default AuthSignIn;
