'use client';
import { Navbar } from '@/components/Navigation/Navbar/Navbar';
import Sidebar from '@/components/Navigation/Sidebar/Sidebar';
import Image from 'next/image';
import styled from 'styled-components';
// import AuthSignIn from './(auth)/auth/components/SignIn';
import { ProfileForm } from '@/components/ui/forms/profile-form';
import { ContactForm } from '@/components/ui/forms/contact-form';
import { Button } from '@/components/ui/shadcn/button';
import { useRef, useState } from 'react';
import { CgSpinner } from 'react-icons/cg';
import { ToastEnum, showToast } from '@/components/ui/Toast';
import Link from 'next/link';
import { DataTableMedication } from '@/components/DataTable/DataTableMedication';
import { DataTableDispenseMedication } from '@/components/DataTable/DataTableDispense';
import { Dialog } from '@headlessui/react';
import { AddPatientForm } from '@/components/ui/forms/add-patient-form';

const StyledContentContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 100px;
	justify-content: start;
	align-items: start;
	width: 100%;
	// max-width: calc(100vw - 230px);
	padding: 50px 30px;
	// margin-left: 230px;
	transition: all 0.3s ease;
	@media (max-width: 1140px) {
		margin-left: 80px;
		max-width: calc(100vw - 80px);
	}
	@media (max-width: 1024px) {
		margin-left: 0px;
		max-width: 100%;
	}
	@media (max-width: 768px) {
		flex-direction: column;
		gap: 10px;
	}
`;
interface ContactInfo {
	email: { email: string; verified: boolean };
	phone_number: {
		phone_number: number;
		country_code: number;
		verified: boolean;
	};
	emergency_contact: {
		phone_number: number;
		country_code: number;
		verified: boolean;
		name: string;
		relationship: string;
	};
}

interface PatientData {
	government_id_number: string;
	first_name: string;
	last_name: string;
	date_of_birth: string; // You might want to use a specific date type here
	address: string;
	contact_info: ContactInfo;
}
export default function Dispensary() {
	const [results, setResults] = useState<PatientData>();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [patientId, setPatientId] = useState<string>('');
	const [patientNotFound, setPatientNotFound] = useState<boolean>(false);
	const [addPatient, setAddPatient] = useState<boolean>(false);
	// const patientId = useRef();

	const handleSearch = async () => {
		setIsLoading(true);
		// alert(patientId);
		// setIsLoading(false);
		try {
			const response = await fetch(
				`${process.env.API_URL}/api/patients/get/${patientId}`
			);
			if (response.status === 404) {
				setPatientNotFound(true);
			}
			if (response.ok) {
				const res = await response.json();
				setResults(res);
			}
		} catch (error) {
			showToast({
				title: 'Error',
				description:
					'Something when wrong trying to retrieve the data. Please try again later.',
				type: ToastEnum.ERROR,
			});
			return;
		} finally {
			setIsLoading(false);
		}
	};
	return (
		<>
			{/* <Navbar/> */}
			{/* <Sidebar/> */}
			<StyledContentContainer>
				{/* Row 1 */}
				<div className='flex  flex-col  justify-center items-center mt-[100px] w-full space-y-5 '>
					<h1 className='mb-10 -mt-32 font-semibold text-3xl'>
						{' '}
						WELCOME TO THE DISPENSARY
					</h1>

					{/* search bar to enter id */}
					<section className='space-x-3'>
						<input
							className='border w-[300px] h-[40px] rounded-lg p-5'
							placeholder='Enter Patient ID Numer'
							disabled={isLoading}
							value={patientId}
							onChange={(e) => setPatientId(e.target.value)}
							// ref={patientId}
						/>
						<Button
							// type='submit'
							className='bg-[#1877F2] text-white'
							onClick={handleSearch}
							disabled={isLoading}
						>
							Find Patient Data
							{isLoading ? (
								<span className='ml-2 animate-spin text-white'>
									<CgSpinner />
								</span>
							) : null}
						</Button>
					</section>

					{/* DISPLAY RESULTS */}
					{results ? (
						<section className=' bg-blue-50 p-8 rounded-lg flex flex-col items-center '>
							<div className=' w-full p-8'>
								<div className='grid grid-cols-2'>
									<p className='font-semibold my-px'>First Name:</p>
									<p>{results?.first_name}</p>
								</div>
								<div className='w-full border-b' />
								<div className='grid grid-cols-2'>
									<p className='font-semibold my-px'>Last Name:</p>
									<p>{results?.last_name}</p>
								</div>
								<div className='w-full border-b' />

								<div className='grid grid-cols-2'>
									<p className='font-semibold my-px'>Date of Birth:</p>
									<p>{new Date(results?.date_of_birth!).toDateString()}</p>
								</div>
								<div className='w-full border-b' />

								<div className='grid grid-cols-2'>
									<p className='font-semibold my-px'>Contact Details:</p>
									<div>
										<p>{`+${results?.contact_info.phone_number.country_code} ${results?.contact_info.phone_number.phone_number}`}</p>
										<p>{results?.contact_info.email.email}</p>
									</div>
								</div>
								<div className='w-full border-b' />

								<div className='grid grid-cols-2'>
									<p className='font-semibold my-px'>Emergency Contact:</p>
									<div>
										<p>{`${results?.contact_info.emergency_contact.name} (${results?.contact_info.emergency_contact.relationship})`}</p>
										<p>{`+${results?.contact_info.emergency_contact.country_code} ${results?.contact_info.emergency_contact.phone_number}`}</p>
									</div>
								</div>
								<div className='w-full border-b' />
							</div>
							{/* <div></div> */}
							{/* {results ? <p>{JSON.stringify(results)}</p> : null} */}
							<div className='w-full space-x-3 flex items-center justify-center my-3'>
								<Link
									href={`/pharmacy/dispensary/${patientId}`}
									className=' h-9 flex justify-center items-center  flex-1 text-center transition-all duration-300 bg-[#1877f2] text-white rounded-md  w-[200px] border-none bg-cover bg-center text-sm leading-none'
								>
									View Scripts
								</Link>
								{/* <Link
								href='#video'
								className=' flex justify-center items-center relative flex-1 text-center transition-all duration-300 bg-[#1877f2] text-white rounded-xl h-[50px] w-[150px] border-none bg-cover bg-center font-semibold text-sm leading-none'
							>
								Watch Demo
							</Link> */}
								{/* <Button
									// type='submit'
									className='bg-[#1877F2] text-white w-[200px]'
									onClick={handleSearch}
									disabled={isLoading}
								>
									View Scripts
									{isLoading ? (
										<span className='ml-2 animate-spin text-white'>
											<CgSpinner />
										</span>
									) : null}
								</Button> */}

								<Button
									// type='submit'
									className='bg-[#1877F2] text-white w-[200px]'
									// onClick={handleSearch}
									disabled={isLoading}
								>
									Dispense OTC Medication
									{isLoading ? (
										<span className='ml-2 animate-spin text-white'>
											<CgSpinner />
										</span>
									) : null}
								</Button>
							</div>
						</section>
					) : null}
					{results ? (
						<section className='w-screen px-28 pt-[100px] h-screen'>
							<h2 className='mb-10 font-semibold text-2xl w-full text-center'>
								{' '}
								ISSUE ONE OF THE FOLLOWING ITEMS TO THE PATIENT
							</h2>

							<DataTableDispenseMedication />
						</section>
					) : null}

					{patientNotFound ? (
						<section className=' border-2 border-[#1877f2] bg-blue-50 p-8 rounded-lg flex flex-col items-center '>
							<p className='font-semibold'>
								Patient Not Found on Our Database.
							</p>
							<div className='w-full space-x-3 flex items-center justify-center my-3'>
								<Button
									// type='submit'
									className='bg-[#1877F2] text-white w-[200px]'
									// onClick={handleSearch}
									onClick={() => setAddPatient(true)}
									disabled={isLoading}
								>
									Register Patient
									{isLoading ? (
										<span className='ml-2 animate-spin text-white'>
											<CgSpinner />
										</span>
									) : null}
								</Button>
							</div>
						</section>
					) : null}
				</div>

				<Dialog
					open={addPatient}
					onClose={() => setAddPatient(false)}
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
							padding: '50px',
						}}
					>
						<Dialog.Panel>
							<div className='flex h-[80vh] bg-white rounded-2xl flex-col justify-center items-center gap-10 min-w-[600px] md:w-80 p-10 sm:gap-4 sm:flex-col md:h-auto md:overflow-y-scroll sm:w-44 sm:h-[auto]'>
								<div className='h-auto max-h-[75vh] w-[550px] rounded-2xl'>
									<AddPatientForm />
								</div>
							</div>
						</Dialog.Panel>
					</div>
				</Dialog>

				{/* Row 2 */}
				{/* <div>
				</div> */}
				{/* <div>Pharmacy</div>
				<p>
					Lorem ipsum, dolor sit amet consectetur adipisicing elit. Neque,
					aliquid vel? Vel, delectus numquam rem earum praesentium debitis enim
					suscipit ipsa quia quis. Necessitatibus deleniti culpa non quis neque
					quasi optio minima velit voluptas sint distinctio, repellendus
					accusamus veritatis doloribus ex eveniet, minus ullam fuga? Inventore
					id aperiam ut vel ea esse animi voluptatum impedit nostrum facilis,
					reiciendis, commodi eaque doloribus harum fugit nesciunt rerum. Autem
					vero sint amet numquam beatae nobis possimus nesciunt totam labore
					officiis ducimus explicabo consequuntur harum molestiae, provident
					quo. Atque provident quos nisi ipsam optio hic voluptate doloremque ab
					ad, blanditiis aut cupiditate accusantium veritatis voluptatem modi
					maxime. Amet voluptatem, quae, suscipit illo nam explicabo ex
					provident officiis hic iure, tempora aspernatur temporibus. Quia,
					ducimus officia non voluptates id similique ex perferendis molestiae
					eum earum iusto harum alias voluptas rerum sunt nostrum nobis delectus
					veritatis deserunt unde quas! Doloremque animi minus voluptate sint,
					vero repudiandae nesciunt ullam officia nostrum ut natus aspernatur
					eos aliquam earum quo impedit sunt assumenda nobis expedita ipsam hic
					tenetur quibusdam? Ipsam, neque? Facere tempora distinctio sit
					architecto accusamus natus impedit molestias accusantium alias
					mollitia consequatur ut a suscipit, doloribus enim deleniti
					repudiandae labore. Debitis consequatur, at sint tempora similique
					officiis!
				</p> */}
			</StyledContentContainer>
		</>
	);
}
