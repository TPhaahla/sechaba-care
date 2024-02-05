import { useRef, useState } from 'react';

import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { Autocomplete, LoadScript } from '@react-google-maps/api';
import { set, useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';
import { BW } from 'country-flag-icons/react/3x2';
import DatePicker from 'react-datepicker';
// import 'react-date-picker/dist/DatePicker.css';
// import 'react-calendar/dist/Calendar.css';
import 'react-datepicker/dist/react-datepicker.css';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/shadcn/button';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/shadcn/form';
import { Input } from '@/components/ui/shadcn/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/shadcn/select';
import { ToastEnum, showToast } from '../Toast';
import { CgSpinner } from 'react-icons/cg';
import { useRouter } from 'next/navigation';

const locationSchema = z.object({
	street_address: z.string({
		required_error: 'Please enter the street address.',
	}),
});

const contactSchema = z.object({
	email: z.object({
		email: z.string({
			required_error: 'Please enter the email.',
			// Add email format validation if needed
		}),
		// verified: z.boolean({ required_error: 'Please verify the email.' }),
	}),
	phone_number: z.object({
		phone_number: z.number({
			required_error: 'Please enter the phone number.',
		}),
		// country_code: z.number({
		// 	required_error: 'Please enter the country code.',
		// }),
		// verified: z.boolean({ required_error: 'Please verify the phone number.' }),
	}),
	emergency_contact: z.object({
		phone_number: z.number({
			required_error: 'Please enter the emergency contact number.',
		}),
		// country_code: z.number({
		// 	required_error: 'Please enter the emergency contact country code.',
		// }),
		// verified: z.boolean({
		// 	required_error: 'Please verify the emergency contact number.',
		// }),
		name: z.string({
			required_error: 'Please enter the emergency contact name.',
		}),
		relationship: z.string({
			required_error: 'Please enter the relationship.',
		}),
	}),
});

const patientSchema = z.object({
	first_name: z.string({ required_error: 'Please enter the first name.' }),
	last_name: z.string({ required_error: 'Please enter the last name.' }),
	date_of_birth: z
		.date({ required_error: 'Please select a date of birth.' })
		.refine((value) => value instanceof Date, {
			message: 'Please select a valid date.',
		}),
	government_id_number: z.string({
		required_error: "Please enter the patient's government ID number.",
	}),
	address: z.string({ required_error: "Please enter the patient's address." }),
	contact_info: contactSchema,
});

type PatientFormValues = z.infer<typeof patientSchema>;
type Library =
	| 'core'
	| 'maps'
	| 'places'
	| 'geocoding'
	| 'routes'
	| 'marker'
	| 'geometry'
	| 'elevation'
	| 'streetView'
	| 'journeySharing'
	| 'drawing'
	| 'visualization';

const libraries: Library[] = ['places']; // Define libraries as an array of Library objects
const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;

export function AddPatientForm() {
	const form = useForm<PatientFormValues>({
		resolver: zodResolver(patientSchema),
		mode: 'onChange',
	});

	const autocompleteRef = useRef<any>(null); // Adjust the type as needed
	const autocompleteCityRef = useRef(null); // Adjust the type as needed

	const [country, setCountry] = useState<string>('');
	const [city, setCity] = useState<string>('');
	const [latitude, setLatitude] = useState<number>(0);
	const [longitude, setLongitude] = useState<number>(0);

	const handleStreetPlaceChanged = () => {
		const place = autocompleteRef.current?.getPlace();
		form.setValue('address', place.formatted_address);
		//   inputValues.street = place.formatted_address
		// console.log(place.formatted_address, 'PLACE');
		const check_county = place.address_components.filter((item: any) =>
			item.types.includes('country')
		);
		const country = check_county[0].long_name;
		const city = place.address_components.filter((item: any) =>
			item.types.includes('locality')
		)[0].long_name;
		const latitude = place.geometry.location.lat();
		const longitude = place.geometry.location.lng();

		setCountry(country);
		setCity(city);
		setLatitude(latitude);
		setLongitude(longitude);
	};

	const [isLoading, setIsLoading] = useState<boolean>(false);
	// const router = useRouter();

	async function onSubmit(data: PatientFormValues) {
		// console.log('Patient Data: ', data);
		// data.contact_info.phone_number.country_code = 267;
		// console.log(JSON.stringify(data));
		setIsLoading(true);
		// console.log(data)
		// data = JSON.stringify(data);
		const new_data = JSON.stringify({ data });
		const payload = JSON.parse(new_data);
		payload.data.address = {
			street_address: data.address,
			city,
			country,
			latitude,
			longitude,
		};

		// console.log(payload);
		try {
			// Assuming you have a backend API endpoint for adding patients
			const response = await fetch(`${process.env.API_URL}/api/patients/add`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(payload.data),
			});

			if (response.ok) {
				showToast({
					title: 'Patient Added',
					description: 'Patient was added successfully',
					type: ToastEnum.SUCCESS,
				});
				// REDIRECT TO PATIENTS PAGe
				location.reload();
				// Handle success, e.g., redirect to a success page
			} else {
				// Handle error, e.g., show error message
				// const errorData = await response.json();
				// console.error('Error:', errorData);
				showToast({
					title: 'Patient Could Not Be Added',
					description:
						'The Patient Could not be added at this time. Please Try Again Later',
					type: ToastEnum.ERROR,
				});
				return;
			}
		} catch (error) {
			showToast({
				title: 'Patient Could Not Be Added',
				description:
					'The Patient Could not be added at this time. Please Try Again Later',
				type: ToastEnum.ERROR,
			});
			return;
			// console.error('Error:', error);
		} finally {
			setIsLoading(false);
		}

		// setTimeout(() => {
		// 	showToast({
		// 		title: 'Patient Added',
		// 		description: 'Patient was added successfully',
		// 		type: ToastEnum.SUCCESS,
		// 	});
		// 	alert(JSON.stringify(data, null, 2));
		// 	setIsLoading(false);
		// }, 1000);
		// try {
		// 	// Assuming you have a backend API endpoint for adding patients
		// 	const response = await fetch('/api/patients/add', {
		// 		method: 'POST',
		// 		headers: {
		// 			'Content-Type': 'application/json',
		// 		},
		// 		body: JSON.stringify(data),
		// 	});

		// 	if (response.ok) {
		// 		// Handle success, e.g., redirect to a success page
		// 	} else {
		// 		// Handle error, e.g., show error message
		// 		const errorData = await response.json();
		// 		console.error('Error:', errorData);
		// 	}
		// } catch (error) {
		// 	console.error('Error:', error);
		// }
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
				{/* Existing prescription fields ... */}

				<FormField
					control={form.control}
					name='first_name'
					render={({ field }) => (
						<FormItem>
							<FormLabel>First Name</FormLabel>
							<FormControl>
								<Input placeholder='' {...field} />
							</FormControl>
							<FormDescription></FormDescription>
							<FormMessage className='text-red-500 text-[0.7rem]' />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='last_name'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Last Name</FormLabel>
							<FormControl>
								<Input placeholder='' {...field} />
							</FormControl>
							<FormDescription></FormDescription>
							<FormMessage className='text-red-500 text-[0.7rem]' />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='government_id_number'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Government Issued ID Number</FormLabel>
							<FormControl>
								<div className='flex space-x-2 w-full h-full items-center'>
									<div className=' flex space-x-2 '>
										<BW className=' w-10' />
									</div>
									<Input placeholder='' {...field} />
								</div>
							</FormControl>
							<FormDescription></FormDescription>
							<FormMessage className='text-red-500 text-[0.7rem]' />
						</FormItem>
					)}
				/>

				<LoadScript
					googleMapsApiKey={`${googleMapsApiKey}`}
					libraries={libraries}
				>
					<FormField
						control={form.control}
						name='address'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Street Address</FormLabel>
								<Autocomplete
									onLoad={(autocomplete) => {
										autocompleteRef.current = autocomplete;
									}}
									onPlaceChanged={handleStreetPlaceChanged}
									types={['address']}
									options={{
										componentRestrictions: { country: 'BW' }, // Restrict Country to Botswana
									}}
								>
									<FormControl>
										<Input placeholder='' {...field} />
									</FormControl>
								</Autocomplete>
								<FormDescription></FormDescription>
								<FormMessage className='text-red-500 text-[0.7rem]' />
							</FormItem>
						)}
					/>
				</LoadScript>

				<FormField
					control={form.control}
					name='contact_info.email.email'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input placeholder='' {...field} type='email' />
							</FormControl>
							<FormDescription></FormDescription>
							<FormMessage className='text-red-500 text-[0.7rem]' />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='date_of_birth'
					render={({ field }) => (
						<FormItem>
							<div className='flex flex-col'>
								<FormLabel>Date of Birth</FormLabel>
								<FormControl>
									<div className='mt-2'>
										<div className='border-b' />
										<DatePicker
											selected={field.value}
											// showMonthDropdown
											// showYearPicker
											// showFourColumnMonthYearPicker
											// showFullMonthYearPicker
											dropdownMode='select'
											// scrollableYearDropdown
											showYearDropdown
											showMonthDropdown
											maxDate={new Date()}
											// value={field.value}
											// maxDetail='year'
											// className='text-gray-700'
											onChange={(date) => {
												// const dateOnly = date?.toISOString.split('T')
												form.setValue('date_of_birth', date as Date);
											}}
											dateFormat='yyyy-MM-dd'
										/>
										<div className='border-b' />
									</div>
								</FormControl>
							</div>
							<FormDescription></FormDescription>
							<FormMessage className='text-red-500 text-[0.7rem]' />
						</FormItem>
					)}
				/>

				{/* Add fields for Location and Contact objects if needed ... */}

				<FormField
					control={form.control}
					name='contact_info.phone_number.phone_number'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Phone Number</FormLabel>
							<FormControl>
								<div className='flex space-x-2 w-full h-full items-center'>
									<div className=' flex space-x-2 '>
										<BW className=' w-10' />
										<span>+267</span>
									</div>
									<Input
										placeholder=''
										{...field}
										type='number'
										onChange={(e) => {
											// Convert the string to a number using parseInt or parseFloat
											const numericValue = parseInt(e.target.value, 10); // Adjust the radix as needed
											form.setValue(
												'contact_info.phone_number.phone_number',
												numericValue
											);
										}}
									/>
								</div>
							</FormControl>
							<FormDescription></FormDescription>
							<FormMessage className='text-red-500 text-[0.7rem]' />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='contact_info.emergency_contact.phone_number'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Emergency Contact Phone Number</FormLabel>
							<FormControl>
								<div className='flex space-x-2 w-full h-full items-center'>
									<div className=' flex space-x-2 '>
										<BW className=' w-10' />
										<span>+267</span>
									</div>
									<Input
										placeholder=''
										{...field}
										type='number'
										onChange={(e) => {
											// Convert the string to a number using parseInt or parseFloat
											const numericValue = parseInt(e.target.value, 10); // Adjust the radix as needed
											form.setValue(
												'contact_info.emergency_contact.phone_number',
												numericValue
											);
										}}
									/>
								</div>
							</FormControl>
							<FormDescription></FormDescription>
							<FormMessage className='text-red-500 text-[0.7rem]' />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='contact_info.emergency_contact.name'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Emergency Contact First Name</FormLabel>
							<FormControl>
								<Input placeholder='' {...field} type='text' />
							</FormControl>
							<FormDescription></FormDescription>
							<FormMessage className='text-red-500 text-[0.7rem]' />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='contact_info.emergency_contact.relationship'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Relation to Emergency Contact</FormLabel>
							<FormControl>
								<Input placeholder='' {...field} type='text' />
							</FormControl>
							<FormDescription></FormDescription>
							<FormMessage className='text-red-500 text-[0.7rem]' />
						</FormItem>
					)}
				/>

				<Button
					type='submit'
					className='bg-[#1877F2] text-white'
					disabled={isLoading}
				>
					Create Patient Record
					{isLoading ? (
						<span className='ml-2 animate-spin text-white'>
							<CgSpinner />
						</span>
					) : null}
				</Button>
			</form>
		</Form>
	);
}
