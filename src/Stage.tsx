import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { useGesture } from 'react-use-gesture';
import styles from './Stage.module.css';

interface IProps {
	bgImageSrc: string;
	blink: boolean;
	fgImageLeft: number;
	fgImageRotation: number;
	fgImageTop: number;
	fgImageSrc: string;
	onChangeFgImageLeft: (v: number) => void;
	onChangeFgImageRotation: (v: number) => void;
	onChangeFgImageTop: (v: number) => void;
}

export const Stage = memo<IProps>(({
	bgImageSrc,
	blink,
	fgImageLeft,
	fgImageRotation,
	fgImageSrc,
	fgImageTop,
	onChangeFgImageLeft,
	onChangeFgImageRotation,
	onChangeFgImageTop
}) => {
	const gestureStartData = useRef({ left: 0, rotation: 0, top: 0 });
	const onGestureStart = () => {
		gestureStartData.current = { left: fgImageLeft, rotation: fgImageRotation, top: fgImageTop };
	};

	const fgRef = useRef<HTMLImageElement>(null);

	// allows proper pinch support
	useEffect(
		() => {
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
		},
		[]
	);

	const [showFgImage, setShowFgImage] = useState(true);
	useEffect(
		() => {
			if (!blink)
				return;

			const interval = setInterval(
				() => {
					setShowFgImage(s => !s);
				},
				200
			);
			return () => {
				clearInterval(interval);
				setShowFgImage(true);
			}
		},
		[blink]
	);

	useGesture(
		{
			onDragStart: onGestureStart,
			onDrag: state => {
				onChangeFgImageLeft(gestureStartData.current.left + state.movement[0] / 4);
				onChangeFgImageTop(gestureStartData.current.top + state.movement[1] / 4);
			},
			onPinchStart: onGestureStart,
			onPinch: state => {
				onChangeFgImageRotation(gestureStartData.current.rotation + state.movement[1])
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

	const fgStyles = useMemo(
		() => ({
			left: `${fgImageLeft}px`,
			opacity: showFgImage ? .5 : 0,
			top: `${fgImageTop}px`,
			transform: `rotate(${fgImageRotation}deg)`
		}),
		[fgImageLeft, fgImageRotation, fgImageTop, showFgImage]
	);

	return (
		<div className={styles.root}>
			{bgImageSrc && (
				<img alt="Background" className={styles.bg} src={bgImageSrc} />
			)}
			{fgImageSrc && (
				<img
					alt="Foreground"
					className={styles.fg}
					onContextMenu={e => { e.preventDefault(); }}
					ref={fgRef}
					src={fgImageSrc}
					style={fgStyles}
				/>
			)}

			{!bgImageSrc && !fgImageSrc && (
				<p className={styles.empty}>
					Select images below
				</p>
			)}
		</div>
	);
});

function preventDefault(e: Event) {
	e.preventDefault();
};
