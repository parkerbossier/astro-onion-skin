import React, { ChangeEvent, memo, useMemo } from 'react';
import styles from './SelectImages.module.css';

interface IProps {
	image1Src: string;
	image2Src: string;
	onClose: () => void;
	onImage1SrcChange: (src: string) => void;
	onImage2SrcChange: (src: string) => void;
}

export const SelectImages = memo<IProps>(({
	image1Src,
	image2Src,
	onClose,
	onImage1SrcChange,
	onImage2SrcChange
}) => {
	const onImage1Change = useMemo(
		() => makeOnImageChange(onImage1SrcChange),
		[onImage1SrcChange]
	);
	const onImage2Change = useMemo(
		() => makeOnImageChange(onImage2SrcChange),
		[onImage2SrcChange]
	);

	return (
		<section className={styles.root}>
			<button className={styles.shield} onClick={onClose} />

			<div className={styles.dialog}>
				<div className={styles.inputRow}>
					<input onChange={onImage1Change} title="Background" type="file" />
					{image1Src && (
						<img alt="Background" className={styles.preview} src={image1Src} />
					)}
				</div>

				<div className={styles.inputRow}>
					<input onChange={onImage2Change} title="Foreground" type="file" />
					{image2Src && (
						<img alt="Foreground" className={styles.preview} src={image2Src} />
					)}
				</div>
			</div>
		</section>
	);
});

function makeOnImageChange(callback: (src: string) => void) {
	return (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.currentTarget.files?.[0];
		if (!file)
			return;

		const reader = new FileReader();
		reader.onloadend = () => {
			const base64String = (reader.result as string)
			// .replace('data:', '')
			// .replace(/^.+,/, '');
			callback(base64String);
		};
		reader.readAsDataURL(file);
	}
}
