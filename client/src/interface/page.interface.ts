import { Dispatch, SetStateAction } from 'react';

export interface StateMachineInterface {
	isOpen?: boolean;
	setIsOpen?: Dispatch<SetStateAction<boolean>>;
}

export enum DoctorSectionsEnum {
	HOME = 'home',
	PRESCRIPTIONS = 'prescriptions',
	PATIENTS = 'patients',
	MY_PROFILE = 'my_profile',
	PHARMACY = 'pharmacy',
	MEDICATION_DIRECTORY = 'medication_directory',
	NOTIFICATIONS = 'notifications'
}

// export enum PharmacySectionsEnum {
// 	HOME = 'home',
// 	BOOKING = 'booking',
// 	CHAT = 'chat',
// 	EXPLORE = 'explore'
// }