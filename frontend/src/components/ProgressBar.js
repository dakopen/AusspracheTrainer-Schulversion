const ProgressBar = ({ percentage }) => {
    return (
        <div style={{ width: '100%', backgroundColor: '#ddd' }}>
            <div style={{
                height: '24px',
                width: `${percentage}%`,
                backgroundColor: 'green',
                textAlign: 'center',
                color: 'white'
            }}>
                {`${Math.round(percentage)}%`}
            </div>
        </div>
    );
};

export default ProgressBar;
