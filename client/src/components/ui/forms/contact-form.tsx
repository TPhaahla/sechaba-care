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

const contactFormSchema = z.object({
	email: z
		.string({
			required_error: 'Please select an email to display.',
		})
		.email(),
	contact_number: z.number({
		required_error: 'Please enter your contact number.',
	}),
	emergency_contact_number: z.number({
		required_error: 'Please enter your emergency contact number.',
	}),
});

type ProfileFormValues = z.infer<typeof contactFormSchema>;

// This can come from your database or API.
const defaultValues: Partial<ProfileFormValues> = {};

export function ContactForm() {
	const form = useForm<ProfileFormValues>({
		resolver: zodResolver(contactFormSchema),
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
						Contact Information
					</h3>
				</div>
				<FormField
					control={form.control}
					name='contact_number'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Contact Number</FormLabel>
							<FormControl>
								<Input placeholder='' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='email'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder='Select a verified email to display' />
									</SelectTrigger>
								</FormControl>
								<SelectContent className='bg-white'>
									<SelectItem value='m@example.com'>m@example.com</SelectItem>
								</SelectContent>
							</Select>
							{/* <FormDescription>
								You can manage verified email addresses in your{' '}
							</FormDescription> */}
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='emergency_contact_number'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Emergency Contact Number</FormLabel>
							<FormControl>
								<Input placeholder='' {...field} />
							</FormControl>

							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type='submit' className='bg-[#1877F2] text-white'>
					Update Contact Information
				</Button>
			</form>
		</Form>
	);
}
