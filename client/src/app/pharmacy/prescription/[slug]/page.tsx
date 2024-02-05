'use client';
import { IncompleteCardMessage } from '@/components/Message/IncompleteMessageCard';
import style from './prescription.module.css';
import { ToastEnum, showToast } from '@/components/ui/Toast';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { CgSpinner } from 'react-icons/cg';

export default function Page({ params }: { params: { slug: string } }) {
	const [data, setData] = useState<any>();
	const { data: session } = useSession();

	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		// Assuming `fetchMedicationData` is a function to fetch medication data
		const fetchPrescriptionData = async () => {
			try {
				const response = await fetch(
					`${process.env.API_URL}/api/prescription/get/presc-id/${params.slug}`
				); // Replace with your actual API endpoint
				const fetchedData = await response.json();
				// console.log(fetchedData);
				setData(fetchedData);
			} catch (error) {
				console.error('Error fetching prescription data:', error);
			}
		};

		fetchPrescriptionData();
	});
	const fillPrescription = async (script_id: string) => {
		setIsLoading(true);
		// setPrescriptionInFocus(script_id);
		try {
			const response = await fetch(
				`${process.env.API_URL}/api/dispense/fill-script/${script_id}`,
				{
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${session?.user.access_token}`,
					},
				}
			);

			if (!response.ok) {
				// console.log(JSON.stringify(await response.json()));
				const detail = await response.json();
				// console.log(detail);
				showToast({
					title: `Error: ${response.status} ${response.statusText}`,
					description: `${detail.detail}`,
					type: ToastEnum.ERROR,
				});
			}
		} catch (error) {
			showToast({
				title: 'Error',
				description: 'Error',
				type: ToastEnum.ERROR,
			});
		} finally {
			setIsLoading(false);
			// setPrescriptionInFocus(null);
		}
		// return;
	};

	if (!data) {
		return (
			<div className={style.ContentContainer}>
				<h1 className='text-3xl font-bold mb-5 mx-auto'>
					Prescription Details Not Found
				</h1>
				;
			</div>
		);
	} else {
		// const data = await response.json();
		// console.log(data);

		return (
			<div className={style.ContentContainer}>
				<h1 className='text-3xl font-bold mb-5 mx-auto'>
					PRESCRIPTION DETAILS
				</h1>
				{/* <p>{JSON.stringify(data)}</p> */}

				<div className='flex w-[600px] border flex-col items-center space-y-3 p-5 rounded-md bg-blue-50 shadow-md justify-center'>
					<div className='grid grid-cols-2 w-full'>
						<p>Issue Date: </p>
						<p>{new Date(data.issue_date).toDateString()}</p>
					</div>

					<div className='grid grid-cols-2 w-full'>
						<p>Prescription Status:</p>
						<p>{data.status}</p>
					</div>
					{/* PTIENT DETAILS */}
					<p className='font-semibold text-lg justify'>Patient Details</p>

					<div className='grid grid-cols-2 w-full'>
						<p>First Name:</p>
						<p>{data.patient.first_name}</p>
					</div>

					<div className='grid grid-cols-2 w-full'>
						<p>Last Name:</p>
						<p>{data.patient.last_name}</p>
					</div>

					{/* MEDICATION */}
					<p className='font-semibold text-lg'>Medication Details</p>
					<div className='grid grid-cols-2 w-full'>
						<p>Medication Name:</p>
						<p>{data.medication.medication_name}</p>
					</div>

					<div className='grid grid-cols-2 w-full'>
						<p>Dosage:</p>

						<div>
							<p>
								{data.medication.dosage_strength} {data.medication.dosage_form}
							</p>
							<p>
								{data.medication.dosage_frequency} for{' '}
								{data.medication.dosage_duration_days} days
							</p>
						</div>
					</div>

					{/* DOCTOR DETAILS */}
					<p className='font-semibold text-lg'>Doctor Details</p>

					<div className='grid grid-cols-2 w-full'>
						<p className=''>Doctor Name:</p>
						<p>
							Dr. {data.doctor.first_name} {data.doctor.last_name}
						</p>
					</div>

					<div className='grid grid-cols-2 w-full'>
						<p>Medical Licence Number:</p>
						<p>{data.doctor.medical_license_number}</p>
					</div>
					<div className='grid grid-cols-2 w-full'>
						<p>Specialization</p>
						<p>{data.doctor.specialization}</p>
					</div>
					<div className='grid grid-cols-2 w-full'>
						<p>Contact Info:</p>

						<div>
							<p>+267 {data.doctor.contact_info.work_number.phone_number}</p>
							<p>
								+267 {data.doctor.contact_info.emergency_number.phone_number}
							</p>
							<p>{data.doctor.contact_info.email.email}</p>
						</div>
					</div>
					<div className='w-full flex items-center justify-end h-12 space-x-5'>
						{data.status.toLowerCase() === 'filled' ? (
							<div className='bg-[#eb0000b0] w-[180px] h-9 flex items-center justify-center text-white rounded-md cursor-not-allowed'>
								Prescription Is Filled
							</div>
						) : (
							<div
								onClick={() => fillPrescription(data._id)}
								className='bg-[#1876f2b0] hover:bg-[#1877f2] w-[180px] h-9 flex items-center justify-center text-white rounded-md cursor-pointer'
							>
								Fill This Prescription
								{isLoading ? (
									<span className='ml-2 animate-spin text-white'>
										<CgSpinner />
									</span>
								) : null}
							</div>
						)}
						{/* <div className='bg-[#1876f2b0] hover:bg-[#1877f2] w-[180px] h-9 flex items-center justify-center text-white rounded-md cursor-pointer'>
							Fill This Prescription
						</div> */}
					</div>
				</div>

				{/* OTHER PRES STATUS, ISSUE DATE, EXP DATE */}
				{/* <div className='w-full flex flex-col items-center'>
					<div className='grid grid-cols-2 w-3/5'>
						<p className='font-semibold'>Medication Name</p>
						<p>{data.medication_name}</p>
					</div>

					<div className='grid grid-cols-2 w-3/5'>
						<p className='font-semibold'>Active Ingredient</p>
						<p>{data.active_ingredients}</p>
					</div>

					<div className='grid grid-cols-2 w-3/5 space-y-2'>
						<p className='font-semibold col-span-2'>Dosage</p>

						<p className='font-semibold text-sm'>Dosage Forms:</p>
						<p>{data.dosage.DosageForms}</p>

						<p className='font-semibold text-sm'>Dosage Strengths</p>
						<div>
							{data.dosage.DosageStrengths.map((item: string) => (
								<p>{item}</p>
							))}
						</div>
					</div>

					<div className='grid grid-cols-2 w-3/5'>
						<p className='font-semibold'>Manufacturer</p>
						<p>{data.manufacturer}</p>
					</div>

					<div className='grid grid-cols-2 w-3/5'>
						<p className='font-semibold'>Description</p>
						<p>{data.description}</p>
					</div>

					<div className='grid grid-cols-2 w-3/5'>
						<p className='font-semibold'>Requires Script</p>
						<p>{data.requires_script ? 'Yes' : 'No'}</p>
					</div>
				</div> */}
				<div className='mx-auto  mt-10'>
					<IncompleteCardMessage />
				</div>
			</div>
		);
	}
}
