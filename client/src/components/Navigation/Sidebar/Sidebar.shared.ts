import { DoctorSectionsEnum } from "@/interface/page.interface";

export const sidebarItems = [
	{
		id: DoctorSectionsEnum.HOME,
		name: 'Home',
		component: 'BiHomeAlt',
		legend: 'Start messaging with the stylist',
		link: '#',
	},
	// {
	// 	id: DoctorSectionsEnum.PRESCRIPTIONS,
	// 	name: 'Prescriptions',
	// 	component: 'BsPrescription2',
	// 	legend: 'Start messaging with the stylist',
	// 	link: '#',
	// },
	// {
	// 	id: DoctorSectionsEnum.PATIENTS,
	// 	name: 'Patients',
	// 	component: 'FaHospitalUser',
	// 	legend: 'View your bookings',
	// 	link: '#',
	// },
	// {
	// 	id: DoctorSectionsEnum.PHARMACY,
	// 	name: 'Pharmacy',
	// 	component: 'MdOutlineLocalPharmacy',
	// 	legend: 'Manage Pharmacy',
	// 	link: '#',
	// },
	// {
	// 	id: DoctorSectionsEnum.MEDICATION_DIRECTORY,
	// 	name: 'Medication Directory',
	// 	component: 'GiMedicines',
	// 	legend: 'View Medication Directory',
	// 	link: '#',
	// },
	{
		id: DoctorSectionsEnum.NOTIFICATIONS,
		name: 'Notifications',
		component: 'IoMdNotifications',
		link:'#',
	},
	{
		id: DoctorSectionsEnum.MY_PROFILE,
		name: 'My Profile',
		component: 'FaUserDoctor',
		legend: 'Personalisation',
		link: '#',
	},
];
