import c from 'classnames';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useGesture } from 'react-use-gesture';
import styles from './App.module.css';
import { HelpDialog } from './HelpDialog';
import { ImageInput } from './ImageInput';
import demoBgUrl from './img/bg.jpg';
import demoFgUrl from './img/fg.jpg';

const defaultFgProps = {
	contrast: 2,
	left: 0,
	opacity: 0.5,
	rotation: 0,
	scale: 1,
	top: 0
};

const App = () => {
	const [bgImageSrc, setBgImageSrc] = useState('');
	const [blink, setBlink] = useState(false);
	const [fgImageContrast, setFgImageContrast] = useState(defaultFgProps.contrast);
	const [fgImageLeft, setFgImageLeft] = useState(defaultFgProps.left);
	const [fgImageOpacity, setFgImageOpacity] = useState(defaultFgProps.opacity);
	const [fgImageScale, setFgImageScale] = useState(defaultFgProps.scale);
	const [fgImageSrc, setFgImageSrc] = useState('');
	const [fgImageTop, setFgImageTop] = useState(defaultFgProps.top);

	const [fgImageRotation, setFgImageRotation] = useState(defaultFgProps.rotation);
	const [fgImageRotationOffset, setFgImageRotationOffset] = useState(0);
	const fgIncrementRotation = (direction: 'cw' | 'ccw') => {
		const increment = direction === 'cw' ? 45 : -45;
		const newOffset = (fgImageRotationOffset + increment) % 360;
		setFgImageRotation(newOffset);
		setFgImageRotationOffset(newOffset);
	};

	const [showHelp, setShowHelp] = useState(false);
	const closeHelp = useCallback(() => {
		setShowHelp(false);
	}, []);

	const imagesSelected = bgImageSrc && fgImageSrc;

	// #region stage

	const gestureStartData = useRef({ left: 0, top: 0 });
	const onGestureStart = () => {
		gestureStartData.current = {
			left: fgImageLeft,
			top: fgImageTop
		};
	};

	const fgImageBind = useGesture(
		{
			onDragStart: onGestureStart,
			onDrag: state => {
				setFgImageLeft(gestureStartData.current.left + state.movement[0] / 4);
				setFgImageTop(gestureStartData.current.top + state.movement[1] / 4);
			}
		},
		{
			enabled: true,
			drag: {
				useTouch: true
			}
		}
	);

	const stageStyles = useMemo(
		() => ({
			transform: `scale(${fgImageScale})`
		}),
		[fgImageScale]
	);
	const fgImageStyles = useMemo(
		() => ({
			filter: `contrast(${fgImageContrast})`,
			left: `${fgImageLeft}px`,
			opacity: blink ? 0 : fgImageOpacity,
			top: `${fgImageTop}px`,
			transform: `rotate(${fgImageRotation}deg)`
		}),
		[blink, fgImageContrast, fgImageLeft, fgImageOpacity, fgImageRotation, fgImageTop]
	);

	// #endregion stage

	return (
		<div className={styles.root}>
			<h1 className={styles.title}>astro-onion-skin</h1>

			{/* stage */}
			<div className={styles.stage}>
				<div className={styles.stage_inner} style={stageStyles}>
					{/* images */}
					{bgImageSrc && <img alt="Background" className={styles.stage_bg} src={bgImageSrc} />}
					{fgImageSrc && (
						<img
							alt="Foreground"
							className={styles.stage_fg}
							onContextMenu={e => {
								e.preventDefault();
							}}
							src={fgImageSrc}
							style={fgImageStyles}
							{...fgImageBind()}
						/>
					)}

					{/* empty */}
					{!bgImageSrc && !fgImageSrc && (
						<p className={styles.stage_empty}>
							Select images below,
							<br />
							or{' '}
							<button
								className={styles.stage_empty_button}
								onClick={() => {
									setBgImageSrc(demoBgUrl);
									setFgImageSrc(demoFgUrl);
								}}
							>
								load demo images
							</button>
						</p>
					)}
				</div>
			</div>

			{/* controls */}
			<div className={styles.controls}>
				<div className={styles.controls_inner}>
					<div className={styles.controls_imagesRow}>
						{/* images */}
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
						</div>

						{/* blink */}
						<div className={styles.card}>
							<div className={styles.card_title}>Blink</div>

							<button
								className={c(styles.blink, blink && styles.blink__active)}
								disabled={!imagesSelected}
								onContextMenu={e => {
									e.preventDefault();
								}}
								onTouchEnd={() => {
									setBlink(false);
								}}
								onTouchStart={() => {
									if (imagesSelected) setBlink(true);
								}}
							>
								Blink
							</button>
						</div>
					</div>

					{/* rotation */}
					<div className={c(styles.card, styles.card__slider)}>
						<div className={styles.card_title}>
							<div id="sliderlabel_rotation">FG Rotation</div>

							<div className={styles.card_subtitle}>
								Rotate camera {Math.abs(fgImageRotation).toFixed(1)}
								&deg;&nbsp;
								{/* if the fg rotation is < 0, then the fg needs > 0 rotation to match the bg */}
								{fgImageRotation < 0 ? 'CW' : 'CCW'}
							</div>
						</div>

						<div className={styles.rotationInputGroup}>
							<button
								disabled={!imagesSelected}
								onClick={() => {
									fgIncrementRotation('ccw');
								}}
								title="Rotate FG 45° CCW"
							>
								&lt;
							</button>

							<input
								aria-labelledby="sliderlabel_rotation"
								className={styles.slider}
								disabled={!imagesSelected}
								max={fgImageRotationOffset + 45 / 2}
								min={fgImageRotationOffset - 45 / 2}
								onChange={e => {
									setFgImageRotation(parseFloat(e.currentTarget.value));
								}}
								step={0.25}
								type="range"
								value={fgImageRotation}
							/>

							<button
								disabled={!imagesSelected}
								onClick={() => {
									fgIncrementRotation('cw');
								}}
								title="Rotate FG 45°CW"
							>
								&gt;
							</button>
						</div>
					</div>

					{/* zoom */}
					<div className={c(styles.card, styles.card__slider)}>
						<div className={styles.card_title} id="sliderlabel_zoom">
							Zoom
						</div>

						<input
							aria-labelledby="sliderlabel_zoom"
							className={styles.slider}
							disabled={!imagesSelected}
							max={2}
							min={1}
							onChange={e => {
								setFgImageScale(parseFloat(e.currentTarget.value));
							}}
							step={0.01}
							type="range"
							value={fgImageScale}
						/>
					</div>

					{/* opacity */}
					<div className={c(styles.card, styles.card__slider)}>
						<div className={styles.card_title} id="sliderlabel_opacity">
							FG Opacity
						</div>

						<input
							aria-labelledby="sliderlabel_opacity"
							className={styles.slider}
							disabled={!imagesSelected}
							max={1}
							min={0}
							onChange={e => {
								setFgImageOpacity(parseFloat(e.currentTarget.value));
							}}
							step={0.01}
							type="range"
							value={fgImageOpacity}
						/>
					</div>

					{/* contrast */}
					<div className={c(styles.card, styles.card__slider)}>
						<div className={styles.card_title} id="sliderlabel_contrast">
							FG Contrast
						</div>

						<input
							aria-labelledby="sliderlabel_contrast"
							className={styles.slider}
							disabled={!imagesSelected}
							max={2}
							min={1}
							onChange={e => {
								setFgImageContrast(parseFloat(e.currentTarget.value));
							}}
							step={0.01}
							type="range"
							value={fgImageContrast}
						/>
					</div>

					<div className={styles.controls_aboutReset}>
						{/* help */}
						<button
							className={c(styles.card, styles.card__button)}
							onClick={() => {
								setShowHelp(true);
							}}
						>
							About
						</button>

						{/* reset */}
						<button
							className={c(styles.card, styles.card__button)}
							onClick={() => {
								setFgImageContrast(defaultFgProps.contrast);
								setFgImageLeft(defaultFgProps.left);
								setFgImageOpacity(defaultFgProps.opacity);
								setFgImageRotation(defaultFgProps.rotation);
								setFgImageRotationOffset(0);
								setFgImageScale(defaultFgProps.scale);
								setFgImageTop(defaultFgProps.top);
							}}
						>
							Reset
						</button>
					</div>
				</div>
			</div>

			{showHelp && <HelpDialog onClose={closeHelp} />}
		</div>
	);
};

export default App;
