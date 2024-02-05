import { IncompleteCardMessage } from '@/components/Message/IncompleteMessageCard';
import style from './prescriptions.module.css';

export default async function Page({ params }: { params: { slug: string } }) {
	const response = await fetch(
		`${process.env.API_URL}/api/prescription/get/presc-id/${params.slug}`
	);
	if (!response.ok) {
		return (
			<div className={style.ContentContainer}>
				<h1 className='text-3xl font-bold mb-5 mx-auto'>
					Prescription Details Not Found
				</h1>
				;
			</div>
		);
	} else {
		const data = await response.json();
		// console.log(data);

		return (
			<div className={style.ContentContainer}>
				<div className='flex flex-col w-1/2 border-md shadow-lg border-gray-700 border rounded-lg p-8'>
					<h1 className='text-3xl font-bold mb-5 mx-auto'>
						PRESCRIPTION DETAILS
					</h1>
					<div className='border-b mb-3' />
					{/* <p>{JSON.stringify(data)}</p> */}

					<div className='flex w-full flex-col items-center space-y-3'>
						<div className='grid grid-cols-2 w-2/5'>
							<p>Issue Date: </p>
							<p>{new Date(data.issue_date).toDateString()}</p>
						</div>

						<div className='grid grid-cols-2 w-2/5'>
							<p>Prescription Status:</p>
							<p>{data.status}</p>
						</div>
						{/* PTIENT DETAILS */}
						<p className='font-semibold text-lg justify'>Patient Details</p>

						<div className='grid grid-cols-2 w-2/5'>
							<p>First Name:</p>
							<p>{data.patient.first_name}</p>
						</div>

						<div className='grid grid-cols-2 w-2/5'>
							<p>Last Name:</p>
							<p>{data.patient.last_name}</p>
						</div>

						{/* MEDICATION */}
						<p className='font-semibold text-lg'>Medication Details</p>
						<div className='grid grid-cols-2 w-2/5'>
							<p>Medication Name:</p>
							<p>{data.medication.medication_name}</p>
						</div>

						<div className='grid grid-cols-2 w-2/5'>
							<p>Dosage:</p>

							<div>
								<p>
									{data.medication.dosage_strength}{' '}
									{data.medication.dosage_form}
								</p>
								<p>
									{data.medication.dosage_frequency} for{' '}
									{data.medication.dosage_duration_days} days
								</p>
							</div>
						</div>

						{/* DOCTOR DETAILS */}
						<p className='font-semibold text-lg'>Doctor Details</p>

						<div className='grid grid-cols-2 w-2/5'>
							<p className=''>Doctor Name:</p>
							<p>
								Dr. {data.doctor.first_name} {data.doctor.last_name}
							</p>
						</div>

						<div className='grid grid-cols-2 w-2/5'>
							<p>Medical Licence Number:</p>
							<p>{data.doctor.medical_license_number}</p>
						</div>
						<div className='grid grid-cols-2 w-2/5'>
							<p>Specialization</p>
							<p>{data.doctor.specialization}</p>
						</div>
						<div className='grid grid-cols-2 w-2/5'>
							<p>Contact Info:</p>

							<div>
								<p>+267 {data.doctor.contact_info.work_number.phone_number}</p>
								<p>
									+267 {data.doctor.contact_info.emergency_number.phone_number}
								</p>
								<p>{data.doctor.contact_info.email.email}</p>
							</div>
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
					{/* <div className='mx-auto  mt-10'>
					<IncompleteCardMessage />
				</div> */}
				</div>
			</div>
		);
	}
}
