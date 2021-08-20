import React, { useState } from 'react';
import styles from './App.module.css';
import { ImageInput } from './ImageInput';
import { Stage } from './Stage';

const App = () => {
	const [bgImageSrc, setBgImageSrc] = useState('');

	const [fgImageLeft, setFgImageLeft] = useState(0);
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
				<div className={styles.card}>
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

					<button
						onClick={() => { setBlink(b => !b); }}
					>
						Blink
					</button>
				</div>

				<div className={styles.card}>
					<div className={styles.card_title}>Rotation</div>

					<input
						className={styles.rotation}
						max={45}
						min={-45}
						onChange={e => { setFgImageRotation(parseInt(e.currentTarget.value, 10)); }}
						step={.5}
						type="range"
						value={fgImageRotation}
					/>

					<button
						onClick={() => {
							setFgImageLeft(0);
							setFgImageRotation(0);
							setFgImageTop(0);
						}}
					>
						Reset
					</button>

					<div>
						Move camera {Math.abs(Math.round(fgImageRotation))}&deg;
						{fgImageRotation < 0 ? 'counterclockwise' : 'clockwise'}
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
