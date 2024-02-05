import { DefaultTheme } from 'styled-components';
import localFont from 'next/font/local';

const northwell = localFont({
	src: '../app/fonts/Northwell-Alt.woff2',
	display: 'swap',
});

export const mainTheme: DefaultTheme = {
	fontFamily: {
		northwell: northwell.style.fontFamily,
	},
	color: {
		gray: {
			1: '#2A2A2A',
			2: '#454545',
			3: '#5C5C5C',
			4: '#707070',
			5: '#878787',
			6: '#B2B2B2',
			7: '#C4C4C4',
			8: '#D5D5D5',
			9: '#F7F7F7',
			10: '#FFFFFF',
		},
		purple: {
			1: '#8520D0',
			2: '#876CD0',
			3: '#8769FF',
			4: '#C155F0',
			5: '#A50668',
			6: '#E180E4',
		},
		pink: {
			1: '#d95aff',
			2: '#ff00ff',
			3: '#F8E6FF',
			4: '#BC00CC77',
			5: '#EEB4FF',
			6: '#FFE6F9',
		},
		turquoise: {
			1: '#00b4d8',
			2: '#B5FAFF',
			3: '#05efff',
			4: '#00BFCC',
			5: '#01686F',
			6: '#D6FCFF',
		},
		blue: {
			1: '#1877F2',
		},
		green: {
			1: '#004b50',
			2: '#8BDFD0',
			3: '#23A236',
			4: '#14AC0F',
			5: '#439152',
			6: '#DCFFDB',
			7: '#27CC00',
		},
		red: {
			1: '#AD0000',
			2: '#FFDBDB',
			3: '#FF486B',
		},
		orange: {
			1: '#E6476F',
			2: '#FF6641',
			3: '#F78F28',
			4: '#FA5F5F',
			5: '#EB502A',
			6: '#F4CE00',
			7: '#FFF7DB',
			8: '#B88F00',
		},
	},
	fontSize: {
		8: '0.5rem',
		10: '0.625rem',
		12: '0.75rem',
		14: '0.875rem',
		16: '1rem',
		18: '1.125rem',
		20: '1.25rem',
		22: '1.375rem',
		24: '1.5rem',
		26: '1.625rem',
		28: '1.75rem',
		30: '1.875rem',
		32: '2rem',
		34: '2.125rem',
		36: '2.25rem',
		38: '2.375rem',
		40: '2.5rem',
		42: '2.625rem',
		44: '2.75rem',
		46: '2.875rem',
		48: '3rem',
		50: '3.125rem',
	},
	fontWeight: {
		100: '100',
		200: '200',
		300: '300',
		400: '400',
		500: '500',
		600: '600',
		700: '700',
		800: '800',
		900: '900',
	},
};