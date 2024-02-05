import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';
import DatePicker from 'react-datepicker';
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
import { Textarea } from '@/components/ui/shadcn/textarea';
import { toast } from '@/components/ui/shadcn/use-toast';
import { Combobox } from '@headlessui/react';
import { Medication } from '@/components/DataTable/DataTableMedication';
import { useEffect, useState } from 'react';
import { ToastEnum, showToast } from '../Toast';
import { CgSpinner } from 'react-icons/cg';
import { useSession } from 'next-auth/react';

enum DosageForm {
	Tablet = 'Tablet',
	Liquid = 'Liquid',
	Capsule = 'Capsule',
	Inhaler = 'Inhaler',
	Nebulizer = 'Nebulizer',
}

enum DosageFrequency {
	ONE_DAILY = 'Once a day',
	TWO_DAILY = 'Twice a day',
	THREE_DAILY = 'Three times a day',
	AS_NECESSARY = 'As necessary',
}
//   // Convert the enum values to an array of strings
// const dosageFormValues = Object.values(DosageForm);
const dosageFormValues = ['Tablet', 'Liquid', 'Capsule'];

const dosageInstructionsSchema = z.object({
	DosageForm: z.enum(['Tablet', 'Liquid', 'Capsule', 'Inhaler', 'Nebulizer']),
	DosageStrength: z.string(),
	DosageFrequency: z.enum([
		'Once a day',
		'Twice a day',
		'Three times a day',
		'As necessary',
	]),
	DosageDurationDays: z.number(),
});

const recurringObjectSchema = z.object({
	recurring: z.boolean(),
	repetitions: z.number(),
});

const prescriptionSchema = z.object({
	patient_government_id_number: z.string({
		required_error: 'Please enter the patient ID.',
	}),
	medication_id: z.string({
		required_error: 'Please enter the medication ID.',
	}),
	// doctor_id: z.string({
	// 	required_error: 'Please enter the doctor ID.',
	// }),
	dosage_instructions: dosageInstructionsSchema, // Use a string type with appropriate validation
	issue_date: z.date({
		required_error: 'Please select an issue date.',
	}),
	// expiration_date: z.date({
	// 	required_error: 'Please select an expiration date.',
	// }),
	// dosage_duration_days: z.number(),
	// status: z.string({
	// 	required_error: 'Please select a status.',
	// }),
	// pharmacy_id: z.string({
	// 	required_error: 'Please enter the pharmacy ID.',
	// }),
	recurring: recurringObjectSchema,
	// number_of_repeats: z.number(),
});

type PrescriptionFormValues = z.infer<typeof prescriptionSchema>;

const medication: Medication[] = [];

export function PrescriptionForm() {
	const [selectedMedication, setSelectedMedication] =
		useState<Medication | null>(null);
	const [query, setQuery] = useState('');
	const [medication, setMedication] = useState<Medication[]>([]);

	const { data: session } = useSession();
	// console.log('SESSION', session);

	useEffect(() => {
		// Assuming `fetchMedicationData` is a function to fetch medication data
		const fetchMedicationData = async () => {
			try {
				const response = await fetch(
					`${process.env.API_URL}/api/medication/get-all`
				); // Replace with your actual API endpoint
				const fetchedData = await response.json();
				// console.log(fetchedData);
				setMedication(fetchedData);
			} catch (error) {
				console.error('Error fetching medication data:', error);
			}
		};

		fetchMedicationData();
	}, []); // Empty dependency array ensures the effect runs only once on mount

	const filteredMedication =
		query === ''
			? medication
			: medication.filter((item) => {
					return item.medication_name
						.toLowerCase()
						.includes(query.toLowerCase());
			  });

	const form = useForm<PrescriptionFormValues>({
		resolver: zodResolver(prescriptionSchema),
		mode: 'onChange',
	});

	const [isLoading, setIsLoading] = useState<boolean>(false);

	async function onSubmit(data: PrescriptionFormValues) {
		setIsLoading(true);

		try {
			const response = await fetch(
				`${process.env.API_URL}/api/prescription/issue`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${session?.user?.access_token}`,
					},
					body: JSON.stringify(data),
				}
			);

			if (response.ok) {
				showToast({
					title: 'Prescription Status',
					description:
						'Prescritpion was issued successfully and is now in the database.',
					type: ToastEnum.SUCCESS,
				});
				// REDIRECT TO PATIENTS PAGe
				location.reload();
				const data = await response.json();
				// console.log(data, 'PRESCRIPTION');
				// Handle success, e.g., redirect to a success page
			} else {
				if (response.status === 409) {
					// Display a specific alert for conflict
					alert(
						'Our records indicate a conflict. This patient has a script issued that overlaps the current one.'
					);
				} else {
					// Handle other errors, e.g., show error message
					showToast({
						title: 'Prescription Could Not Be Added',
						description:
							'The Prescription Could not be added at this time. Please Try Again Later',
						type: ToastEnum.ERROR,
					});
				}
				return;
				// Handle error, e.g., show error message
				// const errorData = await response.json();
				// console.error('Error:', errorData);
			}
		} catch (error) {
			showToast({
				title: 'Failed To Issue Prescription',
				description:
					'The Prescription Could not be added at this time. Please Try Again Later',
				type: ToastEnum.ERROR,
			});
			return;
			// console.error('Error:', error);
		} finally {
			setIsLoading(false);
		}
		// Here, you can submit the `data` object to your server or perform other actions.
		// Example: You can use axios or fetch to send the data to your backend.
		// Make sure to convert the `data` object to the desired format for submission.

		// For illustration purposes, we'll log the data to the console.
		// console.log('Prescription Form Data:', data);
		// alert('Prescription Form Data:' + JSON.stringify(data));

		// You can replace the log statement with your actual submission code.
	}

	const [data, setData] = useState<Medication[]>([]);

	// Empty dependency array ensures the effect runs only once on mount

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
				<FormField
					control={form.control}
					name='patient_government_id_number'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Patient ID</FormLabel>
							<FormControl>
								<Input placeholder='' {...field} />
							</FormControl>
							<FormDescription></FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='medication_id'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Medication Name</FormLabel>
							<FormControl>
								<div id='medication-combobox'>
									<Combobox
										value={selectedMedication ? selectedMedication : null}
										onChange={(selectedMedication) => {
											setSelectedMedication(selectedMedication);
											// setSelectedMedication(selectedMedication);

											// Set the form value for medication_id to selectedMedication._id
											form.setValue(
												'medication_id',
												selectedMedication ? selectedMedication._id : ''
											);
										}}
									>
										{/* <Combobox.Input
											className='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
											onChange={(e) => setQuery(e.target.value)}
										/> */}
										<Combobox.Input
											className='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
											onChange={(e) => setQuery(e.target.value)}
											value={
												selectedMedication === null
													? query
													: selectedMedication.medication_name
											}
										/>

										<Combobox.Options>
											{filteredMedication.map((item) => (
												<Combobox.Option key={item._id} value={item}>
													{item.medication_name}
												</Combobox.Option>
											))}
										</Combobox.Options>
									</Combobox>
								</div>
							</FormControl>
							<FormDescription></FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				{/* <FormField
					control={form.control}
					name='doctor_id'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Doctor ID</FormLabel>
							<FormControl>
								<Input placeholder='' {...field} />
							</FormControl>
							<FormDescription></FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/> */}
				<FormField
					control={form.control}
					name='dosage_instructions.DosageForm'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Dosage Instructions</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder='--Dosage Form--' />
									</SelectTrigger>
								</FormControl>
								<SelectContent className='bg-white '>
									{selectedMedication?.dosage.DosageForms.map((form) => (
										<SelectItem
											key={form}
											value={form}
											className='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
										>
											{form}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{/* </FormControl> */}
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='dosage_instructions.DosageStrength'
					render={({ field }) => (
						<FormItem>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder='--Dosage Strength--' />
									</SelectTrigger>
								</FormControl>
								<SelectContent className='bg-white'>
									{selectedMedication?.dosage.DosageStrengths.map((form) => (
										<SelectItem key={form} value={form}>
											{form}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='dosage_instructions.DosageFrequency'
					render={({ field }) => (
						<FormItem>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder='--Dosage Frequency--' />
									</SelectTrigger>
								</FormControl>
								<SelectContent className='bg-white'>
									{Object.values(DosageFrequency).map((form) => (
										<SelectItem key={form} value={form}>
											{form}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormDescription></FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className='grid grid-cols-2 '>
					<FormField
						control={form.control}
						name='issue_date'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Issue Date</FormLabel>
								<FormControl>
									<DatePicker
										selected={field.value}
										onChange={(date) => {
											// const dateOnly = date?.toISOString.split('T')
											form.setValue('issue_date', date as Date);
										}}
										dateFormat='yyyy-MM-dd'
									/>
								</FormControl>
								<FormDescription></FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='dosage_instructions.DosageDurationDays'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Dosage Duration In Days</FormLabel>
								<FormControl>
									<Input
										placeholder=''
										{...field}
										type='number'
										onChange={(e) => {
											// Convert the string to a number using parseInt or parseFloat
											const numericValue = parseInt(e.target.value, 10); // Adjust the radix as needed
											form.setValue(
												'dosage_instructions.DosageDurationDays',
												numericValue
											);
										}}
									/>
								</FormControl>
								<FormDescription></FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className='grid grid-cols-2 '>
					<FormField
						control={form.control}
						name='recurring.recurring'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Repeat Prescription</FormLabel>
								<FormControl>
									<Input
										type='checkbox'
										checked={field.value}
										onChange={(e) => {
											const isChecked = e.target.checked;
											field.onChange(e);

											// Set the form value for recurring to true when the checkbox is checked
											form.setValue(
												'recurring.recurring',
												isChecked ? true : false
											);
										}}
									/>
								</FormControl>
								<FormDescription></FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='recurring.repetitions'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Number of Repeats</FormLabel>
								<FormControl>
									<Input
										placeholder=''
										{...field}
										type='number'
										onChange={(e) => {
											// Convert the string to a number using parseInt or parseFloat
											const numericValue = parseInt(e.target.value, 10); // Adjust the radix as needed
											form.setValue('recurring.repetitions', numericValue);
										}}
									/>
								</FormControl>
								<FormDescription></FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				{/* <FormField
					control={form.control}
					name='status'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Status</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder='Select a status' />
									</SelectTrigger>
								</FormControl>
								<SelectContent className='bg-white'>
									<SelectItem value='Pending'>Pending</SelectItem>
									<SelectItem value='Approved'>Approved</SelectItem>
									<SelectItem value='Denied'>Denied</SelectItem>
								</SelectContent>
							</Select>
							<FormDescription></FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/> */}

				<Button
					type='submit'
					className='bg-[#1877F2] text-white'
					disabled={isLoading}
				>
					Submit Prescription
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
