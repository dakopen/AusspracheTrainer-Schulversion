import React, { useRef, useEffect, useContext } from 'react';
import { useAudioRecording } from '../context/AudioRecordingContext';

const AudioVisualizer = () => {
    const { isRecording, audioContext, analyser } = useAudioRecording(); // Get necessary items from context
    const canvasRef = useRef(null);
    const requestRef = useRef();

    // Canvas elements
    let canvas, ctx;
    let offscreenCanvas, offscreenCtx, offscreenX;
    let x, y, yMirrored;
    let pixelsPerSecond, realPixelsPerSecond;


    function createCanvas(width, height, marginTop = '36px', addClass = 'canvas-visualizer') {
        canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.style.marginTop = marginTop;
        canvas.classList.add(addClass);
        return canvas;
    }

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
        initializeCanvasAndOffscreen();
    }, []);

    function initializeCanvasAndOffscreen() {
        canvas = createCanvas(getResponsiveCanvasWidth(), 130);
        clearAndAppendCanvas('canvas-parent-container', canvas, 'canvas-visualizer');
        ctx = canvas.getContext('2d', { willReadFrequently: true });



        const previousOffscreenCanvas = document.querySelector('.offscreen-canvas-class');
        if (previousOffscreenCanvas) {
            previousOffscreenCanvas.remove();
        }

        offscreenCanvas = document.createElement('canvas');
        offscreenCtx = offscreenCanvas.getContext('2d', { willReadFrequently: true });
        offscreenCanvas.width = 30000;  // more than enough
        offscreenCanvas.height = canvas.height;
        offscreenCanvas.className = 'offscreen-canvas-class';

        offscreenX = 0;
        x = getResponsiveCanvasWidth() / 2 - document.getElementById("recording-button").offsetWidth / 2;
    }

    const draw = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        analyser.getByteFrequencyData(dataArray);

        ctx.fillStyle = 'rgb(0, 0, 0)';
        ctx.fillRect(0, 0, width, height);

        const barWidth = (width / bufferLength) * 2.5;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            const barHeight = dataArray[i] / 2;
            ctx.fillStyle = 'rgb(' + (barHeight + 100) + ', 50, 50)';
            ctx.fillRect(x, height - barHeight, barWidth, barHeight);
            x += barWidth + 1;
        }

        requestRef.current = requestAnimationFrame(draw);
    };

    useEffect(() => {
        if (isRecording) {
            initializeCanvasAndOffscreen();

            requestRef.current = requestAnimationFrame(draw);
        }
        return () => cancelAnimationFrame(requestRef.current);
    }, [isRecording]);

    return (
        <div id="canvas-parent-container">
            <canvas ref={canvasRef} width="800" height="200"></canvas>
        </div>
    );
};

export default AudioVisualizer;
