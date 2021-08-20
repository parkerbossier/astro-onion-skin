import React, { useState } from 'react';
import styles from './App.module.css';
import { SelectImages } from './SelectImages';
import { Stage } from './Stage';

const App = () => {
	const [bgImageSrc, setBgImageSrc] = useState('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQYV2NgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII=');

	const [fgImageLeft, setFgImageLeft] = useState(0);
	const [fgImageRotation, setFgImageRotation] = useState(0);
	const [fgImageSrc, setFgImageSrc] = useState('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQYV2NgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII=');
	const [fgImageTop, setFgImageTop] = useState(0);

	const [blink, setBlink] = useState(false);

	const [showSelectImages, setShowSelectImages] = useState(false);

	return (
		<div className={styles.root}>
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
				<button onClick={() => { setShowSelectImages(true); }}>
					Select images
				</button>

				<br />

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

				<br />

				<div>
					Move camera {Math.abs(Math.round(fgImageRotation))}&deg;
					{fgImageRotation < 0 ? 'counterclockwise' : 'clockwise'}
				</div>

				<br />
				<button
					onClick={() => { setBlink(b => !b); }}
				>
					Blink
				</button>
			</div>

			{showSelectImages && (
				<SelectImages
					bgImageSrc={bgImageSrc}
					fgImageSrc={fgImageSrc}
					onClose={() => { setShowSelectImages(false); }}
					onImage1SrcChange={setBgImageSrc}
					onImage2SrcChange={setFgImageSrc}
				/>
			)}
		</div>
	);
}

export default App;
