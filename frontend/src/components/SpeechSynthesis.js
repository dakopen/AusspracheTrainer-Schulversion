import React, { useState, useEffect, useRef } from "react";
import "./SpeechSynthesis.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";

const SpeechSynthesis = ({ audioUrl }) => {
	const audioRef = useRef(null);
	const timelineRef = useRef(null);
	const synthTutorialRef = useRef(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [timelinePosition, setTimelinePosition] = useState(0);
	const [loading, setLoading] = useState(true);

	const switchFromTextToTimeline = () => {
		timelineRef.current.style.display = "inherit";
		synthTutorialRef.current.style.display = "none";
	};

	const toggleAudio = () => {
		if (loading) return;
		const audio = audioRef.current;
		if (audio) {
			if (audio.paused) {
				switchFromTextToTimeline();
				audio.play().then(() => {
					setIsPlaying(true);
				}).catch((error) => {
					console.error("Failed to play the audio:", error);
				});
			} else {
				audio.pause();
				setIsPlaying(false);
			}
		}
	};

	const onTimeUpdate = () => {
		const audio = audioRef.current;
		if (audio) {
			const percentagePosition = (100 * audio.currentTime) / audio.duration;
			setTimelinePosition(percentagePosition);
			timelineRef.current.style.backgroundSize = `${percentagePosition}% 100%`;
		}
	};

	const changeSeek = (event) => {
		const audio = audioRef.current;
		const time = (event.target.value * audio.duration) / 100;
		audio.currentTime = time;
	};

	const handleInvalid = (event) => {
		event.preventDefault(); // prevents from showing browser hints
	};

	// refresh the audio source when the audioUrl changes
	useEffect(() => {
		setLoading(true);
		const audio = audioRef.current;
		if (audio) {
			audio.pause();
			audio.src = audioUrl; // directly set the src attribute
			audio.load();
			audio.oncanplaythrough = () => {
				setLoading(false);
				setIsPlaying(false);
			};
		}
	}, [audioUrl]);

	return (
		<div className="audio-player-container">
			<audio
				id="audio-player"
				style={{ display: "none" }}
				ref={audioRef}
				onEnded={() => setIsPlaying(false)}
				onTimeUpdate={onTimeUpdate}
			>
				Dein Browser unterstützt das Audioelement nicht.
			</audio>
			<div className="controls">
				<button className="player-button" onClick={toggleAudio}>
					<FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
				</button>
				<input
					type="range"
					className="timeline"
					max="100"
					value={timelinePosition}
					id="synth-timeline"
					onChange={changeSeek}
					ref={timelineRef}
					onInvalid={handleInvalid}
				/>
				<span id="synth-text" ref={synthTutorialRef}>
					← die korrekte Aussprache anhören
				</span>
			</div>
		</div>
	);
};

export default SpeechSynthesis;
