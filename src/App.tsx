import c from 'classnames';
import React, { useState } from 'react';
import styles from './App.module.css';
import { ImageInput } from './ImageInput';
import { Stage } from './Stage';

const App = () => {
	const [bgImageSrc, setBgImageSrc] = useState('');

	const [fgImageLeft, setFgImageLeft] = useState(0);
	const [fgImageOpacity, setFgImageOpacity] = useState(.5);
	const [fgImageRotation, setFgImageRotation] = useState(0);
	const [fgImageSrc, setFgImageSrc] = useState('');
	const [fgImageTop, setFgImageTop] = useState(0);

	const [blink, setBlink] = useState(false);

	return (
		<div className={styles.root}>
			<h1 className={styles.title}>astro-onion-skin</h1>

			<div className={styles.stageSquare}>
				<div className={styles.stage}>
					<Stage
						bgImageSrc={bgImageSrc}
						blink={blink}
						fgImageLeft={fgImageLeft}
						fgImageRotation={fgImageRotation}
						fgImageSrc={fgImageSrc}
						fgImageTop={fgImageTop}
						onChangeFgImageLeft={setFgImageLeft}
						onChangeFgImageRotation={setFgImageRotation}
						onChangeFgImageTop={setFgImageTop}
					/>
				</div>
			</div>

			<div className={styles.controls}>
				<div className={c(styles.card, styles.card__images)}>
					<div className={styles.card_title}>Images</div>

					<ImageInput
						className={styles.imageInput}
						imageSrc={bgImageSrc}
						onChange={setBgImageSrc}
						title="BG"
					/>
					<ImageInput
						className={styles.imageInput}
						imageSrc={fgImageSrc}
						onChange={setFgImageSrc}
						title="FG"
					/>
				</div>

				<div className={styles.card}>
					<div className={styles.card_title}>Blink</div>

					<button
						className={styles.blink}
						onClick={() => {
							setBlink(b => !b);
						}}
					>
						Blink
					</button>
				</div>

				<div className={c(styles.card, styles.card__rotation)}>
					<div className={styles.card_title}>Rotation</div>

					<input
						className={styles.rotation}
						max={45}
						min={-45}
						onChange={e => {
							setFgImageRotation(
								parseInt(e.currentTarget.value, 10)
							);
						}}
						step={0.5}
						type="range"
						value={fgImageRotation}
					/>

					<div>
						Move camera {Math.abs(Math.round(fgImageRotation))}&deg;
						{fgImageRotation < 0 ? 'counterclockwise' : 'clockwise'}
					</div>
				</div>

				<div className={c(styles.card, styles.card__opacity)}>
					<div className={styles.card_title}>Opacity</div>

					<input
						className={styles.opacity}
						max={1}
						min={0}
						onChange={e => {
							setFgImageOpacity(
								parseFloat(e.currentTarget.value)
							);
						}}
						step={0.01}
						type="range"
						value={fgImageOpacity}
					/>
				</div>

				<button
					onClick={() => {
						setFgImageLeft(0);
						setFgImageRotation(0);
						setFgImageTop(0);
					}}
				>
					Reset
				</button>
			</div>
		</div>
	);
};

export default App;
