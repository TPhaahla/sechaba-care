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
import { MedicationForm } from '../ui/forms/add-medication-form';
import Link from 'next/link';

enum DosageForm {
	Tablet = 'Tablet',
	Liquid = 'Liquid',
	Capsule = 'Capsule',
	Inhaler = 'Inhaler',
	Nebulizer = 'Nebulizer',
}

type Dosage = {
	DosageForms: DosageForm[]; // Forms in which the medication is available
	DosageStrengths: string[]; // Strengths or concentrations of the medication
};

export type Medication = {
	_id: string;
	medication_name: string; // Name of the medication
	active_ingredients: string; // Active ingredients in the medication
	dosage: Dosage; // Dosage information of the medication
	manufacturer: string; // Manufacturer of the medication
	description?: string | null; // Additional description of the medication
	requires_script: boolean; // Does the medication require a prescription
};
// const data: Medication[] = [];

// const data: Medication[] = [
// 	{
// 		id: '1',
// 		medication_name: 'Aspirin',
// 		active_ingredients: 'Acetylsalicylic acid',
// 		dosage: {
// 			DosageForms: [DosageForm.Tablet],
// 			DosageStrengths: ['81mg', '325mg'],
// 		},
// 		manufacturer: 'Bayer',
// 		description: 'Commonly used as a pain reliever and anti-inflammatory drug.',
// 		requires_script: false,
// 	},
// 	{
// 		id: '2',
// 		medication_name: 'Ibuprofen',
// 		active_ingredients: 'Ibuprofen',
// 		dosage: {
// 			DosageForms: [DosageForm.Tablet, DosageForm.Liquid],
// 			DosageStrengths: ['200mg', '400mg'],
// 		},
// 		manufacturer: 'Advil',
// 		description: 'Used for pain relief and reducing fever.',
// 		requires_script: false,
// 	},
// 	{
// 		id: '3',
// 		medication_name: 'Lisinopril',
// 		active_ingredients: 'Lisinopril',
// 		dosage: {
// 			DosageForms: [DosageForm.Tablet],
// 			DosageStrengths: ['10mg', '20mg'],
// 		},
// 		manufacturer: 'AstraZeneca',
// 		description: 'An ACE inhibitor used to treat high blood pressure.',
// 		requires_script: true,
// 	},
// 	{
// 		id: '4',
// 		medication_name: 'Simvastatin',
// 		active_ingredients: 'Simvastatin',
// 		dosage: {
// 			DosageForms: [DosageForm.Tablet],
// 			DosageStrengths: ['10mg', '20mg'],
// 		},
// 		manufacturer: 'Merck',
// 		description: 'A statin medication used to lower cholesterol levels.',
// 		requires_script: true,
// 	},
// 	{
// 		id: '5',
// 		medication_name: 'Metformin',
// 		active_ingredients: 'Metformin',
// 		dosage: {
// 			DosageForms: [DosageForm.Tablet],
// 			DosageStrengths: ['500mg', '1000mg'],
// 		},
// 		manufacturer: 'Various',
// 		description: 'Used to treat type 2 diabetes.',
// 		requires_script: true,
// 	},
// 	{
// 		id: '5',
// 		medication_name: 'Omeprazole',
// 		active_ingredients: 'Omeprazole',
// 		dosage: {
// 			DosageForms: [DosageForm.Capsule],
// 			DosageStrengths: ['20mg', '40mg'],
// 		},
// 		manufacturer: 'AstraZeneca',
// 		description:
// 			'A proton pump inhibitor used to treat heartburn and acid reflux.',
// 		requires_script: false,
// 	},
// 	{
// 		id: '6',
// 		medication_name: 'Albuterol',
// 		active_ingredients: 'Albuterol',
// 		dosage: {
// 			DosageForms: [DosageForm.Inhaler, DosageForm.Nebulizer],
// 			DosageStrengths: ['90mcg', '180mcg'],
// 		},
// 		manufacturer: 'GlaxoSmithKline',
// 		description: 'A bronchodilator used to treat asthma and COPD.',
// 		requires_script: true,
// 	},
// 	{
// 		id: '7',
// 		medication_name: 'Warfarin',
// 		active_ingredients: 'Warfarin',
// 		dosage: {
// 			DosageForms: [DosageForm.Tablet],
// 			DosageStrengths: ['1mg', '5mg'],
// 		},
// 		manufacturer: 'Various',
// 		description: 'An anticoagulant used to prevent blood clots.',
// 		requires_script: true,
// 	},
// 	{
// 		id: '8',
// 		medication_name: 'Prednisone',
// 		active_ingredients: 'Prednisone',
// 		dosage: {
// 			DosageForms: [DosageForm.Tablet],
// 			DosageStrengths: ['5mg', '10mg'],
// 		},
// 		manufacturer: 'Various',
// 		description:
// 			'A corticosteroid used to treat inflammation and autoimmune conditions.',
// 		requires_script: true,
// 	},
// ];

export const columns: ColumnDef<Medication>[] = [
	{
		accessorKey: 'medication_name',
		header: ({ column }) => {
			return (
				<Button
					variant='link'
					className=''
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Medication Name
					<CaretSortIcon className='ml-2 h-4 w-4 text-black' />
				</Button>
			);
		},
		cell: ({ row }) => (
			<div className='capitalize'>{row.getValue('medication_name')}</div>
		),
	},
	{
		accessorKey: 'active_ingredients',
		header: 'Active Ingredient',
		cell: ({ row }) => (
			<div className='capitalize'>{row.getValue('active_ingredients')}</div>
		),
	},
	{
		accessorKey: 'manufacturer',
		header: 'Manufacturer',
		cell: ({ row }) => (
			<div className='capitalize'>{row.getValue('manufacturer')}</div>
		),
	},
	{
		accessorKey: 'requires_script',
		header: 'Requires Prescription',
		cell: ({ row }) => (
			<div className='capitalize'>
				{row.getValue('requires_script') ? 'Yes' : 'No'}
			</div>
		),
	},

	{
		id: 'actions',
		enableHiding: false,
		cell: ({ row }) => {
			const Script = row.original;

			return (
				<Link
					href={`/pharmacy/medication/${Script._id}`}
					className='h-7 w-24 bg-[#1876f2b0] hover:bg-[#1877f2] cursor-pointer flex items-center justify-center rounded-md text-white'
				>
					View Details
				</Link>
				// <DropdownMenu>
				// 	<DropdownMenuTrigger asChild>
				// 		<Button variant='ghost' className='h-8 w-8 p-0'>
				// 			<span className='sr-only'>Open menu</span>
				// 			<DotsHorizontalIcon className='h-4 w-4 text-black' />
				// 		</Button>
				// 	</DropdownMenuTrigger>
				// 	<DropdownMenuContent align='end' className='bg-white'>
				// 		<DropdownMenuLabel>Actions</DropdownMenuLabel>
				// 		<DropdownMenuItem
				// 			onClick={() => navigator.clipboard.writeText(Script._id)}
				// 			className='cursor-pointer'
				// 		>
				// 			Copy Medication ID
				// 		</DropdownMenuItem>
				// 		<DropdownMenuSeparator />
				// 		<DropdownMenuItem className='cursor-pointer'>
				// 			<Link
				// 				href={`/dashboard/medication/${Script._id}`}
				// 				target='_blank'
				// 			>
				// 				View Medication Details
				// 			</Link>
				// 		</DropdownMenuItem>
				// 	</DropdownMenuContent>
				// </DropdownMenu>
			);
		},
	},
];

export function DataTableMedicationPharmacy() {
	const [addNewMedication, setAddNewMedication] = React.useState(false);
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	);
	const [data, setData] = React.useState<Medication[]>([]);
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState({});

	React.useEffect(() => {
		// Assuming `fetchMedicationData` is a function to fetch medication data
		const fetchMedicationData = async () => {
			try {
				const response = await fetch(
					`${process.env.API_URL}/api/medication/get-all`
				); // Replace with your actual API endpoint
				const fetchedData = await response.json();
				// console.log(fetchedData);
				setData(fetchedData);
			} catch (error) {
				console.error('Error fetching medication data:', error);
			}
		};

		fetchMedicationData();
	}, []); // Empty dependency array ensures the effect runs only once on mount

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
					placeholder='Filter medication...'
					value={
						(table.getColumn('medication_name')?.getFilterValue() as string) ??
						''
					}
					onChange={(event) =>
						table
							.getColumn('medication_name')
							?.setFilterValue(event.target.value)
					}
					className='max-w-sm'
				/>
				{/* <Button
					variant='outline'
					className='ml-auto bg-[#1877F2] text-white'
					onClick={() => setAddNewMedication(true)}
				>
					Add New Medication <AiOutlinePlus className='ml-2 h-4 w-4' />
				</Button> */}

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
				open={addNewMedication}
				onClose={() => setAddNewMedication(false)}
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
								{/* <PrescriptionForm /> */}
								<MedicationForm />
							</div>
						</div>
					</Dialog.Panel>
				</div>
			</Dialog>
		</div>
	);
}
