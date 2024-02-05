import styled from 'styled-components';

export const StyledSidebarContainer = styled.div`
	position: fixed;
	top: 40px;
	left: 0;
	min-width: 230px;
	height: 100vh;
	flex-1;
	background-color: ${({ theme }) => theme.color.gray[10]};
	box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
	@media (max-width: 1140px) {
		min-width: 80px;
	}
	@media (max-width: 1024px) {
		bottom: 0;
		top: auto;
		left: 0;
		right: 0;
		height: 60px;
		z-index: 11;
	}
`;
export const StyledSidebarItemsContainer = styled.div`
	gap: 10px;
	padding-top: 55px;
	display: flex;
	flex-direction: column;
	@media (max-width: 1140px) {
		align-items: center;
		gap: 16px;
	}
	@media (max-width: 1024px) {
		padding-top: 0;
		align-items: center;
		justify-content: space-around;
		flex-direction: row;
		height: 100%;
		width: 100%;
		gap: 5px;
	}
`;
export const StyledSidebarItem = styled.button<{ active: boolean }>`
	background: none;
	border: none;
	position: relative;
	display: flex;
	align-items: center;
	min-width: 50px;
	padding: 10px 20px 10px 35px;
	font-size: ${({ theme }) => theme.fontSize[18]};
	cursor: pointer;
	color: ${({ theme }) => theme.color.gray[7]};
	transition: all 0.5s ease-in-out;
	& > svg {
		width: 20px;
		height: 20px;
		display: flex;
		align-items: center;
		justify-content: start;
		padding: 0;
	}
	&:hover {
		transition: all 0.5s ease-in-out;
		& > svg {
			transition: all 0.5s ease-in-out;
			fill: ${({ theme }) => theme.color.blue[1]};
			stroke: ${({ theme }) => theme.color.blue[1]};
		}
		& > div {
			transition: all 0.5s ease-in-out;
			color: ${({ theme, active }) => (active ? null : theme.color.gray[1])};

		}
	}
	${({active, theme }) =>
	active &&
		`
		& > :first-child {
			background: ${theme.color.blue[1]};
		}
		& > svg {
			fill: ${theme.color.blue[1]};
			stroke: ${theme.color.blue[1]};
		}
		& > div {
			color: ${theme.color.blue[1]};
		}
	`}
	@media (max-width: 1140px) {
		padding: 0;
		width: 25%;
		height: 100%;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 100%;
		& > svg {
			width: 24px;
			height: 24px;
		}
		& > :first-child {
			display: none;
		}
		&:hover {
			& > svg {
				fill: ${({ theme, active }) => (active ? null : theme.color.blue[1])};
				stroke: ${({ theme, active }) => (active ? null : theme.color.blue[1])};
			}
			& > div {
				transition: all 0.5s ease-in-out;
				color: ${({ theme, active }) => (active ? null : theme.color.blue[1])};

			}
		}
		${({active, theme }) =>
		active &&
			`
		& > div {
			color: ${theme.color.blue[1]};
		}
	`}
	}
	@media (max-width: 1024px) {
		padding: 0;
		width: 25%;
		height: 100%;
		flex-direction: column;
		justify-content: space-evenly;
		align-items: center;
		& > svg {
			width: 20px;
			height: 20px;
		}
	}
`;
export const StyledSidebarHoveredIndicator = styled.div`
	position: absolute;
	left: 0;
	width: 7px;
	background: ${({ theme }) => theme.color.gray[10]};
	border-radius: 0 10px 10px 0;
	height: 100%;
`;
export const StyledSidebarItemName = styled.div`
	margin-left: 16px;
	font-weight: 300;
	@media (max-width: 1140px) {
		width: 100%;
		margin: 0;
		font-size: ${({ theme }) => theme.fontSize[10]};
		font-weight: ${({ theme }) => theme.fontWeight[500]};
	}
`;
