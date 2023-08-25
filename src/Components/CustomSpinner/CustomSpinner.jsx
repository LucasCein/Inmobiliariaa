import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader"
const CustomSpinner = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
            <ClimbingBoxLoader
                color="#fff"
                cssOverride={{
                    position: 'absolute',
                    transform: 'translate(-50%, -50%)',
                    left: '50%',
                    top: '50%',
                    height: '100%'
                }}
                loading
                speedMultiplier={1}
            />
        </div>
    )
}

export default CustomSpinner