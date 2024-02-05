'use client';
import { IncompleteCardMessage } from '@/components/Message/IncompleteMessageCard';
import { Dialog } from '@headlessui/react';
import style from './dispensary.module.css';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { ToastEnum, showToast } from '@/components/ui/Toast';
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

interface PageProps {
	params: { slug: string };
}

interface PatientData {
	government_id_number: string;
	first_name: string;
	last_name: string;
	date_of_birth: string; // You might want to use a specific date type here
	address: string;
	contact_info: ContactInfo;
}

// const fillPrescription = async (prescriptionId: string) => {
//     try {
//       setIsFilling(true);

//       // Make API request to fill the prescription
//       const response = await fetch(`${process.env.API_URL}/api/fill-script/${prescriptionId}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           // Include any additional headers if needed
//         },
//       });

//       if (response.ok) {
//         // Prescription filled successfully, you might want to refresh the page or update the UI
//         router.replace(router.asPath);
//       } else {
//         // Handle error response, you can show a message to the user
//         console.error('Failed to fill prescription:', response.statusText);
//       }
//     } finally {
//       setIsFilling(false);
//     }
//   };

export default function Page({ params }: { params: { slug: string } }) {
	const [data, setData] = useState<any>();
	const { data: session } = useSession();
	const [prescriptionInFocus, setPrescriptionInFocus] = useState<
		string | null
	>();
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		// Assuming `fetchMedicationData` is a function to fetch medication data
		const fetchPrescriptionData = async () => {
			try {
				const response = await fetch(
					`${process.env.API_URL}/api/prescription/get/${params.slug}`
				); // Replace with your actual API endpoint
				const fetchedData = await response.json();
				// console.log(fetchedData);
				setData(fetchedData);
			} catch (error) {
				console.error('Error fetching prescription data:', error);
			}
		};

		fetchPrescriptionData();
	}); // Empty dependency array ensures the effect runs only once on mount

	const fillPrescription = async (script_id: string) => {
		setIsLoading(true);
		setPrescriptionInFocus(script_id);
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
				console.log(detail);
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
			setPrescriptionInFocus(null);
		}
		// return;
	};

	if (!data) {
		return <div>Details Not Found</div>;
	} else {
		// const data = await response.json();
		// console.log(data);
		// console.log(data.doctor);

		return (
			<div className={style.ContentContainer}>
				<h1 className='text-3xl font-bold mb-3 mx-auto'>
					PRESCRIPTIONS ON RECORD
				</h1>
				{/* MAP OVER EACH FIELD AND VALUE DISPLAYING TITLE AND TEXT */}
				<div className='space-y-7 w-full flex flex-col items-center'>
					{data?.length === 0 ? (
						<section className=' border-2 border-[#1877f2] bg-blue-50 p-8 rounded-lg flex flex-col items-center '>
							<p className='font-semibold text-[#1877f2]'>
								Patient Has No Scripts in The Database.
							</p>
						</section>
					) : (
						<>
							{data?.map((item: any, index: number) => (
								<div
									key={index}
									className='w-4/5 border rounded-md shadow-lg p-4 bg-blue-50 relative'
								>
									{/* {item.status === 'Filled' ? (
										<div className='absolute top-10 h-10 w-36 bg-red-500 right-0 rotate-45'></div>
									) : null} */}
									<div className='grid grid-cols-2'>
										<p className='font-semibold'>Issued by:</p>
										<p>
											Dr {item.doctor.first_name} {item.doctor.last_name}
										</p>
									</div>
									<div className='grid grid-cols-2'>
										<p className='font-semibold'>Practice Number:</p>
										<p>{item.doctor.medical_license_number}</p>
									</div>
									<div className='grid grid-cols-2'>
										<p className='font-semibold'>Medication:</p>
										<p>
											{item.medication.medication_name} |{' '}
											{item.medication.dosage_form} |{' '}
											{item.medication.dosage_strength} |{' '}
											{item.medication.dosage_frequency} for{' '}
											{item.medication.dosage_duration_days} days.
										</p>
									</div>

									<div className='grid grid-cols-2'>
										<p className='font-semibold'>Active Ingredient:</p>
										<p>{item.medication.active_ingredients}</p>
									</div>
									<div className='grid grid-cols-2'>
										<p className='font-semibold'>Issue Date:</p>
										<p>{item.issue_date}</p>
									</div>
									<div className='grid grid-cols-2'>
										<p className='font-semibold'>
											Expiry Date (Date at which this can no longer be filled):
										</p>
										<p>{item.expiration_date}</p>
									</div>

									<div className='w-full flex items-center justify-end h-12 space-x-5'>
										<Link
											href={`/pharmacy/prescription/${item._id}`}
											className='bg-[#1876f2b0] hover:bg-[#1877f2] w-[180px] h-9 flex items-center justify-center text-white rounded-md cursor-pointer'
										>
											View Details
										</Link>
										{item.status.toLowerCase() === 'filled' ? (
											<div className='bg-[#eb0000b0] w-[180px] h-9 flex items-center justify-center text-white rounded-md cursor-not-allowed'>
												Prescription Is Filled
											</div>
										) : (
											<div
												onClick={() => fillPrescription(item._id)}
												className='bg-[#1876f2b0] hover:bg-[#1877f2] w-[180px] h-9 flex items-center justify-center text-white rounded-md cursor-pointer'
											>
												Fill This Prescription
												{isLoading && item._id === prescriptionInFocus ? (
													<span className='ml-2 animate-spin text-white'>
														<CgSpinner />
													</span>
												) : null}
											</div>
										)}
									</div>
								</div>
							))}
						</>
					)}
				</div>
				<div className='mx-auto  mt-10'>
					<IncompleteCardMessage />
				</div>
			</div>
		);
	}
}
