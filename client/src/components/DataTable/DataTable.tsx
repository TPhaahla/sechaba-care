'use client';

import * as React from 'react';
import {
	CaretSortIcon,
	ChevronDownIcon,
	DotsHorizontalIcon,
} from '@radix-ui/react-icons';
import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table';

import { Button } from '@/components/ui/shadcn/button';
import { Checkbox } from '@/components/ui/shadcn/checkbox';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/shadcn/dropdown-menu';
import { Input } from '@/components/ui/shadcn/input';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/shadcn/table';
import { AiOutlinePlus } from 'react-icons/ai';
import { Dialog } from '@headlessui/react';
import { PrescriptionForm } from '../ui/forms/prescription-form';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

// const data: Script[] = [];

// console.log(data, 'DATA')
enum PrescriptionStatus {
	Pending = 'Pending',
	Filled = 'Filled',
	NotFilled = 'Not Filled',
	Expired = 'Expired',
	Cancelled = 'Cancelled',
}
interface Email {
	email: string;
	verified: boolean;
}

interface PhoneNumber {
	phone_number: number;
	country_code: number;
	verified: boolean;
}

interface Contact {
	email: Email;
	work_number: PhoneNumber;
	emergency_number: PhoneNumber;
}

interface PatientPrescriptionResponse {
	government_id_number: string;
	first_name: string;
	last_name: string;
	date_of_birth: Date; // Assuming you want to represent datetime as Date in TypeScript

	// If you have defined Location and Contact models, you can include them here
	// address: Location;
	// contact_info: Contact;
}

interface DoctorPrescriptionResponse {
	government_id_number: string;
	first_name: string;
	last_name: string;
	medical_license_number: string;
	specialization: string;
	contact_info: Contact; // Assuming Contact is another defined model/interface
}

interface MedicationPrescriptionResponse {
	medication_name: string;
	active_ingredients: string;
	manufacturer: string;
	description: string;
	dosage_strength: string;
	dosage_form: string;
	dosage_frequency: string;
	dosage_duration_days: number;
}
export type Script = {
	_id: string;
	patient: PatientPrescriptionResponse;
	doctor: DoctorPrescriptionResponse;
	medication: MedicationPrescriptionResponse;
	issue_date: string;
	expiration_date: string;
	status: PrescriptionStatus;
};

// export type Script = {
// 	id: string;
// 	amount: number;
// 	status: 'pending' | 'filled' | 'expired' | 'cancelled';
// 	date_issued: Date;
// 	prescription_id: string;
// 	name: string;
// 	insurance: boolean;
// };

export const columns: ColumnDef<Script>[] = [
	//   {
	//     id: "select",
	//     header: ({ table }) => (
	//       <Checkbox
	//         checked={table.getIsAllPageRowsSelected()}
	//         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
	//         aria-label="Select all"
	//       />
	//     ),
	//     cell: ({ row }) => (
	//       <Checkbox
	//         checked={row.getIsSelected()}
	//         onCheckedChange={(value) => row.toggleSelected(!!value)}
	//         aria-label="Select row"
	//       />
	//     ),
	//     enableSorting: false,
	//     enableHiding: false,
	//   },
	{
		accessorKey: 'status',
		header: 'Prescription Status',
		cell: ({ row }) => (
			<div className='capitalize'>{row.getValue('status')}</div>
		),
	},
	{
		accessorKey: 'patient',
		header: ({ column }) => {
			return (
				<Button
					variant='link'
					className=''
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Patient Name
					<CaretSortIcon className='ml-2 h-4 w-4 text-black' />
				</Button>
			);
		},
		cell: ({ row }) => (
			<div className='capitalize'>{`${row.original.patient.first_name} ${row.original.patient.last_name}`}</div>
		),
	},
	{
		accessorKey: 'issue_date',
		header: 'Issue Date',
		cell: ({ row }) => (
			<div className='capitalize'>
				{new Date(row.getValue('issue_date')).toDateString()}
			</div>
		),
	},
	{
		accessorKey: '_id',
		header: 'Prescription ID',
		cell: ({ row }) => <div className='capitalize'>{row.getValue('_id')}</div>,
	},
	// {
	// 	accessorKey: 'insurance',
	// 	header: 'Medical Insurance',
	// 	cell: ({ row }) => (
	// 		<div className='capitalize'>
	// 			{row.getValue('insurance') ? 'Yes' : 'No'}
	// 		</div>
	// 	),
	// },
	{
		id: 'actions',
		enableHiding: false,
		cell: ({ row }) => {
			const Script = row.original;

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant='ghost' className='h-8 w-8 p-0'>
							<span className='sr-only'>Open menu</span>
							<DotsHorizontalIcon className='h-4 w-4 text-black' />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end' className='bg-white'>
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem
							// onClick={() => navigator.clipboard.writeText(Script._id)}
							className='cursor-pointer'
						>
							Copy Script ID
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem className='cursor-pointer'>
							<Link
								href={`/dashboard/patients/${Script.patient.government_id_number}`}
							>
								View Patient
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem className='cursor-pointer'>
							<Link href={`/dashboard/prescriptions/${Script._id}`}>
								View Script details
							</Link>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];

export function DataTableScripts() {
	const [issueNewScript, setIssueNewScript] = React.useState(false);

	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	);
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState({});
	const [data, setData] = React.useState<Script[]>([]);

	const { data: session } = useSession();
	// console.log(session);

	React.useEffect(() => {
		// Assuming `fetchMedicationData` is a function to fetch medication data
		const fetchPrescriptionData = async () => {
			try {
				const response = await fetch(
					`${process.env.API_URL}/api/prescription/get-patients/`,
					{
						method: 'GET',
						headers: {
							Authorization: `Bearer ${session?.user?.access_token}`,
						},
					}
				); // Replace with your actual API endpoint
				const fetchedData = await response.json();
				// console.log(fetchedData);
				setData(fetchedData);
			} catch (error) {
				console.error('Error fetching medication data:', error);
			}
		};

		fetchPrescriptionData();
	}, []);

	const table = useReactTable({
		data,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
	});

	return (
		<div className='w-full'>
			<div className='flex items-center py-4'>
				<Input
					placeholder='Filter patient name...'
					value={(table.getColumn('patient')?.getFilterValue() as string) ?? ''}
					onChange={(event) =>
						table.getColumn('patient')?.setFilterValue(event.target.value)
					}
					className='max-w-sm'
				/>
				<Button
					variant='outline'
					className='ml-auto bg-[#1877F2] text-white'
					onClick={() => setIssueNewScript(true)}
				>
					Issue Script <AiOutlinePlus className='ml-2 h-4 w-4' />
				</Button>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant='outline'
							className='ml-auto bg-[#1877F2] text-white'
						>
							Columns <ChevronDownIcon className='ml-2 h-4 w-4' />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end' className='bg-white'>
						{table
							.getAllColumns()
							.filter((column) => column.getCanHide())
							.map((column) => {
								return (
									<DropdownMenuCheckboxItem
										key={column.id}
										className='capitalize'
										checked={column.getIsVisible()}
										onCheckedChange={(value) =>
											column.toggleVisibility(!!value)
										}
									>
										{column.id
											.split('_')
											.map(
												(word) => word.charAt(0).toUpperCase() + word.slice(1)
											)
											.join(' ')}
									</DropdownMenuCheckboxItem>
								);
							})}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<div className='rounded-md border'>
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id} className='font-semibold'>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
												  )}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && 'selected'}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className='h-24 text-center'
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className='flex items-center justify-end space-x-2 py-4'>
				<div className='flex-1 text-sm text-muted-foreground'>
					{table.getFilteredSelectedRowModel().rows.length} of{' '}
					{table.getFilteredRowModel().rows.length} row(s) selected.
				</div>
				<div className='space-x-2'>
					<Button
						variant='outline'
						size='sm'
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
						className='ml-auto bg-[#1877F2] text-white'
					>
						Previous
					</Button>
					<Button
						variant='outline'
						size='sm'
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
						className='ml-auto bg-[#1877F2] text-white'
					>
						Next
					</Button>
				</div>
			</div>

			<Dialog
				open={issueNewScript}
				onClose={() => setIssueNewScript(false)}
				style={{
					position: 'relative',
					zIndex: 50,
				}}
			>
				<div
					style={{
						position: 'fixed',
						inset: 0,
						backgroundColor: 'black',
						opacity: '30%',
						backdropFilter: 'blur',
					}}
					aria-hidden='true'
				/>
				<div
					style={{
						position: 'fixed',
						inset: 0,
						display: 'flex',
						width: '100vw',
						alignItems: 'center',
						justifyContent: 'center',
						padding: '50px',
					}}
				>
					<Dialog.Panel>
						<div className='flex h-[80vh] bg-white rounded-2xl flex-col justify-center items-center gap-10 min-w-[600px] md:w-80 p-10 sm:gap-4 sm:flex-col md:h-auto md:overflow-y-scroll sm:w-44 sm:h-[auto]'>
							<div className='h-auto max-h-[75vh] w-[550px] rounded-2xl'>
								<PrescriptionForm />
							</div>
						</div>
					</Dialog.Panel>
				</div>
			</Dialog>
		</div>
	);
}
