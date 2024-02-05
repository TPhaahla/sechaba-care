import { FC, MouseEventHandler } from 'react';
import styled, { css } from 'styled-components';

export enum Size {
	SMALL = 'SMALL',
	MEDIUM = 'MEDIUM',
	LARGE = 'LARGE',
	FULL = 'FULL',
	FULLWITHSMALLFONT = 'FULLWITHSMALLFONT',
}

export enum ButtonState {
	NORMAL = 'NORMAL',
	DISABLED = 'DISABLED',
	LOADING = 'LOADING',
}

export enum ButtonVariant {
	FILLED = 'FILLED',
	OUTLINED = 'OUTLINED',
	TURQUOISE = 'TURQUOISE',
	TURQUOISE_GRADIENT = 'TURQUOISE_GRADIENT',
	WHITE = 'WHITE',
	RED_OUTLINED = 'RED_OUTLINED',
	RED_FILLED = 'RED_FILLED',
}

export interface ButtonMoleculeProps {
	type?: 'button' | 'reset' | 'submit' | undefined;
	text?: string;
	size?: Size;
	variant?: ButtonVariant;
	state?: ButtonState;
	leftIcon?: () => JSX.Element;
	rightIcon?: () => JSX.Element;
	onClick?: MouseEventHandler<HTMLButtonElement>;
	height?: string;
	width?: string;
	margin?: string;
}

export const LoadingLayer = styled.div`
	width: 100%;
	max-width: 80px;
	height: 50%;
	padding: 10px 0;
	display: flex;
	align-items: center;
	justify-content: center;
	background: radial-gradient(circle closest-side, #ffffff 90%, #0000) 0% 50%,
		radial-gradient(circle closest-side, #ffffff 90%, #0000) 50% 50%,
		radial-gradient(circle closest-side, #ffffff 90%, #0000) 100% 50%;
	background-size: calc(100% / 5) calc(100% / 2.5);
	background-repeat: no-repeat;
	animation: dots-7ar3yq 1s infinite linear;
	@keyframes dots-7ar3yq {
		20% {
			background-position: 0% 0%, 50% 50%, 100% 50%;
		}

		40% {
			background-position: 0% 100%, 50% 0%, 100% 50%;
		}

		60% {
			background-position: 0% 50%, 50% 100%, 100% 0%;
		}

		80% {
			background-position: 0% 50%, 50% 50%, 100% 100%;
		}
	}
`;

export const StyledButton = styled.button<ButtonMoleculeProps>`
	position: relative;
	flex: 1 1 auto;
	text-align: center;
	transition: 0.3s;
	background-size: 100% auto;
	color: white;
	border-radius: 7px;
	border: none;
	background-image: linear-gradient(129.16deg, #ff00ff 0%, #05efff 100%);
	font-size: 12px;
	font-weight: 500;
	font-family: 'Plus Jakarta Display', sans-serif;
	${({ size }) => (size === Size.SMALL ? 'height: 32px;' : null)};
	${({ size }) => (size === Size.MEDIUM ? 'height: 40px;' : null)};
	${({ size }) =>
		size === Size.LARGE ? 'height: 48px; max-width: 130px;' : null};
	${({ size }) =>
		size === Size.FULL
			? 'min-width: 100%; height:100%; max-height: 70px; font-size: 14px; border-radius: 10px;'
			: null};
	${({ size }) =>
		size === Size.FULLWITHSMALLFONT
			? 'min-width: 100%; height:100%; max-height: 70px; font-size: 12px; border-radius: 10px;'
			: null};
	width: ${({ width }) => (width ? width : '130px')};
	height: ${({ height }) => (height ? height : '50px')};
	margin: ${({ margin }) => (margin ? margin : '0')};
	&:hover {
		background-size: 500% auto;
		background-position: right center;
		scale: 1.03;
		transition: 0.3s;
		cursor: pointer;
	}
	&:disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}

	& > * {
		margin: 0 2px;
		color: ${({ theme }) => theme.color.gray[10]};
	}
	& > span {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		width: 100%;
		margin: 0 auto !important;
	}

	${({ variant }) =>
		variant === ButtonVariant.OUTLINED
			? buttonOutlined
			: variant === ButtonVariant.TURQUOISE
			? buttonTurquoise
			: variant === ButtonVariant.WHITE
			? buttonWhite
			: variant === ButtonVariant.RED_OUTLINED
			? buttonRedOutlined
			: variant === ButtonVariant.RED_FILLED
			? buttonRedFilled
			: variant === ButtonVariant.TURQUOISE_GRADIENT
			? buttonTurquoiseGradient
			: null}

	${({ state }) =>
		state === ButtonState.LOADING &&
		css`
			&:hover {
				scale: 1;
				transition: 0.3s;
				cursor: not-allowed;
			}
		`}
`;

const buttonOutlined = css<ButtonMoleculeProps>`
	transition: all 0.2s ease-in-out;
	border: solid 3px transparent;
	background-image: ${({ theme }) =>
		`linear-gradient(${theme.color.turquoise[3]} 0%,  ${theme.color.pink[1]} 100%),
    linear-gradient(248deg,  ${theme.color.turquoise[3]} 0%,  ${theme.color.pink[1]} 100%)`};
	background-origin: border-box;
	background-clip: content-box, border-box;
	-webkit-background-clip: content-box, border-box;
	box-shadow: 3px 1000px 1px ${({ theme }) => theme.color.gray[10]} inset;
	background-position: center;
	border-radius: 10px;
	width: ${({ width }) => (width ? width : '130px')};
	height: ${({ height }) => (height ? height : '50px')};
	& span {
		transition: all 0.2s ease-in-out;
		background-origin: border-box;
		background-clip: border-box;
		background: ${({ theme }) =>
			`transparent linear-gradient(108deg,  ${theme.color.gray[1]} 0%,  ${theme.color.gray[1]} 100%)
        0% 0% no-repeat padding-box;`};
		background-size: 100% auto;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}
	&:hover {
		@keyframes animatedgradient {
			0% {
				background-position: 0% 50%;
			}
			50% {
				background-position: 100% 50%;
			}
			100% {
				background-position: 0% 50%;
			}
		}
		animation: animatedgradient 3s ease infinite;
		& span {
			transition: all 0.2s ease-in-out;
			background-origin: border-box;
			background-clip: border-box;
			background: ${({ theme }) =>
				`transparent linear-gradient(108deg,  ${theme.color.pink[1]} 0%,  ${theme.color.pink[1]} 100%)
        0% 0% no-repeat padding-box;`};
			background-size: 100% auto;
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
		}
	}
	&:active {
		background-size: inherit;
		& span {
			background-size: inherit;
		}
	}
`;

const buttonTurquoise = css<ButtonMoleculeProps>`
	border-radius: 13px;
	border: none;
	background: ${({ theme }) => theme.color.turquoise[4]};
	font-size: ${({ theme }) => theme.fontSize[14]};
	color: ${({ theme }) => theme.color.gray[10]};
	transition: 0.3s;
	width: ${({ width }) => (width ? width : '130px')};
	height: ${({ height }) => (height ? height : '50px')};
	max-width: ${({ size, width }) =>
		size === Size.FULL ? '100%' : width ? width : null};
	max-height: ${({ size, height }) =>
		size === Size.FULL ? '100%' : height ? height : null};

	&:hover {
		transition: 0.3s;
		cursor: pointer;
		background-color: ${({ theme, state }) =>
			state !== ButtonState.LOADING && theme.color.turquoise[3]};
	}
	&:active {
		background-color: ${({ theme }) => theme.color.turquoise[5]};
	}
	&:focus {
		outline: none;
	}
`;
const buttonTurquoiseGradient = css<ButtonMoleculeProps>`
	border-radius: 13px;
	border: none;
	background: transparent linear-gradient(105deg, #00bfcc 0%, #05efff 100%) 0%
		0% no-repeat padding-box;
	font-size: ${({ theme }) => theme.fontSize[14]};
	color: ${({ theme }) => theme.color.gray[10]};
	transition: all 0.3s ease-in-out;
	width: ${({ width }) => (width ? width : '130px')};
	height: ${({ height }) => (height ? height : '50px')};
	max-width: ${({ size, width }) =>
		size === Size.FULL ? '100%' : width ? width : null};
	max-height: ${({ size, height }) =>
		size === Size.FULL ? '100%' : height ? height : null};

	&:hover {
		cursor: pointer;
		background-size: 200% auto;
		background-position: right center;
	}
	&:active {
		background-color: ${({ theme }) => theme.color.turquoise[5]};
	}
	&:focus {
		outline: none;
	}
`;

const buttonWhite = css<ButtonMoleculeProps>`
	border-radius: 13px;
	border: none;
	background: ${({ theme }) => theme.color.gray[10]};
	font-size: ${({ theme }) => theme.fontSize[14]};
	border: solid 3px ${({ theme }) => theme.color.turquoise[4]};
	transition: 0.3s;
	width: ${({ width }) => (width ? width : '130px')};
	height: ${({ height }) => (height ? height : '50px')};
	max-width: ${({ size, width }) =>
		size === Size.FULL ? '100%' : width ? width : null};
	max-height: ${({ size, height }) =>
		size === Size.FULL ? '100%' : height ? height : null};
	& > span {
		color: ${({ theme }) => theme.color.turquoise[4]};
		transition: 0.3s;
	}
	&:hover {
		transition: 0.3s;
		cursor: ${({ state }) =>
			state !== ButtonState.LOADING && state !== ButtonState.DISABLED
				? 'pointer'
				: 'not-allowed'};
		/* background-color: ${({ theme, state }) =>
			state !== ButtonState.LOADING && theme.color.turquoise[3]}; */
		border: solid 3px ${({ theme }) => theme.color.turquoise[3]};
		& > span {
			transition: 0.3s;
			color: ${({ theme }) => theme.color.turquoise[3]};
		}
	}
	&:active {
		background-color: ${({ theme }) => theme.color.turquoise[5]};
	}
	&:focus {
		outline: none;
	}
`;
const buttonRedOutlined = css<ButtonMoleculeProps>`
	border-radius: 13px;
	border: none;
	background: ${({ theme }) => theme.color.gray[10]};
	font-size: ${({ theme }) => theme.fontSize[14]};
	border: solid 3px #ff486b;
	transition: 0.3s;
	width: ${({ width }) => (width ? width : '130px')};
	height: ${({ height }) => (height ? height : '50px')};
	max-width: ${({ size, width }) =>
		size === Size.FULL ? '100%' : width ? width : null};
	max-height: ${({ size, height }) =>
		size === Size.FULL ? '100%' : height ? height : null};
	& > span {
		color: #ff486b;
		transition: 0.3s;
	}
	&:hover {
		transition: 0.3s;
		cursor: pointer;
		/* background-color: ${({ theme, state }) =>
			state !== ButtonState.LOADING && theme.color.turquoise[3]}; */
		border: solid 3px #ff4869c3;
		& > span {
			transition: 0.3s;
			color: #ff4869c3;
		}
	}
	&:active {
		background-color: ${({ theme }) => theme.color.turquoise[5]};
	}
	&:focus {
		outline: none;
	}
`;

const buttonRedFilled = css<ButtonMoleculeProps>`
	border-radius: 13px;
	border: none;
	background: #ff486b;
	font-size: ${({ theme }) => theme.fontSize[14]};
	color: ${({ theme }) => theme.color.gray[10]};
	transition: 0.3s;
	width: ${({ width }) => (width ? width : '130px')};
	height: ${({ height }) => (height ? height : '50px')};
	max-width: ${({ size, width }) =>
		size === Size.FULL ? '100%' : width ? width : null};
	max-height: ${({ size, height }) =>
		size === Size.FULL ? '100%' : height ? height : null};

	&:hover {
		transition: 0.3s;
		cursor: pointer;
		background-color: ${({ state }) =>
			state !== ButtonState.LOADING && '#ff4869c3'};
	}
	&:active {
		background-color: #ff486b;
	}
	&:focus {
		outline: none;
	}
`;
export const ButtonMolecule: FC<ButtonMoleculeProps> = ({
	text,
	type,
	size,
	variant,
	state,
	leftIcon,
	rightIcon,
	onClick,
	height,
	width,
	margin,
}) => {
	return (
		<StyledButton
			type={type}
			variant={variant ?? ButtonVariant.FILLED}
			size={size ?? Size.SMALL}
			disabled={state === ButtonState.DISABLED ? true : false}
			onClick={onClick}
			height={height ?? '50px'}
			width={width ?? '130px'}
			margin={margin ?? '0px'}
			state={state ?? ButtonState.NORMAL}
		>
			<span color='#fafafa'>
				{leftIcon && leftIcon()}
				{state === ButtonState.LOADING ? <LoadingLayer /> : <>{text}</>}
				{rightIcon && rightIcon()}
			</span>
		</StyledButton>
	);
};
