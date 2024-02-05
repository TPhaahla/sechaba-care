import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';

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
import { useState } from 'react';

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

const medicationSchema = z.object({
	medication_name: z.string({
		required_error: 'Please enter the medication name.',
	}),
	active_ingredient: z.string({
		required_error: 'Please enter the active ingredient.',
	}),
	manufaturer: z.string().min(1).max(100), // Use a string type with appropriate validation
	description: z.date({
		required_error: 'Please select an expiration date.',
	}),
	requires_script: z.boolean({
		required_error: 'Please select a status.',
	}),
});

type MedicationFormValues = z.infer<typeof medicationSchema>;

export function MedicationForm() {
	// const [selectedMedication, setSelectedMedication] =
	// 	useState<Medication | null>(null);
	// const [query, setQuery] = useState('');

	// const filteredMedication =
	// 	query === ''
	// 		? medication
	// 		: medication.filter((item) => {
	// 				return item.medication_name
	// 					.toLowerCase()
	// 					.includes(query.toLowerCase());
	// 		  });

	const form = useForm<MedicationFormValues>({
		resolver: zodResolver(medicationSchema),
		mode: 'onChange',
	});

	function onSubmit(data: MedicationFormValues) {
		// Here, you can submit the `data` object to your server or perform other actions.
		// Example: You can use axios or fetch to send the data to your backend.
		// Make sure to convert the `data` object to the desired format for submission.

		// For illustration purposes, we'll log the data to the console.
		console.log('M Form Data:', data);

		// You can replace the log statement with your actual submission code.
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
				<FormField
					control={form.control}
					name='medication_name'
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
					name='active_ingredient'
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
				/>
				{/* <FormField
					control={form.control}
					name='dosage_instructions'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Dosage Instructions</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder='Dosage Form' />
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
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder='Dosage Strength' />
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
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder='Dosage Frequency' />
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
				/> */}
				{/* <FormField
					control={form.control}
					name='issue_date'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Issue Date</FormLabel>
							<FormControl>
								<Input
									type='date'
									{...field}
									value={
										field.value
											? new Date(field.value).toISOString().split('T')[0]
											: new Date().toISOString().split('T')[0]
									} // Convert Date to string in 'YYYY-MM-DD' format if value is defined
								/>
							</FormControl>
							<FormDescription></FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='expiration_date'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Expiration Date</FormLabel>
							<FormControl>
								<Input
									type='date'
									{...field}
									value={
										field.value
											? new Date(field.value).toISOString().split('T')[0]
											: ''
									} // Convert Date to string in 'YYYY-MM-DD' format if value is defined
								/>
							</FormControl>
							<FormDescription></FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/> */}
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

				<Button type='submit' className='bg-[#1877F2] text-white'>
					Submit Medication
				</Button>
			</form>
		</Form>
	);
}
