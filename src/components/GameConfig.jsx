import React, { useEffect, useState } from "react";
import { TextField, Box, MenuItem, Button, OutlinedInput, Checkbox, ListItemText} from "@mui/material";
import { Select, message } from "antd"
import { Container } from "lucide-react";
import "./gameConfig.css"

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 300,
      },
    },
  };
  
const GameConfig = ({
    handleStep,
    UpdatedInitEnd
}) => {
    const [rounds, setRounds] = useState(null)
    const [number, setNumber] = useState(null)
    const [actors, setActors] = useState([])
    const [names, setNames] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
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
        if(actors.length !== number) {
            message.warning(actors.length > number ? `more than ${number} actors` : `less than ${number} actors`)
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
            body: JSON.stringify({ n_player: number, n_round: Number(rounds), player_names: actors }),
          })
        console.log('res', response)
        if (!response.ok) {
          throw new Error('Failed to fetch game data');
        }else {
            UpdatedInitEnd(true)
        }
      } catch (err) {
        setLoading(false);
      }
    };

    const handleRoundsChange = (e) => {
        const inputValue = e.target.value;

        // 检查输入是否为数字
        if (/^\d*$/.test(inputValue) || inputValue === '') {
            setRounds(inputValue)
            setRoundsError(false);
        } else {
            setRoundsError(true);
        }
    }

    const handleActorsChange = (value) => {
        setActors(value)
    }

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    }

    const filteredOptions = names.filter(option =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('https://dd8d3012-bf4e-4c9e-80d8-1b041ca9c18b-00-2ap7khwe77mtz.pike.replit.dev:9000/api/user-data');
                
                if (res.ok) {
                    const data = await res.json(); // 解析响应为 JSON
                    console.log('user', data)
                    setNames(data.usernames);
                } else {
                    throw new Error('Failed to fetch game data');
                }
            } catch (error) {
                console.error(error); // 处理错误
            }
        };
        fetchData();
    }, []);

    return (
        <div className="config-form">
            <h3 className="text-lg font-semibold mb-4 text-left text-antiquewhite">GAME CONFIGURE</h3>
            <div className="form-item">
                <div className="font-medium text-left text-yellow-400" style={{ width: '14rem'}}>rounds: </div>
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
                <div className="font-medium text-left text-yellow-400" style={{ width: '14rem'}}>player_number: </div>
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
                <div className="font-medium text-left text-yellow-400" style={{ width: '14rem'}}>actor: </div>
                <Select
                    // showSearch
                    value={actors}
                    mode="multiple"
                    maxTagCount="responsive"
                    // style={{ width: '20rem', height: '3rem', backgroundColor: 'transparent' }}
                    className="select-input"
                    defaultActiveFirstOption={false}
                    // optionFilterProp="label"
                    onChange={handleActorsChange}
                    notFoundContent={null}
                    options={(names || []).map((d) => ({
                        value: d,
                        label: d,
                    }))}
                />
            </div>
            <div className="form-item">
                <Button className="next-button" onClick={handleNextStep} >Start Game</Button>
            </div>
        </div>
    )
}

export default GameConfig