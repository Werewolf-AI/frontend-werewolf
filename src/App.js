import { useEffect, useState } from 'react';
import './App.css';
import WerewolfDemo from './WerewolfDemo';
import GameConfig from './components/GameConfig';
import Home from './components/Home'
import ControlView from './components/ControlView';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

function App() {
  // const handleStep = (val) => {
  //   setStep(val)
  // }
  // const [step, setStep] = useState(0)
  // const [isInitEnd, setIsInitEnd] = useState(false)
  // const [outCome, getOutCome] = useState([])

  // const UpdatedInitEnd = (val) => {
  //   setIsInitEnd(val)
  // }

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/control' element={
            <ControlView />
          // <div className="App">
          //   <div className='overlay'></div>
          //   <div className='content'>
          //     {step === 0 &&(<GameConfig handleStep={handleStep} UpdatedInitEnd={UpdatedInitEnd} />)}
          //     {step === 1 && (<WerewolfDemo isInitEnd={isInitEnd} />)} 
          //   </div>
          // </div>
          }
        />
      </Routes>
    </Router>
    
  );
}

export default App;