// import { motion } from 'framer-motion';
import styled from 'styled-components';

export const NavbarContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	max-height: 75px;
	width: 100vw;
	min-width: 375px;
	max-width: 100vw;
	box-shadow: 0 0 0px 1px ${({ theme }) => theme.color.gray[9]};
	background-color: ${({ theme }) => theme.color.gray[10]};
	position: fixed;
	top: 0;
	left: 0;
	z-index: 30;
`;
export const NavbarWrapper = styled.nav`
	display: flex;
	justify-content: start;
	align-items: center;
	height: 75px;
	width: 100%;
	min-width: 320px;
	padding: 0 40px;
	@media (max-width: 1024px) {
		padding: 0 20px;
	}
`;
export const NavbarLogo = styled.button`
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	min-width: 221px;
	max-width: 394px;
	height: 120px;
	transition: all 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
	z-index: 99;
	@media (max-width: 650px) {
		transition: all 0.7s cubic-bezier(0.075, 0.82, 0.165, 1);
		min-width: 150px;
		max-width: 150px;
		height: 28px;
	}
`;
export const StyledLocationWrapper = styled.button`
	border: none;
	background-color: transparent;
	border-left: 1px solid ${({ theme }) => theme.color.gray[9]};
	width: fit-content;
	height: 40px;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-left: 20px;
	padding-left: 5px;
	font-weight: 300;
	color: ${({ theme }) => theme.color.gray[5]};
	font-size: 14px;
	z-index: 99;
	& > p {
		width: 90px;
	}
	@media (max-width: 640px) {
		display: none;
	}
`;
export const StyledLocationImageContainer = styled.div`
	width: fit-content;
	height: fit-content;
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	& > svg {
		fill: ${({ theme }) => theme.color.gray[1]};
	}
	& > span {
		position: absolute;
		top: 4.5px;
		left: 6.7px;
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background-color: ${({ theme }) => theme.color.turquoise[1]};
	}
`;
export const NavbarMenu = styled.ul`
	display: flex;
	justify-content: flex-end;
	align-items: center;
	width: 100%;
	gap: 12px;
	font-size: 16px;
	padding-left: 30px;
	@media (max-width: 1024px) {
		display: none;
	}
`;
export const NavbarMenuRight = styled.div`
	display: flex;
	justify-content: flex-end;
	align-items: center;
	margin-left: auto;
`;
export const NavbarMenuItem = styled.button`
	display: flex;
	justify-content: center;
	align-items: center;
	min-width: fit-content;
	height: 100%;
	margin-right: 20px;
	border: none;
	background-color: transparent;
	color: ${({ theme }) => theme.color.gray[1]};
	font-weight: 400;
	font-size: 16px;
	transition: all 0.2s ease-in-out;
	font-family: 'Poppins';
	&:hover {
		cursor: pointer;
		opacity: 0.5;
		color: ${({ theme }) => theme.color.turquoise[1]};
	}
	&:active {
		opacity: 1;
		color: ${({ theme }) => theme.color.turquoise[2]};
	}
`;

export const NavbarMenuButtonsContainer = styled.div`
	display: flex;
	justify-content: flex-end;
	align-items: center;
	gap: 12px;
`;

export const NavbarMenuButton = styled.div`
	display: flex;
	justify-content: center;
	min-width: 70px;
	width: 10%;
	z-index: 50;
	@media (min-width: 1025px) {
		display: none;
	}
`;
export const StyledLoggedNavbarMenu = styled.div`
	display: flex;
	align-items: center;
	justify-content: flex-end;
	height: fit-content;
	width: fit-content;
	gap: 40px;
	transition: all 0.2s ease-in-out;
	& > button {
		border: none;
		background-color: transparent;
		&:hover {
			cursor: pointer;
			& > svg {
				transition: all 0.2s ease-in-out;
				fill: ${({ theme }) => theme.color.turquoise[4]};
			}
		}
		& > svg {
			fill: ${({ theme }) => theme.color.turquoise[5]};
		}
	}
`;
export const StyledAvatarContainer = styled.div<{
	isactive: string;
}>`
	border: 1px solid red;
	position: relative;
	margin-left: 20px;
	border: none;
	background-color: transparent;
	height: 100%;
	width: fit-content;
	display: flex;
	justify-content: space-between;
	align-items: center;
	&:hover {
		cursor: pointer;
		& > svg {
			fill: ${({ theme }) => theme.color.turquoise[4]};
		}
	}
	& > svg {
		transition: all 0.2s ease-in-out;
		transform: ${({ isactive }) =>
			isactive === 'true' ? 'rotate(180deg)' : 'rotate(0deg)'};
		fill: ${({ isactive, theme }) =>
			isactive === 'true' ? theme.color.turquoise[4] : theme.color.gray[7]};
	}
`;

export const StyledAvatar = styled.div`
	position: relative;
	border-radius: 50%;
	width: 40px;
	height: 40px;
	display: flex;
	justify-content: center;
	align-items: center;
	overflow: hidden;
	padding: 2px;
`;

export const StyledNavbarMenuContainer = styled.div`
	position: absolute;
	height: fit-content;
	width: fit-content;
	transition: all 0.2s ease-in-out;
	top: 50px;
	right: -10px;
	background-color: ${({ theme }) => theme.color.gray[10]} !important;
	border-radius: 10px;
`;

export const StyledLoggedNavbarPopup = styled.div`
	height: 300px;
	width: fit-content;
	max-width: 420px;
	min-width: 320px;
	box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
	border-radius: 10px;
	background-color: ${({ theme }) => theme.color.gray[10]};
	padding: 0 20px;
	cursor: default;
	overflow: hidden;
`;
export const StyledLoggedNavbarPopupHeader = styled.div`
	height: 60px;
	border-bottom: 1px solid ${({ theme }) => theme.color.gray[9]};
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-weight: ${({ theme }) => theme.fontWeight[400]};
	&:hover {
		cursor: pointer;
		transition: all 0.2s ease-in-out;
		& > span,
		svg {
			color: ${({ theme }) => theme.color.turquoise[4]};
			fill: ${({ theme }) => theme.color.turquoise[4]};
		}
	}
	& > :first-child {
		display: flex;
		align-items: center;
		gap: 10px;
		& > :first-child {
			position: relative;
			border-radius: 50%;
			width: 24px;
			height: 24px;
			overflow: hidden;
		}
		& > span {
			color: ${({ theme }) => theme.color.gray[1]};
			font-size: ${({ theme }) => theme.fontSize[18]};
		}
	}
	& > :nth-child(2) {
		font-size: ${({ theme }) => theme.fontSize[14]};
		color: ${({ theme }) => theme.color.gray[7]};
		padding-top: 4px;
		padding-right: 10px;
	}
`;

export const StyledLoggedNavbarPopupBody = styled.div`
	width: 100%;
	height: 100%;
	min-height: 190px;
	display: flex;
	flex-direction: column;
	justify-content: start;
	gap: 30px;
	padding-top: 30px;
`;
export const StyledLoggedNavbarPopupItem = styled.button`
	border: none;
	background-color: transparent;
	height: fit-content;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: start;
	gap: 20px;
	padding-left: 4px;
	font-size: ${({ theme }) => theme.fontSize[14]};
	transition: all 0.2s ease-in-out;
	& > svg {
		fill: ${({ theme }) => theme.color.gray[1]};
	}
	&:hover {
		cursor: pointer;
		transition: all 0.2s ease-in-out;
		& > span,
		svg {
			color: ${({ theme }) => theme.color.turquoise[4]};
			fill: ${({ theme }) => theme.color.turquoise[4]};
		}
	}
`;
