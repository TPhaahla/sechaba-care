import styled from 'styled-components';

export const StyledAuthPage = styled.div`
	width: 100%;
	min-height: 100vh;
	height: 100%;
	background-color: f7f7f7;
	display: flex;
	align-items: center;
	justify-content: center;
`;

export const StyledAuthBox = styled.div`
	width: 1037.084px;
	height: 412px;
	transform: rotate(-30deg);
	flex-shrink: 0;
	background: #EECFF8;
	position: absolute;
	top: -150px;
	left: -300px;
`;
 export const StyledAuthBoxLine = styled.div`
	width: 1076.933px;
	height: 373.876px;
	transform: rotate(-30deg);
	flex-shrink: 0;
	border: 1px dashed rgba(188, 0, 204, 0.47);
	background: rgba(217, 217, 217, 0.00);
	position: absolute;
	top: -110px;
	left: -300px;
 `;

export const StyledAuthBody = styled.div`
	display: flex;
	width: 665px;
	height: fit-content;
	padding: 30px;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 30px;
	flex-shrink: 0;
	border-radius: 20px;
	background: #FFF;
	box-shadow: 1px 1px 44px 0px rgba(138, 138, 138, 0.25);
	z-index: 1;
`;

export const StyledSignInForm = styled.form`
	display: flex;
	align-items: center;
	gap: 5px;
	align-self: stretch;
`;

export const StyledInputField = styled.input`
	display: flex;
	height: 44px;
	padding: 10px;
	align-items: center;
	gap: 10px;
	align-self: stretch;
	border-radius: 8px;
	border: 1px solid var(--grey-03, #C9C9C9);
	background: var(--main-white, #FFF);
`;

export const StyledAuthPatternImage = styled.div`
	width: 700px;
	height: 500px;
	flex-shrink: 0;
	border-radius: 0px 0px 115.5px 0px;
	background-image: url(PatternImage);
	position: absolute;
	right: -200px;
	bottom: -200px;
	background-repeat: repeat;
`;

export const StyledAuthTitle = styled.h1`
	color: var(--grey-07, #474747);
	font-size: 18px;
	font-family: Poppins;
	font-style: normal;
	font-weight: 600;
	line-height: 24px;
`;
export const StyledLabel = styled.label`
	color: var(--grey-09, #262626);
	font-size: 14px;
	font-family: Poppins;
	display: flex;
	flex-direction: column;
	align-self: stretch;
	font-style: normal;
	font-weight: 500;
	line-height: normal;
`;

export const StyledFormInputContainer = styled.div`
	width: 60%;
	height: fit-content;
	display: flex;
	flex-direction: column;
	align-items: start;
	justify-content: center;
	gap: 0.9375rem;
	margin-bottom: 0.9375rem;
	& > button {
		margin-top: 0.3125rem;
	}
`;

export const StyledAuthFormGo = styled.div`
	width: 100%;
	text-align: center;
	font-size: ${({ theme }) => theme.fontSize[12]};
	& > span {
		color: ${({ theme }) => theme.color.gray[4]};
		& > * {
			color: ${({ theme }) => theme.color.blue[1]};
			margin-left: 0.3125rem;
			transition: 0.3s;
			&:hover {
				transition: 0.3s;
				cursor: pointer;
				color: ${({ theme }) => theme.color.turquoise[3]};
			}
		}
	}
`;

export const StyledAuthFormSeparator = styled.div`
	position: relative;
	width: 100%;
	height: 1.25rem;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0 4.6875rem;
	& > div {
		color: ${({ theme }) => theme.color.gray[8]};
		border: 0.0313rem solid ${({ theme }) => theme.color.gray[8]};
		width: 100%;
	}
	& > span {
		position: absolute;
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 1.25rem;
		min-height: 1.25rem;
		border-radius: 50%;
		background: ${({ theme }) => theme.color.gray[10]};
		color: ${({ theme }) => theme.color.gray[8]};
		font-size: ${({ theme }) => theme.fontSize[14]};
	}
`;

export const StyledAuthFormSocialMedia = styled.div`
	margin: 0 auto;
	width: 17rem;
	height: 56px;
	border-radius: 0.3125rem;
	box-shadow: 0rem 0.0625rem 0.1875rem rgba(0, 0, 0, 0.1);
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	align-items: center;
	justify-items: center;
	padding: 0.9375rem 1.875rem;
	background: ${({ theme }) => theme.color.gray[10]};
	& > div {
		width: 100%;
		height: 2.0rem;
		&:hover {
			cursor: pointer;
			opactiy: 0.8;
			& > svg {
				transition: 0.3s;
				transform: scale(1.1);
			}
		}
		& > svg {
			transition: 0.3s;
			width: 100%;
			height: 100%;
		}
	}
	& > :nth-child(3) {
		& > svg {
			fill: #1da1f2;
		}
	}
	& > :nth-child(2) {
		border-left: 0.0625rem solid ${({ theme }) => theme.color.gray[8]};
		border-right: 0.0625rem solid ${({ theme }) => theme.color.gray[8]};
	}
`;

export const StyledAuthDisclaimer = styled.p`
	display: flex;
	width: 309px;
	flex-direction: column;
	justify-content: flex-end;
	color: #AAA;
	text-align: center;
	font-size: 14px;
	font-family: Poppins;
	font-style: normal;
	font-weight: 400;
	line-height: 24px;
	`;

export const StyledVerificationContent = styled.div`
	display: flex;
	width: 100%;
	flex-direction: column;
	justify-content: center;
	color: var(--grey-07, #474747);
	text-align: center;
	font-size: 14px;
	font-family: Poppins;
	font-style: normal;
	font-weight: 400;
	line-height: 24px;


`;

export const StyledVerificationResend = styled.div`
	display: flex;
	width: 100%;
	justify-content: center;
	color: #474747;
	text-align: center;
	font-size: 14px;
	font-family: Poppins;
	font-style: normal;
	font-weight: 400;
	line-height: 24px;
	& > span {
		color: #00BFCC;
		cursor: pointer;
		&:hover {
			text-decoration: underline;
		}
	}
`;

export const StyledVerificationTitle = styled.div`
	color: var(--grey-07, #474747);
	text-align: center;
	align-self: stretch;
	font-size: 18px;
	font-family: Poppins;
	font-style: normal;
	font-weight: 600;
	line-height: 24px;
`;

export const StyledSelect = styled.select`
	display: flex;
	height: 44px;
	padding: 10px;
	align-items: center;
	gap: 10px;
	align-self: stretch;
	border-radius: 8px;
	border: 1px solid var(--grey-03, #C9C9C9);
	background: var(--main-white, #FFF);
`;

export const StyledErrorLabel = styled.label`
	color: red;
	font-size: 12px;
	font-family: Poppins;
	display: flex;
	flex-direction: column;
	text-align: center;
	align-self: stretch;
	font-style: normal;
	font-weight: 500;
	line-height: normal;
`;

export const StyledVerificationIconContainer = styled.div`
	position: relative;
	display: flex;
	justify-content: center;
	width: 100%;
`;

export const StyledForgotPasswordText = styled.p`
	width: 100%;
	display: flex;
	justify-content: flex-end;
	font-weight: 300;
	font-size: ${({ theme }) => theme.fontSize[12]};
	color: ${({ theme }) => theme.color.blue[1]};
	margin-left: 0.3125rem;
	transition: 0.3s;
`;
