import React, { useState } from 'react';
import logo from './logo.svg';
import styles from './App.module.css';
import { SelectImages } from './SelectImages';

const App = () => {
	const [image1Src, setImage1Src] = useState('');
	const [image2Src, setImage2Src] = useState('');

	const [showSelectImages, setShowSelectImages] = useState(false);

	return (
		<div className={styles.root}>
			<div className={styles.stageWrapper}>
				<div className={styles.stageSquare}>
					<div className={styles.stage}>
						{image1Src && (
							<img alt="Background" className={styles.bg} src={image1Src} />
						)}
						{image2Src && (
							<img alt="Foreground" className={styles.fg} src={image1Src} />
						)}
					</div>
				</div>
			</div>
			<div className={styles.controls}>
				<button onClick={() => { setShowSelectImages(true); }}>
					Select images
				</button>
			</div>

			{showSelectImages && (
				<SelectImages
					image1Src={image1Src}
					image2Src={image2Src}
					onClose={() => { setShowSelectImages(false); }}
					onImage1SrcChange={setImage1Src}
					onImage2SrcChange={setImage2Src}
				/>
			)}
		</div>
	);
}

export default App;
