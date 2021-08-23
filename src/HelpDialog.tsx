import React, { memo } from 'react';
import styles from './HelpDialog.module.css';

interface IProps {
	onClose: () => void;
}

export const HelpDialog = memo<IProps>(({ onClose }) => {
	return (
		<section className={styles.root}>
			<button className={styles.shield} onClick={onClose} />

			<div className={styles.body}>
				<h1 className={styles.title}>About</h1>
				<button className={styles.close} onClick={onClose}>
					&times;
				</button>

				<p>This app can help you keep your camera rotated identically across multiple teardowns.</p>

				<p>For best results, save this as a homescreen app.</p>

				<p>
					<strong>Preferred workflow</strong>
					<ol>
						<li>Upload an image from your last of imaging as the background</li>
						<li>Upload a test image (likely a shorter exposure) as the foreground</li>
						<li>Adjust the rotation slider so that the foreground perfectly overlaps the background</li>
						<li>Rotate your camera as described (e.g. "Rotate camera 3.5&deg; CW")</li>
					</ol>
					Optionally...
					<ul>
						<li>Drag the foreground to pan</li>
						<li>Adjust the Zoom, FG Opacity, and FG Contrast sliders</li>
						<li>Press and hold the Blink button to hide the foreground image</li>
					</ul>
				</p>

				<p>
					<strong>Privacy</strong>
					<br />
					<br />
					Note that all image uploads remain local and are not sent to any server.
				</p>
			</div>
		</section>
	);
});
