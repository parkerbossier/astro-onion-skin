import React, { memo, useEffect, useMemo, useRef } from 'react';
import { useGesture } from 'react-use-gesture';
import { WebKitGestureEvent } from 'react-use-gesture/dist/types';
import styles from './Stage.module.css';

interface IProps {
	bgImageSrc: string;
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
			document.addEventListener('scroll', preventDefault);

			return () => {
				document.removeEventListener('gesturestart', preventDefault);
				document.removeEventListener('gesturechange', preventDefault);
				document.removeEventListener('scroll', preventDefault);
			};
		},
		[]
	);

	useGesture(
		{
			onDragStart: onGestureStart,
			onDrag: state => {
				onChangeFgImageLeft(gestureStartData.current.left + state.movement[0]);
				onChangeFgImageTop(gestureStartData.current.top + state.movement[1]);
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
			domTarget: fgRef
		}
	);

	const fgStyles = useMemo(
		() => ({
			left: `${fgImageLeft}px`,
			top: `${fgImageTop}px`,
			transform: `rotate(${fgImageRotation}deg)`
		}),
		[fgImageLeft, fgImageRotation, fgImageTop]
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
					Tap "Select images" below to upload images
				</p>
			)}
		</div>
	);
});

function preventDefault(e: Event) {
	e.preventDefault();
};
