import { IncompleteCardMessage } from '@/components/Message/IncompleteMessageCard';
import style from './medication.module.css';

export default async function Page({ params }: { params: { slug: string } }) {
	const response = await fetch(
		`${process.env.API_URL}/api/medication/get/${params.slug}`
	);
	if (!response.ok) {
		return <div>Medication Not Found</div>;
	} else {
		const data = await response.json();
		// console.log(data);

		return (
			<div className={style.ContentContainer}>
				<h1 className='text-3xl font-bold mb-5 mx-auto'>MEDICATION DETAILS</h1>
				{/* <p>{JSON.stringify(data)}</p> */}

				<div className='w-full flex flex-col items-center'>
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
								<p key={item}>{item}</p>
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
				</div>
				<div className='mx-auto  mt-10'>
					<IncompleteCardMessage />
				</div>
			</div>
		);
	}
}
