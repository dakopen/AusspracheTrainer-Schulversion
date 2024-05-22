import React, { useState, useEffect, useRef, useContext } from "react";
import "./SpeechSynthesis.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";

const SpeechSynthesis = ({ audioUrl }) => {
	const audioRef = useRef(null);
	const timelineRef = useRef(null);
	const synthTutorialRef = useRef(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [timelinePosition, setTimelinePosition] = useState(0);

	const switchFromTextToTimeline = () => {
		timelineRef.current.style.display = "inherit";
		synthTutorialRef.current.style.display = "none";
	};

	const toggleAudio = () => {
		const audio = audioRef.current;
		if (audio) {
			if (audio.paused) {
				switchFromTextToTimeline();
				audio.play();
				setIsPlaying(true);
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
			timelineRef.current.value = percentagePosition;
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
		const audio = audioRef.current;
		const source = document.getElementById("audio-source");
		if (audio && source) {
			source.src = audioUrl;
			audio.load();
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
				<source id="audio-source" src={audioUrl} type="audio/wav" />
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
