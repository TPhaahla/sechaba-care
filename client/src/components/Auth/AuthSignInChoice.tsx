import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { signIn } from 'next-auth/react';
// import CustomerSignInIcon from '/public/images/Frame.svg';
// import MerchantSignInIcon from '/public/images/Frame3015.svg';
import DoctorSignInIcon from 'public/Doctors.svg';
import PharmacySignInIcon from 'public/MedicineTabletsAuth.svg';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import styles from './AuthSignInChoice.module.css';

const AuthSignInChoice = () => {
	const router = useRouter();
	return (
		<div className={styles.MainBody}>
			<div className={styles.AuthBody}>
				<div className={styles.AuthChoice1}>
					<Link href='/auth/doctor'>
						<div className={styles.AuthChoiceImage}>
							<Image src={DoctorSignInIcon} alt='logo' fill />
						</div>

						<p className={styles.AuthChoiceText}>Medical Practice Interface</p>
					</Link>
				</div>
				<div
					className={styles.AuthChoice2}
					// onClick={() => router.push('/pharmacy')}
				>
					<Link href='/auth/pharmacy'>
						<div className={styles.AuthChoiceImage}>
							<Image src={PharmacySignInIcon} alt='logo' fill />
						</div>
						<p className={styles.AuthChoiceText1}>Pharmacy Interface</p>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default AuthSignInChoice;
