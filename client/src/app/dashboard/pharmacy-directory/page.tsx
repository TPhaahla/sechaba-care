'use client';
import { Navbar } from '@/components/Navigation/Navbar/Navbar';
import Sidebar from '@/components/Navigation/Sidebar/Sidebar';
import Image from 'next/image';
import styled from 'styled-components';
// import AuthSignIn from './(auth)/auth/components/SignIn';
import { ProfileForm } from '@/components/ui/forms/profile-form';
import { ContactForm } from '@/components/ui/forms/contact-form';
import Link from 'next/link';
import { IoLocation } from 'react-icons/io5';
import { MdEmail } from 'react-icons/md';
import { MdOutlineContactPhone } from 'react-icons/md';

import { useEffect, useState } from 'react';

const StyledContentContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 100px;
	justify-content: start;
	align-items: start;
	width: 100%;
	max-width: calc(100vw - 230px);
	padding: 50px 30px;
	margin-left: 230px;
	transition: all 0.3s ease;
	@media (max-width: 1140px) {
		margin-left: 80px;
		max-width: calc(100vw - 80px);
	}
	@media (max-width: 1024px) {
		margin-left: 0px;
		max-width: 100%;
	}
	@media (max-width: 768px) {
		flex-direction: column;
		gap: 10px;
	}
`;
type Pharmacy = {
	_id: { $oid: string };
	pharmacy_name: string;
	address: {
		coordinates: {
			longitude: { $numberDouble: string };
			latitude: { $numberDouble: string };
		};
		country: string;
		city: string;
		street_address: string;
	};
	contact_information: {
		email: { email: string; verified: boolean };
		work_number: {
			phone_number: { $numberLong: string };
			country_code: { $numberInt: number };
			verified: boolean;
		};
		emergency_number: {
			phone_number: { $numberInt: number };
			country_code: { $numberInt: number };
			verified: boolean;
		};
	};
	email_verification_token: string;
};

const pharmacyArray: Pharmacy[] = [
	{
		_id: { $oid: '655f00dd75dab178bc08d388' },
		pharmacy_name: 'ABC Pharmacy 1',
		address: {
			coordinates: {
				longitude: { $numberDouble: '-73.987304' },
				latitude: { $numberDouble: '40.748817' },
			},
			country: 'United States',
			city: 'New York',
			street_address: '123 Main Street',
		},
		contact_information: {
			email: { email: 'abcpharmacy1@example.com', verified: true },
			work_number: {
				phone_number: { $numberLong: '5551234567' },
				country_code: { $numberInt: 1 },
				verified: true,
			},
			emergency_number: {
				phone_number: { $numberInt: 911 },
				country_code: { $numberInt: 1 },
				verified: true,
			},
		},
		email_verification_token: '287d64f5c6f1de28c80526945ca3dd17',
	},
	{
		_id: { $oid: '655f00dd75dab178bc08d389' },
		pharmacy_name: 'Botswana Pharmacy 2',
		address: {
			coordinates: {
				longitude: { $numberDouble: '25.9201' },
				latitude: { $numberDouble: '-24.6282' },
			},
			country: 'Botswana',
			city: 'Gaborone',
			street_address: '456 Main Street',
		},
		contact_information: {
			email: { email: 'botswanapharmacy2@example.com', verified: true },
			work_number: {
				phone_number: { $numberLong: '26712345678' },
				country_code: { $numberInt: 267 },
				verified: true,
			},
			emergency_number: {
				phone_number: { $numberInt: 911 },
				country_code: { $numberInt: 267 },
				verified: true,
			},
		},
		email_verification_token: '287d64f5c6f1de28c80526945ca3dd18',
	},
	{
		_id: { $oid: '655f00dd75dab178bc08d38a' },
		pharmacy_name: 'Botswana Pharmacy 3',
		address: {
			coordinates: {
				longitude: { $numberDouble: '25.9500' },
				latitude: { $numberDouble: '-24.6542' },
			},
			country: 'Botswana',
			city: 'Gaborone',
			street_address: '789 Main Street',
		},
		contact_information: {
			email: { email: 'botswanapharmacy3@example.com', verified: true },
			work_number: {
				phone_number: { $numberLong: '26723456789' },
				country_code: { $numberInt: 267 },
				verified: true,
			},
			emergency_number: {
				phone_number: { $numberInt: 911 },
				country_code: { $numberInt: 267 },
				verified: true,
			},
		},
		email_verification_token: '287d64f5c6f1de28c80526945ca3dd19',
	},
	{
		_id: { $oid: '655f00dd75dab178bc08d38b' },
		pharmacy_name: 'Botswana Pharmacy 4',
		address: {
			coordinates: {
				longitude: { $numberDouble: '26.0220' },
				latitude: { $numberDouble: '-24.6280' },
			},
			country: 'Botswana',
			city: 'Gaborone',
			street_address: '101 Main Street',
		},
		contact_information: {
			email: { email: 'botswanapharmacy4@example.com', verified: true },
			work_number: {
				phone_number: { $numberLong: '26734567890' },
				country_code: { $numberInt: 267 },
				verified: true,
			},
			emergency_number: {
				phone_number: { $numberInt: 911 },
				country_code: { $numberInt: 267 },
				verified: true,
			},
		},
		email_verification_token: '287d64f5c6f1de28c80526945ca3dd20',
	},
	{
		_id: { $oid: '655f00dd75dab178bc08d38c' },
		pharmacy_name: 'Botswana Pharmacy 5',
		address: {
			coordinates: {
				longitude: { $numberDouble: '25.9201' },
				latitude: { $numberDouble: '-24.6282' },
			},
			country: 'Botswana',
			city: 'Gaborone',
			street_address: '456 Main Street',
		},
		contact_information: {
			email: { email: 'botswanapharmacy5@example.com', verified: true },
			work_number: {
				phone_number: { $numberLong: '26745678901' },
				country_code: { $numberInt: 267 },
				verified: true,
			},
			emergency_number: {
				phone_number: { $numberInt: 911 },
				country_code: { $numberInt: 267 },
				verified: true,
			},
		},
		email_verification_token: '287d64f5c6f1de28c80526945ca3dd21',
	},
	{
		_id: { $oid: '655f00dd75dab178bc08d38d' },
		pharmacy_name: 'Botswana Pharmacy 6',
		address: {
			coordinates: {
				longitude: { $numberDouble: '25.8500' },
				latitude: { $numberDouble: '-24.7042' },
			},
			country: 'Botswana',
			city: 'Gaborone',
			street_address: '678 Main Street',
		},
		contact_information: {
			email: { email: 'botswanapharmacy6@example.com', verified: true },
			work_number: {
				phone_number: { $numberLong: '26756789012' },
				country_code: { $numberInt: 267 },
				verified: true,
			},
			emergency_number: {
				phone_number: { $numberInt: 911 },
				country_code: { $numberInt: 267 },
				verified: true,
			},
		},
		email_verification_token: '287d64f5c6f1de28c80526945ca3dd22',
	},
	{
		_id: { $oid: '655f00dd75dab178bc08d38e' },
		pharmacy_name: 'Botswana Pharmacy 7',
		address: {
			coordinates: {
				longitude: { $numberDouble: '25.8800' },
				latitude: { $numberDouble: '-24.7480' },
			},
			country: 'Botswana',
			city: 'Gaborone',
			street_address: '910 Main Street',
		},
		contact_information: {
			email: { email: 'botswanapharmacy7@example.com', verified: true },
			work_number: {
				phone_number: { $numberLong: '26767890123' },
				country_code: { $numberInt: 267 },
				verified: true,
			},
			emergency_number: {
				phone_number: { $numberInt: 911 },
				country_code: { $numberInt: 267 },
				verified: true,
			},
		},
		email_verification_token: '287d64f5c6f1de28c80526945ca3dd23',
	},
	{
		_id: { $oid: '655f00dd75dab178bc08d38f' },
		pharmacy_name: 'Botswana Pharmacy 8',
		address: {
			coordinates: {
				longitude: { $numberDouble: '25.8900' },
				latitude: { $numberDouble: '-24.7880' },
			},
			country: 'Botswana',
			city: 'Gaborone',
			street_address: '1112 Main Street',
		},
		contact_information: {
			email: { email: 'botswanapharmacy8@example.com', verified: true },
			work_number: {
				phone_number: { $numberLong: '26778901234' },
				country_code: { $numberInt: 267 },
				verified: true,
			},
			emergency_number: {
				phone_number: { $numberInt: 911 },
				country_code: { $numberInt: 267 },
				verified: true,
			},
		},
		email_verification_token: '287d64f5c6f1de28c80526945ca3dd24',
	},
	{
		_id: { $oid: '655f00dd75dab178bc08d390' },
		pharmacy_name: 'Botswana Pharmacy 9',
		address: {
			coordinates: {
				longitude: { $numberDouble: '25.8600' },
				latitude: { $numberDouble: '-24.7580' },
			},
			country: 'Botswana',
			city: 'Gaborone',
			street_address: '1314 Main Street',
		},
		contact_information: {
			email: { email: 'botswanapharmacy9@example.com', verified: true },
			work_number: {
				phone_number: { $numberLong: '26789012345' },
				country_code: { $numberInt: 267 },
				verified: true,
			},
			emergency_number: {
				phone_number: { $numberInt: 911 },
				country_code: { $numberInt: 267 },
				verified: true,
			},
		},
		email_verification_token: '287d64f5c6f1de28c80526945ca3dd25',
	},
	{
		_id: { $oid: '655f00dd75dab178bc08d391' },
		pharmacy_name: 'Botswana Pharmacy 10',
		address: {
			coordinates: {
				longitude: { $numberDouble: '25.8700' },
				latitude: { $numberDouble: '-24.7680' },
			},
			country: 'Botswana',
			city: 'Gaborone',
			street_address: '1516 Main Street',
		},
		contact_information: {
			email: { email: 'botswanapharmacy10@example.com', verified: true },
			work_number: {
				phone_number: { $numberLong: '26790123456' },
				country_code: { $numberInt: 267 },
				verified: true,
			},
			emergency_number: {
				phone_number: { $numberInt: 911 },
				country_code: { $numberInt: 267 },
				verified: true,
			},
		},
		email_verification_token: '287d64f5c6f1de28c80526945ca3dd26',
	},
];
export default function PharmacyDirectory() {
	const [pharmacies, setPharmacies] = useState(pharmacyArray);

	// useEffect(() => {
	// 	// Fetch pharmacies when the component mounts
	// 	fetchPharmacies();
	// }, []);

	// const fetchPharmacies = async () => {
	// 	try {
	// 		const response = await fetch('API_ENDPOINT_URL'); // Replace 'API_ENDPOINT_URL' with the actual URL of your API
	// 		const data = await response.json();
	// 		setPharmacies(data); // Assuming the API response is an array of pharmacy data
	// 	} catch (error) {
	// 		console.error('Error fetching pharmacies:', error);
	// 	}
	// };
	return (
		<>
			{/* <Navbar/> */}
			{/* <Sidebar/> */}
			<StyledContentContainer>
				{/* Row 1 */}
				<div className='flex flex-col items-center h-[80vh] w-full '>
					<h1 className='mb-10  font-semibold text-3xl'>PHARMACY DIRECTORY</h1>

					{/* <div className='w-80 h-52 rounded-lg  relative  cursor-pointer'>
						<Image src='/NoNotifications.svg' alt='Hello1' layout='fill' />
					</div>
					<p className=' mt-10 px-4'>
						You currently have no messages that require your attention.
					</p>
					<p>New messages will be se</p> */}
					{pharmacies.map((pharmacy) => (
						<div
							key={pharmacy._id.$oid}
							className='w-full rounded-lg border border-gray-300 mb-4 p-5'
						>
							{/* <h2>Pharmacy Details</h2> */}
							{/* <p>ID: {pharmacy._id.$oid}</p> */}
							<p className='font-semibold mb-2 text-lg'>
								{pharmacy.pharmacy_name}
							</p>
							<p className='text-gray-400 flex items-center'>
								<span className='mr-2'>
									<IoLocation />
								</span>
								{pharmacy.address.street_address}, {pharmacy.address.city},{' '}
								{pharmacy.address.country}
							</p>
							{/* <p>
								Coordinates:{' '}
								{pharmacy.address.coordinates.latitude.$numberDouble},{' '}
								{pharmacy.address.coordinates.longitude.$numberDouble}
							</p> */}
							<p className='flex items-center text-[#6C63FF]'>
								{' '}
								<span className='mr-2'>
									<MdEmail />
								</span>
								{pharmacy.contact_information.email.email}
							</p>
							<p className='flex items-center'>
								<span className='mr-2'>
									<MdOutlineContactPhone />
								</span>
								+
								{
									pharmacy.contact_information.work_number.country_code
										.$numberInt
								}{' '}
								{
									pharmacy.contact_information.work_number.phone_number
										.$numberLong
								}
							</p>
							{/* <p className='flex items-center'>
								<span className='mr-2'>
									<MdOutlineContactPhone />
								</span>
								{
									pharmacy.contact_information.emergency_number.phone_number
										.$numberInt
								}
							</p> */}
							{/* <p>
								Email Verification Token: {pharmacy.email_verification_token}
							</p> */}
						</div>
					))}
					{/* <div className=' h-36 w-full rounded-lg border border-gray-300'>
                    <h2>Pharmacy Details</h2>
                    <p>ID: {pharmacy._id.$oid}</p>
                    <p>Name: {pharmacy.pharmacy_name}</p>
                    <p>Address: {pharmacy.address.street_address}, {pharmacy.address.city}, {pharmacy.address.country}</p>
                    <p>Coordinates: {pharmacy.address.coordinates.latitude.$numberDouble}, {pharmacy.address.coordinates.longitude.$numberDouble}</p>
                    <p>Email: {pharmacy.contact_information.email.email}</p>
                    <p>Work Number: {pharmacy.contact_information.work_number.phone_number.$numberLong}</p>
                    <p>Emergency Number: {pharmacy.contact_information.emergency_number.phone_number.$numberInt}</p>
                    <p>Email Verification Token: {pharmacy.email_verification_token}</p>
					</div> */}
				</div>

				{/* Row 2 */}
				{/* <div>
				</div> */}
				{/* <div>Pharmacy</div>
				<p>
					Lorem ipsum, dolor sit amet consectetur adipisicing elit. Neque,
					aliquid vel? Vel, delectus numquam rem earum praesentium debitis enim
					suscipit ipsa quia quis. Necessitatibus deleniti culpa non quis neque
					quasi optio minima velit voluptas sint distinctio, repellendus
					accusamus veritatis doloribus ex eveniet, minus ullam fuga? Inventore
					id aperiam ut vel ea esse animi voluptatum impedit nostrum facilis,
					reiciendis, commodi eaque doloribus harum fugit nesciunt rerum. Autem
					vero sint amet numquam beatae nobis possimus nesciunt totam labore
					officiis ducimus explicabo consequuntur harum molestiae, provident
					quo. Atque provident quos nisi ipsam optio hic voluptate doloremque ab
					ad, blanditiis aut cupiditate accusantium veritatis voluptatem modi
					maxime. Amet voluptatem, quae, suscipit illo nam explicabo ex
					provident officiis hic iure, tempora aspernatur temporibus. Quia,
					ducimus officia non voluptates id similique ex perferendis molestiae
					eum earum iusto harum alias voluptas rerum sunt nostrum nobis delectus
					veritatis deserunt unde quas! Doloremque animi minus voluptate sint,
					vero repudiandae nesciunt ullam officia nostrum ut natus aspernatur
					eos aliquam earum quo impedit sunt assumenda nobis expedita ipsam hic
					tenetur quibusdam? Ipsam, neque? Facere tempora distinctio sit
					architecto accusamus natus impedit molestias accusantium alias
					mollitia consequatur ut a suscipit, doloribus enim deleniti
					repudiandae labore. Debitis consequatur, at sint tempora similique
					officiis!
				</p> */}
			</StyledContentContainer>
		</>
	);
}
