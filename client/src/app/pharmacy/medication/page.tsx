'use client';
import { Navbar } from '@/components/Navigation/Navbar/Navbar';
import Sidebar from '@/components/Navigation/Sidebar/Sidebar';
import Image from 'next/image';
import styled from 'styled-components';
// import AuthSignIn from './(auth)/auth/components/SignIn';
import { ProfileForm } from '@/components/ui/forms/profile-form';
import { ContactForm } from '@/components/ui/forms/contact-form';
import { DataTableMedicationPharmacy } from '@/components/DataTable/DataTableMedicationPharmacy';

const StyledContentContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 100px;
	justify-content: start;
	align-items: start;
	width: 100%;
	padding: 50px 30px;
	transition: all 0.3s ease;
`;

export default function MedicationDirectory() {
	return (
		<>
			{/* <Navbar/> */}
			{/* <Sidebar/> */}
			<StyledContentContainer>
				{/* Row 1 */}
				<div className='flex  flex-col justify-center items-center w-full'>
					<h1 className='mb-10 font-semibold text-3xl'>MEDICATION DIRECTORY</h1>

					<DataTableMedicationPharmacy />

					{/* <div className='grid grid-cols-2 gap-10'>
						<div className=' w-80 h-52 rounded-lg shadow-lg relative bg-gray-300 hover:shadow-[#6C63FF] cursor-pointer'>
							<Image src='/Search.svg' alt='Hello' layout='fill' />
							<p className='absolute bottom-0 bg-[#6C63FF] text-white font-semibold px-4'>
								Search for Alternative Medication
							</p>
						</div>
						<div className='w-80 h-52 rounded-lg shadow-lg relative bg-gray-300 hover:shadow-[#6C63FF] cursor-pointer'>
							<Image src='/MedicalCare.svg' alt='Hello1' layout='fill' />
							<p className='absolute bottom-0 bg-[#6C63FF] text-white font-semibold px-4'>
								Dispense Medication
							</p>
						</div>
						<div className='w-80 h-52 rounded-lg shadow-lg relative bg-gray-300 hover:shadow-[#6C63FF] cursor-pointer'>
							<Image src='/Medicine.svg' alt='Hello2' layout='fill' />
							<p className='absolute bottom-0 bg-[#6C63FF] text-white font-semibold px-4'>
								Find Doctors
							</p>
						</div>
						<div className='w-80 h-52 rounded-lg shadow-lg relative bg-gray-300 hover:shadow-[#6C63FF] cursor-pointer'>
							<Image src='/Wellness.svg' alt='Hello3' layout='fill' />
							<p className='absolute bottom-0 bg-[#6C63FF] text-white font-semibold px-4'>
								Wellness Information
							</p>
						</div>
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
