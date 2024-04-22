import React, { useRef, useEffect, useContext, useState } from 'react';
import { useAudioRecording } from '../context/AudioRecordingContext';
import "./AudioVisualizer.css";


const AudioVisualizer = () => {
    const { isRecording, audioContext, recordingState, source, audioBlob, starttimeRecording, endtimeRecording } = useAudioRecording(); // Get necessary items from context

    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const offscreenCanvasRef = useRef(null);
    const offscreenCtxRef = useRef(null);

    const offscreenXRef = useRef(0);
    const xRef = useRef(null);
    const yRef = useRef(null);
    const yMirroredRef = useRef(null);
    const pixelsPerSecondRef = useRef(null);
    const realPixelsPerSecondRef = useRef(null);
    const animationFrameIdRef = useRef(null);
    const recordedAudioRef = useRef(new Audio());
    const replayXRef = useRef(0);
    const justResumedRef = useRef(false);
    const isPlayingRef = useRef(false);
    const replayAnimationFrameIdRef = useRef(null);
    const lastTimestampRef = useRef(0);
    const replayButtonRef = useRef(null);
    const replayLineRef = useRef(null);


    let lastMeanFrequency = 0;
    let counter = 0;

    let analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;


    let bufferLength = analyser.frequencyBinCount;
    let dataArray = new Uint8Array(bufferLength);


    useEffect(() => {
        if (audioBlob) {
            console.log("audioBlob", audioBlob)
            recordedAudioRef.current.src = URL.createObjectURL(audioBlob);
            recordedAudioRef.current.onloadedmetadata = () => {
                const audioDuration = (endtimeRecording - starttimeRecording) / 1000;
                pixelsPerSecondRef.current = Math.min(offscreenCanvasRef.current.width, getResponsiveCanvasWidth()) / audioDuration;
                realPixelsPerSecondRef.current = offscreenCanvasRef.current.width / audioDuration;
            };

        }
    }, [audioBlob]);


    function clearAndAppendCanvas(parentSelector, newCanvas, classToRemove) {
        const parent = document.getElementById(parentSelector);
        const oldCanvases = parent.querySelectorAll(`.${classToRemove}`);
        oldCanvases.forEach(oldCanvas => parent.removeChild(oldCanvas));
        parent.appendChild(newCanvas);
    }

    function getResponsiveCanvasWidth() {
        // Use the lesser of the window's innerWidth or a max width (e.g., 800)
        return Math.min(window.outerWidth - 50, window.innerWidth - 50, 800);
    }

    useEffect(() => {
        console.log(recordingState, "recording state updated")
        console.log("offscreenX", offscreenXRef.current)
        if (recordingState === 0) {

            if (animationFrameIdRef.current) {
                cancelAnimationFrame(animationFrameIdRef.current);
            }
            initializeCanvasAndOffscreen();

        } else if (recordingState === 1) {

            initializeCanvasAndOffscreen();
            source.connect(analyser);
            animationFrameIdRef.current = requestAnimationFrame(draw)

        } else if (recordingState === 2) {

            if (animationFrameIdRef.current) {
                cancelAnimationFrame(animationFrameIdRef.current);
            }
            resizeOffscreenCanvas();
            console.log(canvasRef.current, offscreenCanvasRef.current, "CANVAS")
            if (canvasRef.current.parentNode && offscreenCanvasRef.current) {
                canvasRef.current.parentNode.replaceChild(offscreenCanvasRef.current, canvasRef.current);
                offscreenCanvasRef.current.id = canvasRef.current.id // keep the same id
                canvasRef.current = offscreenCanvasRef.current;

                offscreenCanvasRef.current.style.cssText = "left: 50%; transform: translateX(-50%); top: 0%";
            }
            resizeAndCopyCanvasContent();

            showReplayButtonAndReplayLine();
        }
    }, [recordingState]);

    function initializeCanvasAndOffscreen() {

        console.log('initializeCanvasAndOffscreen')

        canvasRef.current = document.createElement('canvas');
        canvasRef.current.width = getResponsiveCanvasWidth();
        canvasRef.current.height = 130;
        canvasRef.current.marginTop = '36px';
        canvasRef.current.classList.add('canvas-visualizer');

        clearAndAppendCanvas('canvas-parent-container', canvasRef.current, 'canvas-visualizer');
        ctxRef.current = canvasRef.current.getContext('2d', { willReadFrequently: true });
        ctxRef.current.strokeStyle = 'var(--lila)';
        ctxRef.current.lineWidth = 1.3;


        const previousOffscreenCanvas = document.querySelector('.offscreen-canvas-class');
        if (previousOffscreenCanvas) {
            previousOffscreenCanvas.remove();
        }

        offscreenCanvasRef.current = document.createElement('canvas');
        offscreenCtxRef.current = offscreenCanvasRef.current.getContext('2d', { willReadFrequently: true });
        offscreenCtxRef.current.strokeStyle = 'var(--lila)';
        offscreenCtxRef.current.lineWidth = 1.3;


        offscreenCanvasRef.current.width = 30000;  // more than enough
        offscreenCanvasRef.current.height = canvasRef.current.height;
        offscreenCanvasRef.current.className = 'offscreen-canvas-class';

        offscreenXRef.current = 0;
        xRef.current = getResponsiveCanvasWidth() / 2 - document.getElementById("recording-button").offsetWidth / 2;
    }

    const draw = () => {
        if (!isRecording) return;
        let width = getResponsiveCanvasWidth();
        const imageData = ctxRef.current.getImageData(0, 0, width, canvasRef.current.height);
        ctxRef.current.clearRect(0, 0, width, canvasRef.current.height);
        ctxRef.current.putImageData(imageData, -1, 0);

        analyser.getByteFrequencyData(dataArray);
        const meanFrequency = dataArray.reduce((a, b) => a + b) / bufferLength;

        const smoothFrequency = (lastMeanFrequency + meanFrequency) / 2;

        if (counter <= 1) {
            const yHeight = Math.max((smoothFrequency / 64) * canvasRef.current.height / 2, 1);
            yRef.current = (canvasRef.current.height / 2) - yHeight;
            yMirroredRef.current = (canvasRef.current.height / 2) + yHeight;


            ctxRef.current.beginPath();
            ctxRef.current.moveTo(xRef.current, yRef.current);
            ctxRef.current.lineTo(xRef.current, yMirroredRef.current);

            ctxRef.current.stroke();

            // draw on offscreen canvas
            offscreenCtxRef.current.beginPath();
            offscreenCtxRef.current.moveTo(offscreenXRef.current, yRef.current);
            offscreenCtxRef.current.lineTo(offscreenXRef.current, yMirroredRef.current);
            offscreenCtxRef.current.stroke();
            offscreenXRef.current += 4;
        } else if (counter <= 3) {
            // GAP
        } else {
            counter = 0;
        }
        counter++;
        lastMeanFrequency = meanFrequency;
        animationFrameIdRef.current = requestAnimationFrame(draw);

    };


    const resizeOffscreenCanvas = () => {
        const tempCanvas = document.createElement("canvas");
        const tempCtx = tempCanvas.getContext("2d", { willReadFrequently: true });

        // Set the temporary canvas dimensions to match the offscreen canvas
        tempCanvas.width = offscreenCanvasRef.current.width;
        tempCanvas.height = offscreenCanvasRef.current.height;

        // Copy the current content of the offscreen canvas to the temporary canvas
        tempCtx.drawImage(offscreenCanvasRef.current, 0, 0);

        // Resize the offscreen canvas to fit the actual used width
        offscreenCanvasRef.current.width = offscreenXRef.current;

        // Draw the content back from the temporary canvas to the resized offscreen canvas
        offscreenCtxRef.current.drawImage(tempCanvas, 0, 0);
    };

    const resizeAndCopyCanvasContent = () => {

        const maxWidth = getResponsiveCanvasWidth();
        const aspectRatio = offscreenCanvasRef.current.width / offscreenCanvasRef.current.height;
        const newWidth = Math.min(maxWidth, offscreenXRef.current);
        const newHeight = newWidth / aspectRatio;
        console.log(newWidth, newHeight, aspectRatio, "NEW")
        // create a temporary canvas to hold current content
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = offscreenCanvasRef.current.width; // original dimensions
        tempCanvas.height = offscreenCanvasRef.current.height;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.drawImage(offscreenCanvasRef.current, 0, 0); // copy content

        // resize offscreen canvas
        offscreenCanvasRef.current.width = newWidth;
        offscreenCanvasRef.current.height = newHeight;

        // copy content back to the resized offscreen canvas
        offscreenCtxRef.current.drawImage(tempCanvas, 0, 0, newWidth, newHeight);
    }

    const moveReplayLine = (timestamp) => {
        if (!lastTimestampRef.current || justResumedRef.current) {
            lastTimestampRef.current = timestamp;
            justResumedRef.current = false;
        }

        const deltaTime = (timestamp - lastTimestampRef.current) / 1000;
        lastTimestampRef.current = timestamp;

        replayXRef.current += pixelsPerSecondRef.current * deltaTime * 2;
        replayControl.updateReplayLinePosition();

        if (replayXRef.current * 1 / 2 < (Math.min(offscreenCanvasRef.current.width, getResponsiveCanvasWidth()) - 2)) {
            replayAnimationFrameIdRef.current = requestAnimationFrame(moveReplayLine);
        } else {
            replayControl.stop();
        }
    }

    const replayControl = {
        start() {
            recordedAudioRef.current.play();
            isPlayingRef.current = true;
            replayButtonRef.current.style.backgroundColor = "var(--lila)";
            justResumedRef.current = true;
            replayAnimationFrameIdRef.current = requestAnimationFrame(moveReplayLine);
        },
        pause() {
            recordedAudioRef.current.pause();
            isPlayingRef.current = false;
            cancelAnimationFrame(replayAnimationFrameIdRef.current);
            replayButtonRef.current.style.backgroundColor = "var(--black)";
        },
        stop() {
            recordedAudioRef.current.pause();
            recordedAudioRef.current.currentTime = 0;
            isPlayingRef.current = false;
            replayButtonRef.current.style.backgroundColor = "var(--black)";
            cancelAnimationFrame(replayAnimationFrameIdRef.current);
            replayXRef.current = 0;
            lastTimestampRef.current = 0;
            this.updateReplayLinePosition();
        },

        updateReplayLinePosition() {
            replayLineRef.current.style.marginRight = `${Math.min(offscreenCanvasRef.current.width, getResponsiveCanvasWidth()) - replayXRef.current - 2}px`;
        }
    }


    useEffect(() => {
        if (replayButtonRef.current) {
            const replayButton = replayButtonRef.current;

            const handleReplayButtonClick = () => {
                if (isPlayingRef.current) {
                    replayControl.pause();
                } else {
                    replayControl.start();
                }
            };

            replayButton.addEventListener('click', handleReplayButtonClick);

            return () => {
                replayButton.removeEventListener('click', handleReplayButtonClick);
            };
        }
    }, []);


    const showReplayButtonAndReplayLine = () => {
        replayButtonRef.current.style.display = "block";
        replayButtonRef.current.style.marginRight = (Math.min(offscreenCanvasRef.current.width, getResponsiveCanvasWidth()) + 20) + "px";
        replayLineRef.current.style.display = "block";
        replayControl.updateReplayLinePosition();
    }

    return (
        <div id="canvas-parent-container">
            <canvas className="canvas-visualizer" ref={canvasRef} width="800" height="200"></canvas>

            <button id="replay-button" ref={replayButtonRef}></button>
            <div id="replay-line" ref={replayLineRef}></div>
            {/*
            {recordingState === 2 && (
                <>
                    <button id="replay-button" ref={replayButtonRef} style={{ marginRight: Math.min(offscreenCanvasRef.current.width, getResponsiveCanvasWidth()) + "px" }}></button>
                    <div id="replay-line" ref={replayLineRef}></div>
                </>
            )
            }
            */}
        </div>
    );

};

export default AudioVisualizer;