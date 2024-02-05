import { FC, useState } from 'react';
import Link from 'next/link';
import { BsCalendar4, BsPrescription2 } from 'react-icons/bs';
import { BiHomeAlt } from 'react-icons/bi';
import { FaHospitalUser } from 'react-icons/fa';
import { FaUserDoctor } from 'react-icons/fa6';
import { IoChatbubblesOutline } from 'react-icons/io5';
import { AiOutlineUser } from 'react-icons/ai';
import { IoMdNotifications } from 'react-icons/io';
import { CgLogOut } from 'react-icons/cg';
import * as Styled from './Sidebar.styled';
import { sidebarItems } from './Sidebar.shared';
import {
	DoctorSectionsEnum,
	StateMachineInterface,
} from '@/interface/page.interface';
import { signOut } from 'next-auth/react';

const Sidebar: FC<StateMachineInterface> = () => {
	const [activeSection, setActiveSection] = useState<DoctorSectionsEnum>(
		DoctorSectionsEnum.PRESCRIPTIONS
	);
	return (
		<Styled.StyledSidebarContainer>
			<Styled.StyledSidebarItemsContainer>
				{sidebarItems.map((item) => {
					return (
						<Link
							key={item.id}
							href={
								item.id === DoctorSectionsEnum.MY_PROFILE
									? '/dashboard/profile'
									: item.id === DoctorSectionsEnum.PRESCRIPTIONS
									? '/dashboard/prescriptions'
									: item.id === DoctorSectionsEnum.PATIENTS
									? '/dashboard/patients'
									: item.id === DoctorSectionsEnum.PHARMACY
									? '/dashboard/pharmacy'
									: item.id === DoctorSectionsEnum.MEDICATION_DIRECTORY
									? '/dashboard/medication'
									: item.id === DoctorSectionsEnum.HOME
									? '/dashboard'
									: item.id === DoctorSectionsEnum.NOTIFICATIONS
									? '/dashboard/notifications'
									: '#'
							}
							onClick={() => setActiveSection(item.id)}
						>
							<Styled.StyledSidebarItem
								key={item.id}
								active={activeSection === item.id}
							>
								<Styled.StyledSidebarHoveredIndicator />
								{item.component === 'BiHomeAlt' ? (
									<BiHomeAlt />
								) : item.component === 'BsPrescription2' ? (
									<BsPrescription2 />
								) : item.component === 'FaHospitalUser' ? (
									<FaHospitalUser />
								) : item.component === 'IoMdNotifications' ? (
									<IoMdNotifications />
								) : (
									<FaUserDoctor />
								)}
								<Styled.StyledSidebarItemName>
									{item.name}
								</Styled.StyledSidebarItemName>
							</Styled.StyledSidebarItem>
						</Link>
					);
				})}
				<div className='h-full aspect-square mt-auto'>
					<div
						className='flex items-center h-16 w-[120px] space-x-1 ml-8 absolute bottom-14 cursor-pointer bg-blue-50'
						onClick={() => signOut()}
					>
						<CgLogOut className=' text-3xl' />
						<p>Sign Out</p>
					</div>
				</div>
			</Styled.StyledSidebarItemsContainer>
		</Styled.StyledSidebarContainer>
	);
};

export default Sidebar;
