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

const authSchema = z.object({
	username: z.string({ required_error: 'Please enter your username.' }),
	password: z.string({ required_error: 'Please enter your password.' }),
});

type AuthFormValues = z.infer<typeof authSchema>;

export function AuthForm() {
	const form = useForm<AuthFormValues>({
		resolver: zodResolver(authSchema),
		mode: 'onChange',
	});

	function onSubmit(data: AuthFormValues) {
		// Handle authentication here, e.g., make an API request to validate the credentials
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
				<FormField
					control={form.control}
					name='username'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Username</FormLabel>
							<FormControl>
								<Input type='text' {...field} />
							</FormControl>
							<FormDescription></FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='password'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Password</FormLabel>
							<FormControl>
								<Input type='password' {...field} />
							</FormControl>
							<FormDescription></FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type='submit' className='bg-[#1877F2] text-white w-full'>
					Log In
				</Button>
			</form>
		</Form>
	);
}
