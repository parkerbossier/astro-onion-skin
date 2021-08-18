import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { useGesture } from 'react-use-gesture';
import styles from './Stage.module.css';

interface IProps {
	bgImageSrc: string;
	fgImageRotation: number;
	fgImageSrc: string;
}

export const Stage = memo<IProps>(({
	bgImageSrc,
	fgImageRotation,
	fgImageSrc
}) => {
	const [fgRot, setFgRot] = useState(0);
	const [fgX, setFgX] = useState(0);
	const [fgY, setFgY] = useState(0);

	const gestureStartData = useRef({ left: fgX, rotation: fgRot, top: fgY });
	const onGestureStart = () => {
		gestureStartData.current = { left: fgX, rotation: fgRot, top: fgY };
	};

	const fgRef = useRef<HTMLImageElement>(null);

	useEffect(
		() => {
			document.addEventListener('gesturestart', e => e.preventDefault())
			document.addEventListener('gesturechange', e => e.preventDefault())
		},
		[]
	);

	const fgBind = useGesture(
		{
			onDragStart: onGestureStart,
			onDrag: state => {
				setFgX(gestureStartData.current.left + state.movement[0]);
				setFgY(gestureStartData.current.top + state.movement[1]);
			},
			onPinchStart: onGestureStart,
			onPinch: state => {
				//setFgX(gestureStartData.current.left + state.movement[0]);
				//setFgY(gestureStartData.current.top + state.movement[1]);

				setFgRot(gestureStartData.current.rotation + state.movement[1])
				console.log(state.da)
				console.log(state.movement)
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
			left: `${fgX}px`,
			top: `${fgY}px`,
			transform: `rotate(${fgImageRotation}deg)`
		}),
		[fgImageRotation, fgX, fgY]
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
