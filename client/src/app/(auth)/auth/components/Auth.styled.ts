import styled from 'styled-components';

export const StyledAuthFormContainer = styled.form`
	display: flex;
	flex-direction: column;
	justify-content: start;
	align-items: center;
	height: fit-content;
	max-height: calc(100vh - 30px);
	width: 100%;
	max-width: 450px;
	box-shadow: 1px 1px 44px rgba(138, 138, 138, 0.25);
	border-radius: 20px;
	padding: 30px 30px 15px 30px;
	background-color: ${({ theme }) => theme.color.gray[10]};
	overflow: scroll;
`;

export const StyledAuthFormHeader = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	& > h1 {
		font-size: ${({ theme }) => theme.fontSize[18]};
		font-weight: ${({ theme }) => theme.fontWeight[600]};
	}
	& > svg {
		transition: 0.2s;
		&:hover {
			cursor: pointer;
			opacity: 0.8;
			transition: 0.2s;
		}
	}
`;

export const StyledAuthFormInputContainer = styled.div`
	height: fit-content;
	display: flex;
	flex-direction: column;
	align-items: start;
	justify-content: center;
	width: 100%;
	padding-top: 30px;
	font-size: ${({ theme }) => theme.fontSize[14]};
	& > div {
		height: fit-content;
		padding: 0;
		width: 100%;
		position: relative;
		margin-bottom: 10px;
		& > span {
			position: absolute;
			height: 100%;
			right: 10px;
			&:hover {
				& > svg {
					transition: 0.3s;
					color: #1877F2;
				}
			}
			& > svg {
				height: 100%;
				width: 16px;
				color: ${({ theme }) => theme.color.gray[1]};
			}
		}
	}
	& > span {
		margin-top: 20px;
	}
`;

export const StyledErrorSpan = styled.span`
	color: #CD7687;
	font-size: 0.7rem;
	margin-top: -5px;
	display: flex;
	width: 100%;
	justify-content: flex-end;
`;

export const StyledAuthFormInput = styled.input`
	height: 44px;
	width: 100%;
	border: 1px solid ${({ theme }) => theme.color.gray[8]};
	border-radius: 10px;
	padding: 0 30px 0 15px;
	font-size: ${({ theme }) => theme.fontSize[16]};
	font-weight: ${({ theme }) => theme.fontWeight[400]};
	&:focus {
		outline: none;
		border: 1px solid #1877f2;
	}
	&::placeholder {
		color: ${({ theme }) => theme.color.gray[8]};
	}
	::-ms-reveal {
		display: none;
	}
`;

export const StyledAuthFormGoLogin = styled.div`
	width: 100%;
	text-align: center;
	font-size: ${({ theme }) => theme.fontSize[14]};
	padding: 10px 0 20px 0;
	& > span {
		color: ${({ theme }) => theme.color.gray[4]};
		& > * {
			color: #1877F2;
			margin-left: 10px;
			transition: 0.3s;
			&:hover {
				transition: 0.3s;
				cursor: pointer;
				text-decoration: underline ;
			}
		}
	}
`;

export const StyledAuthFormSocialMedia = styled.div`
	margin: 0 auto;
	width: 100%;
	height: 60px;
	border-radius: 5px;
	box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);
	display: grid;
	grid-template-columns: 1fr 1fr 1fr 1fr;
	align-items: center;
	justify-items: center;
	padding: 10px 0px;
	background: ${({ theme }) => theme.color.gray[10]};
	& > div {
		width: 100%;
		height: 40px;
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
	& > :nth-child(2) {
		border-left: 2px solid ${({ theme }) => theme.color.gray[9]};
		border-right: 2px solid ${({ theme }) => theme.color.gray[9]};
		margin-bottom: 2px;
	}
	& > :nth-child(3) {
		border-right: 2px solid ${({ theme }) => theme.color.gray[9]};
		& > svg {
			fill: #1da1f2;
		}
	}
	& > :nth-child(4) {
		& > svg {
			fill: #4267b2;
		}
	}
`;

export const StyledAuthAgreement = styled.span`
	height: 70px;
	width: 100%;
	margin-top: 15px;
	color: ${({ theme }) => theme.color.gray[6]};
	font-size: ${({ theme }) => theme.fontSize[14]};
	font-weight: ${({ theme }) => theme.fontWeight[400]};
	text-align: center;
	line-height: 24px;
`;

export const AuthSelect = styled.select`
	height: 44px;
	width: 100%;
	border: 1px solid ${({ theme }) => theme.color.gray[8]};
	border-radius: 10px;
	padding: 0 30px 0 15px;
	font-size: ${({ theme }) => theme.fontSize[16]};
	font-weight: ${({ theme }) => theme.fontWeight[400]};
	&:focus {
		outline: none;
		border: 1px solid ${({ theme }) => theme.color.turquoise[4]};
	}
	&::placeholder {
		color: ${({ theme }) => theme.color.gray[8]};
	}
	::-ms-reveal {
		display: none;
	}
`;