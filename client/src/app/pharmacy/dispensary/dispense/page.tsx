'use client';
import { Medication } from '@/components/DataTable/DataTableMedication';
import { ToastEnum, showToast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/shadcn/button';
import { Dialog } from '@headlessui/react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { CgSpinner } from 'react-icons/cg';
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
export default function DispensePage() {
	const { data: session } = useSession();
	const router = useRouter();

	const [apiData, setApiData] = useState(null);
	const searchParams = useSearchParams();
	const med_id = searchParams.get('id');
	const [dataNotFound, setDataNotFound] = useState(false);

	const [results, setResults] = useState<Medication>();
	const [patientResults, setPatientResults] = useState<PatientData>();
	const [selectedItems, setSelectedItems] = useState({
		dosageForm: '',
		dosageStrength: '',
		dosageFrequency: '',
		dosageDuration: 1,
	});

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [patientNotFound, setPatientNotFound] = useState<boolean>(false);
	const [patientId, setPatientId] = useState<string>('');
	const [successDispense, setSuccessDispense] = useState<boolean>(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(
					`${process.env.API_URL}/api/medication/get/${med_id}`
				);

				if (response.status === 404) {
					setDataNotFound(true);
				}

				if (response.ok) {
					const res = await response.json();
					setResults(res);
					console.log(res);
				}
			} catch (error) {
				showToast({
					title: 'Error',
					description:
						'Something went wrong trying to retrieve the data. Please try again later.',
					type: ToastEnum.ERROR,
				});
			}
		};

		fetchData();
	}, []); // The empty dependency array ensures the effect runs only once on component mount

	const handleDosageFormChange = (e: { target: { value: any } }) => {
		setSelectedItems((prev) => ({ ...prev, dosageForm: e.target.value }));
	};

	const handleDosageStrengthChange = (e: { target: { value: any } }) => {
		setSelectedItems((prev) => ({ ...prev, dosageStrength: e.target.value }));
	};

	const handleDosageFrequencyChange = (e: { target: { value: any } }) => {
		setSelectedItems((prev) => ({ ...prev, dosageFrequency: e.target.value }));
	};

	const handleDosageDurationChange = (e: { target: { value: string } }) => {
		setSelectedItems((prev) => ({
			...prev,
			dosageDuration: parseInt(e.target.value, 10) || 1,
		}));
	};

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
				setPatientResults(res);
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

	const handleDispense = async () => {
		setIsLoading(true);
		const dosage_instructions_for_post = {
			DosageForm: selectedItems.dosageForm,
			DosageStrength: selectedItems.dosageStrength,
			DosageFrequency: selectedItems.dosageFrequency,
			DosageDurationDays: selectedItems.dosageDuration,
		};
		const object = {
			medication_id: results?._id,
			dosage_instructions: dosage_instructions_for_post,
			patient_id: patientId,
		};
		console.log(object);

		try {
			const response = await fetch(`${process.env.API_URL}/api/dispense/`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${session?.user?.access_token}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(object),
			});
			if (response.status === 404) {
				setPatientNotFound(true);
			}
			if (response.ok) {
				const res = await response.json();
				setSuccessDispense(true);
				showToast({
					title: 'Dispense Successful',
					description: 'Redirecting...',
					type: ToastEnum.SUCCESS,
				});
				await handleDispenseSuccess(res._id);
			} else {
				showToast({
					title: 'Dispense Unsuccessful',
					description:
						'Unable to dispense at this time, please try again later.',
					type: ToastEnum.ERROR,
				});
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

	const handleDispenseSuccess = async (id: string) => {
		router.push(`/pharmacy/dispensary/dispense/${id}`);
	};

	return (
		<div className='flex flex-col items-center justify-center space-y-5 mb-32'>
			<h1 className='mb-5 mt-10 font-semibold text-3xl'>Dispense Page</h1>
			{results ? (
				<section className=' w-1/2 bg-blue-50 p-8 rounded-lg flex flex-col items-center shadow-lg'>
					<div className=' w-full p-8'>
						<div className='grid grid-cols-2'>
							<p className='font-semibold my-px'>Medication Name:</p>
							<p>{results?.medication_name}</p>
						</div>
						<div className='w-full border-b' />
						<div className='grid grid-cols-2'>
							<p className='font-semibold my-px'>Active Ingredient:</p>
							<p>{results?.active_ingredients}</p>
						</div>
						<div className='w-full border-b' />

						<div className='grid grid-cols-2'>
							<p className='font-semibold my-px'>Manufacturer:</p>
							<p>{results?.manufacturer}</p>
						</div>
						<div className='w-full border-b' />

						<div className='grid grid-cols-2'>
							<p className='font-semibold my-px'>Description:</p>
							<p>{results?.description}</p>
						</div>
						<div className='w-full border-b' />

						<div className='grid grid-cols-2'>
							<p className='font-semibold my-px'>Dosage Form:</p>
							<select
								value={selectedItems.dosageForm}
								onChange={handleDosageFormChange}
							>
								<option>--</option>
								{results?.dosage.DosageForms.map((item, index) => (
									<option key={index}>{item}</option>
								))}
							</select>
						</div>
						<div className='grid grid-cols-2'>
							<p className='font-semibold my-px'>Dosage Strength:</p>
							<select
								value={selectedItems.dosageStrength}
								onChange={handleDosageStrengthChange}
							>
								<option>--</option>
								{results?.dosage.DosageStrengths.map((item, index) => (
									<option key={index}>{item}</option>
								))}
							</select>
						</div>
						<div className='grid grid-cols-2'>
							<p className='font-semibold my-px'>Dosage Frequency:</p>
							<select
								value={selectedItems.dosageFrequency}
								onChange={handleDosageFrequencyChange}
							>
								<option>--</option>
								<option>Once a day</option>
								<option>Twice a day</option>
								<option>Three times a day</option>
								<option>As necessary</option>
							</select>
						</div>
						<div className='grid grid-cols-2'>
							<p className='font-semibold my-px'>Dosage Duration in Days:</p>
							<input
								type='number'
								id='numberInput'
								name='numberInput'
								min={1}
								max={30}
								value={selectedItems.dosageDuration}
								onChange={handleDosageDurationChange}
							/>
						</div>

						<div className='w-full border-b' />
					</div>
				</section>
			) : (
				<p>Loading...</p>
			)}
			{/* Confirm Patient Id */}
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
					Confirm Patient Id
					{isLoading ? (
						<span className='ml-2 animate-spin text-white'>
							<CgSpinner />
						</span>
					) : null}
				</Button>
			</section>

			{/* Dispense Button After Reviewing Details */}
			{patientResults ? (
				<section className=' w-1/2 bg-blue-50 p-8 rounded-lg flex flex-col items-center shadow-lg'>
					<div className=' w-full p-8'>
						<div className='grid grid-cols-2'>
							<p className='font-semibold my-px'>First Name:</p>
							<p>{patientResults?.first_name}</p>
						</div>
						<div className='w-full border-b' />
						<div className='grid grid-cols-2'>
							<p className='font-semibold my-px'>Last Name:</p>
							<p>{patientResults?.last_name}</p>
						</div>
						<div className='w-full border-b' />

						<div className='grid grid-cols-2'>
							<p className='font-semibold my-px'>Date of Birth:</p>
							<p>{new Date(patientResults?.date_of_birth!).toDateString()}</p>
						</div>
						<div className='w-full border-b' />

						<div className='grid grid-cols-2'>
							<p className='font-semibold my-px'>Contact Details:</p>
							<div>
								<p>{`+${patientResults?.contact_info.phone_number.country_code} ${patientResults?.contact_info.phone_number.phone_number}`}</p>
								<p>{patientResults?.contact_info.email.email}</p>
							</div>
						</div>
						<div className='w-full border-b' />

						<div className='grid grid-cols-2'>
							<p className='font-semibold my-px'>Emergency Contact:</p>
							<div>
								<p>{`${patientResults?.contact_info.emergency_contact.name} (${patientResults?.contact_info.emergency_contact.relationship})`}</p>
								<p>{`+${patientResults?.contact_info.emergency_contact.country_code} ${patientResults?.contact_info.emergency_contact.phone_number}`}</p>
							</div>
						</div>
						<div className='w-full border-b' />
					</div>
					{/* <div></div> */}
				</section>
			) : null}

			<Button
				// type='submit'
				className='bg-[#1877F2] text-white'
				onClick={handleDispense}
				disabled={isLoading}
			>
				Dispense Medication
				{isLoading ? (
					<span className='ml-2 animate-spin text-white'>
						<CgSpinner />
					</span>
				) : null}
			</Button>

			{/* <Dialog
				open={successDispense}
				onClose={handleDispenseSuccess}
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
						<div className='flex h-[80vh] bg-white rounded-2xl flex-col justify-center items-center gap-10 min-w-[450px] md:w-80 p-10 sm:gap-4 sm:flex-col md:h-auto md:overflow-y-scroll sm:w-44 sm:h-[auto]'>
							<div className='h-auto max-h-[75vh] w-[450px] rounded-2xl'>
								<div></div>
							</div>
						</div>
					</Dialog.Panel>
				</div>
			</Dialog> */}
		</div>
	);
}
