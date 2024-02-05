import { ThemeProvider } from 'styled-components';
import { SessionProvider } from 'next-auth/react';
import { mainTheme } from '@/themes/main.theme';
import StyledComponentsRegistry from './lib/registry';

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<SessionProvider>
			<StyledComponentsRegistry>
				<ThemeProvider theme={mainTheme}>{children}</ThemeProvider>
			</StyledComponentsRegistry>
		</SessionProvider>
	);
}
