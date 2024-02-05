import { IncompleteCardMessage } from '@/components/Message/IncompleteMessageCard';
import style from './patient.module.css';

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

export default async function Page({ params }: { params: { slug: string } }) {
	const response = await fetch(
		`${process.env.API_URL}/api/patients/get/${params.slug}`
	);
	if (!response.ok) {
		return <div>Patient Not Found</div>;
	} else {
		const data: PatientData = await response.json();

		return (
			<div className={style.ContentContainer}>
				<div className='flex flex-col w-3/4 border-md shadow-lg border-gray-700 border rounded-lg p-8'>
					<h1 className='text-3xl font-bold mb-3 mx-auto'>PATIENT DETAILS</h1>
					<div className='border-b shadow-lg mb-3' />
					{/* MAP OVER EACH FIELD AND VALUE DISPLAYING TITLE AND TEXT */}
					{Object.entries(data).map(([field, value]) => (
						<div key={field} className='grid grid-cols-2 w-full mx-auto '>
							<h2 className='font-semibold capitalize'>{field}:</h2>
							{/* Check if the value is an object and render accordingly */}
							{typeof value === 'object' && value !== null ? (
								<>
									{Object.entries(value).map(([nestedField, nestedValue]) => (
										<div key={nestedField} className='grid grid-cols-2'>
											<h4 className='font-semibold text-sm'>{nestedField}</h4>
											{typeof nestedValue === 'object' &&
											nestedValue !== null ? (
												<div>
													{Object.entries(nestedValue as any).map(
														([secondNestedField, secondNestedValue]) => (
															<p key={secondNestedField}>
																{/* <h5>{secondNestedField}</h5> */}
																<p>{secondNestedValue as string}</p>
															</p>
														)
													)}
												</div>
											) : (
												<p>
													{
														nestedValue as string /* or appropriate type assertion */
													}
												</p>
											)}
										</div>
									))}
								</>
							) : (
								<p>{value}</p>
							)}
						</div>
					))}

					{/* <div className='mx-auto  mt-10'>
						<IncompleteCardMessage />
					</div> */}
				</div>
			</div>
		);
	}
}
