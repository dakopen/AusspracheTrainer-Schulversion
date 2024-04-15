import React, { useState, useEffect, useRef, useContext } from "react";
import "./SpeechSynthesis.css"; // Assuming styles are moved to a separate CSS file

const SpeechSynthesis = ({ audioUrl }) => {
	const audioRef = useRef(null);
	const timelineRef = useRef(null);
	const synthTutorialRef = useRef(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [timelinePosition, setTimelinePosition] = useState(0);

	const playIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#AA6BFD">
      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
    </svg>
  `;
	const pauseIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#AA6BFD">
      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
    </svg>
  `;
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
			const percentagePosition =
				(100 * audio.currentTime) / audio.duration;
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
				<button
					className="player-button"
					onClick={toggleAudio}
					dangerouslySetInnerHTML={{
						__html: isPlaying ? pauseIcon : playIcon,
					}}
				></button>
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

// IDEA: the audioUrl is created when the sentences are set in the database
// this way they do not have to be auto-generated every time a user wants
// to hear the correct pronunciation (still in progress -> TODO)
