import styled from 'styled-components';
import { toast } from 'sonner';
import { BsFillCheckCircleFill } from 'react-icons/bs';

const ToastContainer = styled.div<{ type: ToastType }>`
	max-width: 380px;
	width: 350px;
	height: 80px;
	display: flex;
	gap: 10px;
	align-items: center;
	padding: 0 16px;
	border-radius: 8px;
	border: 1px solid;
	box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
	background: white;
`;

const ToastText = styled.div<{
	type: ToastType;
}>`
	color: ${({ theme, type }) =>
		type === ToastEnum.ERROR ? theme.color.red[3] : theme.color.turquoise[5]};
	font-size: ${({ theme }) => theme.fontSize[16]};
	font-weight: ${({ theme }) => theme.fontWeight[500]};
`;

const ToastCloseButton = styled.button`
	margin-left: auto;
	background-color: transparent;
	border: none;
	color: #a7a7a7;
	font-size: ${({ theme }) => theme.fontSize[28]};
	&:hover {
		opacity: 0.8;
		cursor: pointer;
	}
`;

export enum ToastEnum {
	SUCCESS = 'success',
	ERROR = 'error',
	WARNING = 'warning',
	INFO = 'info',
}

type ToastType = ToastEnum;

interface ToastProps {
	title: string;
	description: string;
	type: ToastType;
}

export const showToast = ({ title, description, type }: ToastProps) => {
	toast.custom((t) => (
		<ToastContainer type={type}>
			<ToastText type={type}>
				<h1 className='font-semibold'>{title}</h1>
				<p>{description}</p>
			</ToastText>
		</ToastContainer>
	));
};
