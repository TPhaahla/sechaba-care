'use client';
import { Navbar } from '@/components/Navigation/Navbar/Navbar';
import Sidebar from '@/components/Navigation/Sidebar/Sidebar';
import Image from 'next/image';
import styled from 'styled-components';
// import AuthSignIn from './(auth)/auth/components/SignIn';
import { DataTableScripts } from '@/components/DataTable/DataTable';
import { ProfileForm } from '@/components/ui/forms/profile-form';
import { ContactForm } from '@/components/ui/forms/contact-form';

const StyledContentContainer = styled.div`
	display: flex;
	// flex-direction: column;
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
`;

export default function Home() {
	return (
		<>
			{/* <Navbar/> */}
			{/* <Sidebar/> */}
			<StyledContentContainer>
				<DataTableScripts />
			</StyledContentContainer>
		</>
	);
}
