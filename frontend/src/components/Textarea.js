import React, { useState, useEffect, useRef } from "react";
import "./Textarea.css";
import { text } from "@fortawesome/fontawesome-svg-core";

const Textarea = ({ textareaValue }) => {
	const textareaRef = useRef(null);
	const [textareaWidth, setTextareaWidth] = useState("800px");
	const [textareaHeight, setTextareaHeight] = useState("30px");

	useEffect(() => {

		const windowResize = () => {
			const maxWidth =
				Math.min(
					window.outerWidth * 0.85,
					window.innerWidth * 0.85,
					800
				) + "px";
			textareaRef.current.style.maxWidth = maxWidth;

			resizeTextarea(); // Call resizeTextarea to adjust width and height
		};
		console.log(textareaRef.current.style.height, "resizeTextarea")

		// Initial resize

		windowResize();

		//windowResize();

		window.addEventListener("resize", windowResize);

		return () => window.removeEventListener("resize", windowResize);
	}, []);

	useEffect(() => {
		resizeTextarea();
	}, [textareaValue]);

	const resizeTextarea = () => {
		const textarea = textareaRef.current;
		if (!textarea) return; // Guard clause for safety

		const computedFontSize = window.getComputedStyle(textarea).fontSize;
		const fontAttr = `400 ${Math.max(
			Math.min(parseInt(computedFontSize) + 1, 50),
			30
		)}px Montserrat`;
		const textwidth = getTextWidth(textareaValue, fontAttr);

		const newWidth =
			Math.max(
				475,
				Math.min(
					textwidth + (parseInt(computedFontSize) + 1 - 36.8),
					window.outerWidth * 0.95,
					window.innerWidth * 0.95
				)
			) + "px";
		setTextareaWidth(newWidth);
		textarea.style.width = newWidth;
		textarea.style.height = "0px";
		textarea.style.height = textarea.scrollHeight + "px";

	};

	const getTextWidth = (text, font) => {
		const canvas = document.createElement("canvas");
		const context = canvas.getContext("2d");
		context.font = font;
		return context.measureText(text).width;
	};

	return (
		<textarea
			ref={textareaRef}
			id="textarea"
			value={textareaValue}
			style={{ width: textareaWidth, height: textareaHeight }}
			readOnly
		/>
	);
};

export default Textarea;
