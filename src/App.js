import { useState } from 'react';
import './App.css';
import WerewolfDemo from './WerewolfDemo';
import GameConfig from './components/GameConfig';

function App() {
  const handleStep = (val) => {
    setStep(val)
  }
  const [step, setStep] = useState(0)
  const [outCome, getOutCome] = useState([])
  return (
    <div className="App">
      <div className='overlay'></div>
      <div className='content'>
        {step === 0 &&(<GameConfig handleStep={handleStep} />)}
        {step === 1 && (<WerewolfDemo />)} 
      </div>
    </div>
  );
}

export default App;