import React, { useState } from 'react';
import logo from './logo.svg';
import styles from './App.module.css';
import { SelectImages } from './SelectImages';
import { Stage } from './Stage';

const App = () => {
	const [bgImageSrc, setBgImageSrc] = useState('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQYV2NgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII=');
	const [fgImageSrc, setFgImageSrc] = useState('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQYV2NgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII=');

	const [showSelectImages, setShowSelectImages] = useState(false);

	const [fgRotation, setFgRotation] = useState(0);

	return (
		<div className={styles.root}>
			<div className={styles.stageSquare}>
				<div className={styles.stage}>
					<Stage
						bgImageSrc={bgImageSrc}
						fgImageRotation={fgRotation}
						fgImageSrc={fgImageSrc}
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
					onChange={e => { setFgRotation(parseInt(e.currentTarget.value, 10)); }}
					step={.5}
					type="range"
					value={fgRotation}
				/>

				<button
					onClick={() => {
						setFgRotation(0);
					}}
				>
					Reset
				</button>

				<br />

				<div>
					Move camera {Math.abs(fgRotation)}&deg;
					{fgRotation < 0 ? 'counterclockwise' : 'clockwise'}
				</div>
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
