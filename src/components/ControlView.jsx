import React, { useState } from "react"
import GameConfig from "./GameConfig"
import WerewolfDemo from "../WerewolfDemo"

const ControlView = () => {
    const [step, setStep] = useState(0)
    const [isInitEnd, setIsInitEnd] = useState(false)
    
    const handleStep = (val) => {
        setStep(val)
    }

    const UpdatedInitEnd = (val) => {
        setIsInitEnd(val)
    }
    return (
        <div className="App">
            <div className='overlay'></div>
            <div className='content'>
                {step === 0 &&(<GameConfig handleStep={handleStep} UpdatedInitEnd={UpdatedInitEnd} />)}
                {step === 1 && (<WerewolfDemo isInitEnd={isInitEnd} />)} 
            </div>
        </div>
    )
}

export default ControlView