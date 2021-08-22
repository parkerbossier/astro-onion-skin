import c from 'classnames';
import React, { memo } from 'react';
import styles from './ImageInput.module.css';

interface IProps {
	className?: string;
	imageSrc: string;
	onChange: (base64: string) => void;
	title: string;
}

export const ImageInput = memo<IProps>(({
	className,
	imageSrc,
	onChange,
	title
}) => {
	return (
		<label
			className={c(styles.root, imageSrc && styles.root__selected, className)}
			style={{ backgroundImage: imageSrc ? `url(${imageSrc})` : undefined }}
		>
			<input
				className={styles.input}
				onChange={e => {
					const file = e.currentTarget.files?.[0]!;
					const reader = new FileReader();
					reader.onloadend = () => {
						const base64String = (reader.result as string);
						onChange(base64String);
					};
					reader.readAsDataURL(file);
				}}
				type="file"
			/>

			<div className={styles.title}>{title}</div>

			{!imageSrc && (
				<div className={styles.plus}>+</div>
			)}
		</label>
	);
});
