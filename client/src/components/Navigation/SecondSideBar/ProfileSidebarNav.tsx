import Link from 'next/link';
import React, { FC } from 'react';
import styles from './ProfileSidebarNav.module.css';
import { sidebarNavItems } from './ProfileSideBarNavContent';

interface OverviewSidebarProps {
	activeSection: string | null;
	onSectionChange: (section: string) => void;
}
const OverviewSidebar: FC<OverviewSidebarProps> = ({
	activeSection,
	onSectionChange,
}) => {
	const handleSectionClick = (sectionId: string) => {
		// Smooth scroll to the clicked section
		const element = document.getElementById(sectionId);
		if (element) {
			const offsetTop = element.offsetTop - 120;
			window.scrollTo({ top: offsetTop, behavior: 'smooth' });
			// element.scrollIntoView({ behavior: 'smooth' });
		}
	};

	// export default function OverviewSidebar() {
	return (
		<div className={styles.Sidebar}>
			{sidebarNavItems.map((item) => (
				<div
					className={
						activeSection === item.id ? styles.NavItemActive : styles.NavItem
					}
					key={item.href}
				>
					<button
						// href={item.href}
						className={styles.NavItemText}
						onClick={() => handleSectionClick(item.id)}
					>
						{item.title}
					</button>
				</div>
			))}
		</div>
	);
};

export default OverviewSidebar;
