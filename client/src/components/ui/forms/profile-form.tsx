'use client';

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

const profileFormSchema = z.object({
	first_name: z.string().min(2, {
		message: 'First name must be at least 2 characters.',
	}),
	last_name: z.string().min(2, {
		message: 'Last name must be at least 2 characters.',
	}),
	medical_license_number: z.string().min(2, {
		message: 'Last name must be at least 2 characters.',
	}),
	email: z
		.string({
			required_error: 'Please select an email to display.',
		})
		.email(),
	specialization: z.string({
		required_error: 'Please enter your medical specialization.',
	}),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// This can come from your database or API.
const defaultValues: Partial<ProfileFormValues> = {};

export function ProfileForm() {
	const form = useForm<ProfileFormValues>({
		resolver: zodResolver(profileFormSchema),
		defaultValues,
		mode: 'onChange',
	});

	//   const { fields, append } = useFieldArray({
	//     name: "urls",
	//     control: form.control,
	//   })

	function onSubmit(data: ProfileFormValues) {
		toast({
			title: 'You submitted the following values:',
			description: (
				<pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
					<code className='text-white'>{JSON.stringify(data, null, 2)}</code>
				</pre>
			),
		});
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4  pb-6'>
				<div className=' h-11 border-b border-b-[#d9e0e5] flex items-center'>
					<h3 className='h-4 font-semibold text-xs uppercase'>
						Basic Information
					</h3>
				</div>
				<FormField
					control={form.control}
					name='first_name'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Legal First Name</FormLabel>
							<FormControl>
								<Input placeholder='' {...field} />
							</FormControl>
							{/* <FormDescription className='text-xs'>
								The legal first name of the doctor.
							</FormDescription> */}
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='last_name'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Legal Last Name</FormLabel>
							<FormControl>
								<Input placeholder='' {...field} />
							</FormControl>
							{/* <FormDescription>
								The legal last name of the doctor.
							</FormDescription> */}
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='medical_license_number'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Medical License Number</FormLabel>
							<FormControl>
								<Input placeholder='' {...field} />
							</FormControl>
							{/* <FormDescription>
								The medical license number of the doctor.
							</FormDescription> */}
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='specialization'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Specialization</FormLabel>
							<FormControl>
								<Input placeholder='' {...field} />
							</FormControl>
							{/* <FormDescription>
								The specialization of the doctor.
							</FormDescription> */}
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type='submit' className='bg-[#1877F2] text-white'>
					Update Profile Information
				</Button>
			</form>
		</Form>
	);
}
