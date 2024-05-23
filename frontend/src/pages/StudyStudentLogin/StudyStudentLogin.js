import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import './StudyStudentLogin.css';

const StudyStudentLogin = () => {
	let { sendToStudyStudentLogin } = useContext(AuthContext);
	const [inputs, setInputs] = useState(Array(10).fill(''));
	const inputRefs = useRef(inputs.map(() => React.createRef()));
	const checkboxRef = useRef(null);
	const submitRef = useRef(null);

	useEffect(() => {
		if (inputRefs.current[0].current) {
			inputRefs.current[0].current.focus();
		}
	}, []);


	const focusNextInput = (index) => {
		if (index < 9) {
			inputRefs.current[index + 1].current.focus();
		} else if (index === 9) {
			checkboxRef.current.focus();
		} else if (index === 10) {
			submitRef.current.focus();
		}
	};

	const focusPreviousInput = (index) => {
		if (index === 11) {
			checkboxRef.current.focus();
		} else if (index > 0) {
			inputRefs.current[index - 1].current.focus();
		}
	};

	const handleChange = (index) => (event) => {
		const oldChar = inputs[index];

		if (oldChar === '') {
			simulatePaste(index, event.target.value);
			return;
		} else {
			let newInput = "";
			if (event.target.value.startsWith(oldChar)) {
				newInput = event.target.value.slice(oldChar.length);
			} else {
				newInput = event.target.value.slice(0, -oldChar.length);
			}
			simulatePaste(index, newInput);
			return;
		}
	};

	const handleKeyDown = (index) => (event) => {
		if (event.key === 'ArrowRight' && index < 11) {
			focusNextInput(index);
		} else if (event.key === 'ArrowLeft' && index > 0) {
			focusPreviousInput(index);
		} else if (event.key === 'Backspace' && index >= 0) {
			if (index > 0 && index < 11) {
				inputRefs.current[index - 1].current.focus();
				inputRefs.current[index - 1].current.setSelectionRange(0, 0);
			}
			if (index < 10) {
				const newInputs = [...inputs];
				newInputs[index] = '';
				setInputs(newInputs);
			}
		} else if (event.key === 'Enter' && index === 10) {
			event.preventDefault();
			checkboxRef.current.checked = !checkboxRef.current.checked;
			focusNextInput(index);
		}
	};

	const simulatePaste = (index, text) => {
		const newInputs = [...inputs];
		const pasteData = text.toUpperCase().replace(/[^A-Z0-9]/g, '');
		const startIdx = inputRefs.current.findIndex(ref => ref.current === document.activeElement);
		const endIdx = Math.min(startIdx + pasteData.length, 10);
		let idx = startIdx;

		for (; idx < endIdx; idx++) {
			newInputs[idx] = pasteData[idx - startIdx];
		}
		setInputs(newInputs);
		if (idx < 10) {
			inputRefs.current[idx].current.focus();
		} else if (idx === 10) {
			checkboxRef.current.focus();
		}
	}


	const handlePaste = (event) => {
		event.preventDefault();
		const pasteData = event.clipboardData.getData('text').toUpperCase().replace(/[^A-Z0-9]/g, '');
		const newInputs = [...inputs];
		const startIdx = inputRefs.current.findIndex(ref => ref.current === document.activeElement);
		const endIdx = Math.min(startIdx + pasteData.length, 10);
		let idx = startIdx;

		for (; idx < endIdx; idx++) {
			newInputs[idx] = pasteData[idx - startIdx];
		}

		setInputs(newInputs);
		if (idx < 10) {
			inputRefs.current[idx].current.focus();
		} else if (idx === 10) {
			checkboxRef.current.focus();
		}
	};

	return (
		<div >
			<h1>Studien Login</h1>
			<form onSubmit={sendToStudyStudentLogin} className='login-form'>
				<div className='input-container'>
					{inputs.map((input, index) => (
						<React.Fragment key={`fragment-${index}`}>

							<input
								key={index}
								type="text"
								maxLength="10"
								value={input}
								onChange={handleChange(index)}
								onKeyDown={handleKeyDown(index)}
								onPaste={handlePaste}
								ref={inputRefs.current[index]}
								style={{ width: '20px', marginRight: '5px' }}
							/>
							{(index === 2 || index === 6) && <span className='hyphen'>-</span>}

						</React.Fragment>
					))}

				</div>
				<div className='checkbox-container'>
					<input
						type="checkbox"
						ref={checkboxRef}
						required
						onKeyDown={handleKeyDown(10)}
						name="consent-checkbox"
						id="consent-checkbox"
					/>
					<label htmlFor="consent-checkbox">Ich und meine Erziehungsberechtigten haben die Einwilligungserklärung gelesen und unterschrieben.
						<span className='required'> *</span>
					</label>
				</div>
				<input type="submit" ref={submitRef} onKeyDown={handleKeyDown(11)} value="Einloggen" />
			</form>
			<p className='studystudent-text-forgot-username'>Bitte gib den Benutzernamen ein, den du von deiner/deinem Lehrer:in erhalten hast.<br></br>Falls du den Benutzernamen vergessen hast, aber schon eine Mail Adresse hinterlegt hast, kannst du ihn <Link to="/forgot-username">hier</Link> abrufen. Andernfalls melde dich bei deiner/deinem Lehrer:in, um einen neuen Account zu erhalten.</p>
		</div>
	);
};

export default StudyStudentLogin;
