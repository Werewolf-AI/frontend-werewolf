import React, { useState } from "react";
import { TextField, Box, Select, MenuItem, Button} from "@mui/material";
import { Container } from "lucide-react";
import "./gameConfig.css"

const GameConfig = ({
    handleStep
}) => {
    const [rounds, setRounds] = useState(null)
    const [number, setNumber] = useState(null)
    const [roundsError, setRoundsError] = useState(false);
    const [numberError, setNumberError] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleNextStep = () => {
        console.log(rounds, number, /^\d*$/.test(rounds))
        if (!/^\d*$/.test(rounds) || rounds === '' || rounds === null) {
            setRoundsError(true);
            return
        }
        if(!/^\d*$/.test(number) || number === '' || number === null) {
            setNumberError(true)
            return
        } 
        fetchGameData()
        handleStep(1)
    }
    const fetchGameData = async () => {
      try {
        const response = await fetch("https://dd8d3012-bf4e-4c9e-80d8-1b041ca9c18b-00-2ap7khwe77mtz.pike.replit.dev:9000/api/init-game", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ n_player: number, n_round: Number(rounds) }),
          })
        console.log('res', response)
        if (!response.ok) {
          throw new Error('Failed to fetch game data');
        }
      } catch (err) {
        setLoading(false);
      }
    };

    const handleRoundsChange = (e) => {
        console.log('rounds', e)
        const inputValue = e.target.value;

        // 检查输入是否为数字
        if (/^\d*$/.test(inputValue) || inputValue === '') {
            setRounds(inputValue)
            setRoundsError(false);
        } else {
            setRoundsError(true);
        }
    }

    return (
        <div className="config-form">
            <h3 className="text-lg font-semibold mb-4 text-left text-antiquewhite">GAME CONFIGURE</h3>
            <div className="form-item">
                <div className="font-medium text-left text-yellow-400" style={{ width: '230px'}}>rounds: </div>
                <TextField
                    // color="secondary" 
                    // focused
                    type="number"
                    margin="normal"
                    value={rounds}
                    error={roundsError}
                    helperText={roundsError ? '请输入数字' : ''}
                    InputProps={{
                        style: {
                            color: 'white',
                            fontSize: '20px',
                        }
                    }}
                    className="text-input"
                    sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'white',
                        }
                    }}
                    onChange={(e) => handleRoundsChange(e)}
                />
            </div>
            <div className="form-item">
                <div className="font-medium text-left text-yellow-400" style={{ width: '230px'}}>player_number: </div>
                <TextField
                    select
                    value={number} 
                    error={numberError}
                    helperText={numberError ? '请输入正确人数' : "" }
                    onChange={(e) => setNumber(e.target.value)} 
                    InputProps={{
                        style: {
                            color: 'white',
                            fontSize: '20px',
                        }
                    }}
                    sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'white',
                        }
                    }}
                    className="text-input"
                >
                    {[5, 6, 7, 8, 9, 10].map(num => (
                        <MenuItem key={num} value={num}>{num}</MenuItem>
                    ))}
                </TextField>
            </div>
            <div className="form-item">
                <Button style={{ fontSize: '18px', fontWeight: 'bold', color: 'white' }} onClick={handleNextStep} >下一步</Button>
            </div>
        </div>
    )
}

export default GameConfig