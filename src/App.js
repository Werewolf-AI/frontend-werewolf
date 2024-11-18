import { useState } from 'react';
import './App.css';
import WerewolfDemo from './WerewolfDemo';
import GameConfig from './components/GameConfig';

function App() {
  const handleStep = (val) => {
    setStep(val)
  }
  const [step, setStep] = useState(0)
  const [isInitEnd, setIsInitEnd] = useState(false)
  const [outCome, getOutCome] = useState([])

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
  );
}

export default App;