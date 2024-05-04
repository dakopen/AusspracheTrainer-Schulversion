import React from 'react';

const ProgressBar = ({ sentences, onSentenceClick, currentSentenceIndex }) => {
    return (
        <div style={{ display: 'flex', width: '100%', backgroundColor: '#ddd' }}>
            {console.log("completed: ", sentences, "new prop")}
            {sentences.map((completed, index) => (

                <div key={index} style={{
                    flexGrow: 1,
                    height: '24px',
                    backgroundColor: index === currentSentenceIndex ? (completed ? '#4CAF50' : '#C8E6C9') : (completed ? 'green' : 'lightgray'), justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                    cursor: 'pointer'
                }} onClick={() => onSentenceClick(index)}>
                    <span>{index + 1}</span>
                    {completed && (
                        <span style={{
                            position: 'absolute',
                            top: '1px',
                            right: '5px',
                            fontSize: '18px',
                            color: 'white'
                        }}>✓</span>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ProgressBar;
