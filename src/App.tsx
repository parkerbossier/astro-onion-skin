import c from 'classnames';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useGesture } from 'react-use-gesture';
import styles from './App.module.css';
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

	const [fgImageContrast, setFgImageContrast] = useState(defaultFgProps.contrast);
	const [fgImageLeft, setFgImageLeft] = useState(defaultFgProps.left);
	const [fgImageOpacity, setFgImageOpacity] = useState(defaultFgProps.opacity);
	const [fgImageRotation, setFgImageRotation] = useState(defaultFgProps.rotation);
	const [fgImageScale, setFgImageScale] = useState(defaultFgProps.scale);
	const [fgImageSrc, setFgImageSrc] = useState('');
	const [fgImageTop, setFgImageTop] = useState(defaultFgProps.top);

	// #region blink

	const [blink, setBlink] = useState(false);
	const [showFgImage, setShowFgImage] = useState(true);
	useEffect(() => {
		return;

		if (!blink) return;

		const interval = setInterval(() => {
			setShowFgImage(s => !s);
		}, 100);
		return () => {
			clearInterval(interval);
			setShowFgImage(true);
		};
	}, [blink]);

	// #endregion blink

	// #region stage

	const gestureStartData = useRef({ left: 0, rotation: 0, top: 0 });
	const onGestureStart = () => {
		gestureStartData.current = {
			left: fgImageLeft,
			rotation: fgImageRotation,
			top: fgImageTop
		};
	};

	const fgRef = useRef<HTMLImageElement>(null);

	useGesture(
		{
			onDragStart: onGestureStart,
			onDrag: state => {
				setFgImageLeft(gestureStartData.current.left + state.movement[0] / 4);
				setFgImageTop(gestureStartData.current.top + state.movement[1] / 4);
			},
			onPinchStart: onGestureStart,
			onPinch: state => {
				setFgImageRotation(gestureStartData.current.rotation + state.movement[1]);
			}
		},
		{
			enabled: true,
			drag: {
				useTouch: true
			},
			pinch: {
				enabled: true
			},
			domTarget: fgRef.current ?? undefined
		}
	);

	// allows proper pinch support
	useEffect(() => {
		document.addEventListener('gesturestart', preventDefault);
		document.addEventListener('gesturechange', preventDefault);
		//document.addEventListener('scroll', preventDefault);

		document.body.addEventListener('touchmove', e => {
			e.preventDefault();
		});

		return () => {
			document.removeEventListener('gesturestart', preventDefault);
			document.removeEventListener('gesturechange', preventDefault);
			//document.removeEventListener('scroll', preventDefault);
		};
	}, []);

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

			<div className={styles.stageSquare}>
				<div className={styles.stage} style={stageStyles}>
					{bgImageSrc && <img alt="Background" className={styles.stage_bg} src={bgImageSrc} />}
					{fgImageSrc && (
						<img
							alt="Foreground"
							className={styles.stage_fg}
							onContextMenu={e => {
								e.preventDefault();
							}}
							ref={fgRef}
							src={fgImageSrc}
							style={fgImageStyles}
						/>
					)}

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

			<div className={styles.controls}>
				<div className={styles.controls_inner}>
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
							className={c(styles.blink, blink && styles.blink__active)}
							onContextMenu={e => {
								e.preventDefault();
							}}
							onTouchEnd={() => {
								setBlink(false);
							}}
							onTouchStart={() => {
								setBlink(true);
							}}
						>
							Blink
						</button>
					</div>

					<div className={c(styles.card, styles.card__slider)}>
						<div className={styles.card_title}>
							FG Rotation
							<div className={styles.card_subtitle}>
								Rotate camera {Math.abs(fgImageRotation).toFixed(1)}
								&deg;&nbsp;
								{fgImageRotation < 0 ? 'CCW' : 'CW'}
							</div>
						</div>

						<input
							className={styles.slider}
							max={45}
							min={-45}
							onChange={e => {
								setFgImageRotation(parseFloat(e.currentTarget.value));
							}}
							step={0.25}
							type="range"
							value={fgImageRotation}
						/>
					</div>

					<div className={c(styles.card, styles.card__slider)}>
						<div className={styles.card_title}>Zoom</div>

						<input
							className={styles.slider}
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

					<div className={c(styles.card, styles.card__slider)}>
						<div className={styles.card_title}>FG Opacity</div>

						<input
							className={styles.slider}
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

					<div className={c(styles.card, styles.card__slider)}>
						<div className={styles.card_title}>FG Contrast</div>

						<input
							className={styles.slider}
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

					<button
						className={c(styles.card, styles.card__button)}
						onClick={() => {
							setFgImageContrast(defaultFgProps.contrast);
							setFgImageLeft(defaultFgProps.left);
							setFgImageOpacity(defaultFgProps.opacity);
							setFgImageRotation(defaultFgProps.rotation);
							setFgImageScale(defaultFgProps.scale);
							setFgImageTop(defaultFgProps.top);
						}}
					>
						Reset
					</button>
				</div>
			</div>
		</div>
	);
};

function preventDefault(e: Event) {
	e.preventDefault();
}

export default App;
