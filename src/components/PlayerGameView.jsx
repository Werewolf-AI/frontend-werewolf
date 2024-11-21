import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '@mui/material/styles';
import { Play, Pause, SkipForward, SkipBack, User } from 'lucide-react';
import { Tabs, Tab, Avatar, TableContainer, Table, TableBody, TableHead, TableRow, TableCell, Box, Typography, AppBar} from "@mui/material"
import './PlayerGameView.css'
import Guard from '../assets/avatars/Guard.jpg'
import Villager from '../assets/avatars/Villager.jpg'
import Witch from '../assets/avatars/Witch.jpg'
import wereWolf from '../assets/avatars/wereWolf.jpg'
import Seer from '../assets/avatars/Seer.jpg'
import Moderator from '../assets/avatars/start.jpg'

  function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`full-width-tabpanel-${index}`}
        aria-labelledby={`full-width-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

const PlayerGameView = ({
  isInitEnd= false
}) => {
  const [winlossTable, setWinLossTable] = useState([])
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [gameData, setGameData] = useState({
    players: [],
    dialogue: []
  });
  const [curRound, setCurRound] = useState(null)
  const [totalRound, setTotalRound] = useState(null)
  const [tabValue, setTabValue] = useState(0);
  const [roleResponsibility, setResponsibility] = useState([
    {
      name: "wereWolf",
      resp: "My step-by-step thought process: 1. I know that Player6 is my fellow werewolf, so I can trust them. 2. Among the living players, I need to consider who poses the greatest threat to us as werewolves. 3. Player1 seems to be the most suspicious based on the dynamics of the game, and eliminating them could reduce the risk of being discovered. Therefore, I will choose to hunt Player1."
    },{
      name: "Guard",
      resp: "My step-by-step thought process: 1. I need to assess which player might be targeted by the werewolves tonight. 2. Since I have no prior information about the players' roles or actions, I will choose to protect a player who seems to be a potential target based on their position in the game. 3. I will protect Player1, as they might be perceived as a threat by the werewolves due to their active participation in discussions."
    }, {
      name: "Witch",
      resp: "Player1 has been killed by the werewolves. As the Witch, I have the ability to save one player who has been killed. I need to consider the implications of saving Player1. If Player1 is a villager, saving them would be beneficial for our side. However, if Player1 is a werewolf, saving them would strengthen the werewolf team. I have no prior knowledge of Player1's role, but since they were killed, it is likely they were a villager. Therefore, I should save Player1 to maintain our numbers and increase our chances of winning."
    }, {
      name: "Seer",
      resp: "My step-by-step thought process: 1. I need to identify a player who could potentially be a werewolf or someone who might be a threat to the villagers. 2. Since I have no prior information about the players' actions or behaviors, I will choose a player randomly to verify their identity. 3. I will select Player1 to verify, as I want to start gathering information about the players and Player1 is a good candidate to begin with."
    }, {
      name: "Villager",
      resp: "My step-by-step thought process: 1. Player2 claims to be the Seer and accuses Player3, which is supported by Player5, the Witch. This makes Player2's claim somewhat credible. 2. Player3 is heavily accused and has no strong defense, while Player6 and Player7 are questioning Player2's claim, which raises suspicion about them. 3. Given the current voting trend and the support for Player2, I believe it is safer to vote against Player3, as they are the primary target and could be a werewolf."
    }
  ])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  // Fetch game data from backend
  const fetchGameData = async () => {
    try {
      const response = await fetch('http://34.143.146.120:59000/api/game-data') //('http://localhost:9000/api/game-data');
      if (!response.ok) {
        throw new Error('Failed to fetch game data');
      }
      setError(null);
      const data = await response.json();
      setGameData(data);
      setCurRound(data.current_round)
      setTotalRound(data.n_rounds)
      const tableArray = data.players
        .filter(item => item.name).map(item => ({
            name: item.name,
            win: item.win,
            loss: item.loss
        }));
      setWinLossTable(tableArray)
      
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };
  useEffect(() => {
    // fetchGameData();
    let intervalId
    if (!isInitEnd) {
      intervalId = setInterval(fetchGameData, 5000);
    }

    // Clean up interval on component unmount
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    }
  }, [isInitEnd]);

  const roleColors = {
    "Guard": "bg-blue-100",
    "Seer": "bg-purple-100",
    "Werewolf": "bg-red-100",
    "Villager": "bg-green-100",
    "Witch": "bg-yellow-100",
    "Moderator": "bg-gray-100"
  };

  const roleAvatar = {
    "Guard": Guard,
    "Villager": Villager,
    "Seer": Seer,
    "Werewolf": wereWolf,
    "Witch": Witch,
    "Moderator": Moderator
  }  

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // 处理自动播放
  useEffect(() => {
    let timer;
    if (isPlaying && currentStep < gameData?.dialogue.length - 1) {
      timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 2000);
    }
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
    // else if (currentStep >= gameData?.dialogue.length - 1) {
    //   setIsPlaying(false);
    // }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, gameData?.dialogue?.length]);

  // 当消息更新时滚动到底部
  // useEffect(() => {
    // scrollToBottom();
  // }, [currentStep]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-blue-500">Loading...</div>;
  }

//   if (error) {
//     return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;
//   }

  return (
    <div className="py-3 px-0 mx-6 rounded-lg ">
        <Box sx={{ width: '100%' }} style={{ fontSize: '3vw' }}>
            <Tabs
            value={tabValue}
            onChange={handleTabChange}
            //   indicatorColor="secondary"
            //   textColor="inherit"
            //   variant="fullWidth"
            //   aria-label="full width tabs example"
            centered
            >
                <Tab label="Role Description" 
                sx={{ 
                    fontSize: '0.4rem', 
                    fontFamily: 'pressStart2P',
                    fontWeight: 'bold', 
                    color: 'primary.main', 
                    whiteSpace: 'normal', // 允许换行
                    overflow: 'hidden',    // 隐藏溢出
                    textAlign: 'center',   // 中心对齐
                    width: '18vw',
                }}  
                />
                <Tab label="Players Information"
                    sx={{ 
                        fontSize: '0.4rem', 
                        fontFamily: 'pressStart2P',
                        fontWeight: 'bold', 
                        color: 'primary.main', 
                        whiteSpace: 'normal', // 允许换行
                        overflow: 'hidden',    // 隐藏溢出
                        textAlign: 'center',   // 中心对齐
                        width: '18vw',
                    }}  
                />
                <Tab label="Game Process"  
                    sx={{ 
                        fontSize: '0.4rem', 
                        fontFamily: 'pressStart2P',
                        fontWeight: 'bold', 
                        color: 'primary.main', 
                        whiteSpace: 'normal', // 允许换行
                        overflow: 'hidden',    // 隐藏溢出
                        textAlign: 'center',   // 中心对齐
                        maxWidth: '18vw',
                    }}  
                />
                <Tab label="Ranking Board" 
                    sx = {{ 
                        fontSize: '0.4rem', 
                        fontFamily: 'pressStart2P',
                        fontWeight: 'bold', 
                        color: 'primary.main', 
                        whiteSpace: 'normal', // 允许换行
                        overflow: 'hidden',    // 隐藏溢出
                        textAlign: 'center',   // 中心对齐
                        maxWidth: '18vw',
                    }}  
                />
            </Tabs>
        </Box>
      <TabPanel value={tabValue} index={0} dir={theme.direction}>
        {/** 角色介绍 */}
        <div className="p-4 rounded-lg shadow-md" style={{ width: '80vw'}}>
          <h3 className="text-[5vw] font-semibold mb-4 text-left text-antiquewhite">Game Role</h3>
              <div className='space-y-3'>
                {roleResponsibility?.map(item => (
                  <div key={item.name} className='role-resp-card'>
                    <div className='player-content'>
                      <div className="flex-1">
                        <div className="font-medium text-left text-yellow-400">{item.name}</div>
                        <div className={`role-style`}>{item?.resp}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
        </div>
      </TabPanel>
      <TabPanel value={tabValue} index={1} dir={theme.direction}>
        {/* 左侧玩家列表 */}
        <div className="p-4 rounded-lg shadow-md" style={{ width: '80vw'}}>
          <h3 className="text-[5vw] font-semibold mb-4 text-left text-antiquewhite">Player List</h3>
          <div className="space-y-3">
            {Array.isArray(gameData?.players) && gameData?.players?.map((player) => (
              <div 
              key={player.id}
              className="role-card"
              >
                <div className='player-content'>
                  <div className={`h-8 w-8 rounded-full ${roleColors[player?.role]} flex items-center justify-center flex-shrink-0`}>
                    {/* <User className="h-5 w-5" /> */}
                    <Avatar alt={player.name} src={roleAvatar[player?.role]} />
                  </div>
                  <div className="ml-3 flex-1">
                    <div className=" text-[5vw] font-medium text-left text-yellow-400">{player.name}</div>
                    <div className={`role-style ${player?.role}`}>{player?.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </TabPanel>
      <TabPanel value={tabValue} index={2} dir={theme.direction}>
        {/* 中间对话展示区 */}
        <div className="md:col-span-3">
          <h3 className="text-lg font-semibold mb-4 text-left text-antiquewhite">Game Progress</h3>
          <div className="mx-2 rounded-lg shadow-md mb-4 overflow-y-auto" style={{ height: '70vh', transition: 'scroll-behavior 1s' }} ref={chatContainerRef}>
            <div className="space-y-4">
              {gameData.dialogue?.slice(0, currentStep + 1)?.map((message, index) => {
                const player = gameData?.players?.find(p => p.name === message.speaker);
                return (
                  <div key={index} className="flex space-x-3 bg-white bg-opacity-50">
                    <div className="flex-shrink-0">
                      <div className={`h-8 w-8 rounded-full ${roleColors[player?.role]} flex items-center justify-center`}>
                        {/* <User className="h-5 w-5" /> */}
                        <Avatar alt={player?.name} src={roleAvatar[message?.role]} />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline text-left">
                        <span className="font-medium text-yellow-400">{message.speaker}</span>
                        <span className={`ml-2 text-sm ${player?.role}`}>{message?.role}</span>
                        <span className="ml-2 text-xs text-gray-400">{message.type}</span>
                      </div>
                      <div className="mt-1 mr-1 text-sm text-gray-100 text-left">
                        {message.content}
                      </div>
                    </div>
                    {/* <div ref={index === currentStep ? messagesEndRef : null} /> */}
                  </div>
                );
              })}
              {/* 添加一个空的div作为滚动目标 */}
              {/* <div ref={messagesEndRef} /> */}
            </div>
          </div>

          {/* 控制栏 */}
          <div className="p-4 mx-6 rounded-lg shadow-md bg-white bg-opacity-50">
            <div className="flex justify-center space-x-4">
              <button 
                onClick={() => {
                  setCurrentStep(Math.max(0, currentStep - 1));
                  setIsPlaying(false);
                }}
                className="p-2 rounded-full hover:bg-gray-100"
                disabled={currentStep === 0}
              >
                <SkipBack className="h-6 w-6" />
              </button>
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 rounded-full hover:bg-gray-100"
                disabled={currentStep >= gameData?.dialogue?.length - 1}
              >
                {isPlaying ? 
                  <Pause className="h-6 w-6" /> : 
                  <Play className="h-6 w-6" />
                }
              </button>
              <button 
                onClick={() => {
                  setCurrentStep(Math.min(gameData?.dialogue?.length - 1, currentStep + 1));
                  setIsPlaying(false);
                }}
                className="p-2 rounded-full hover:bg-gray-100"
                disabled={currentStep >= gameData?.dialogue?.length - 1}
              >
                <SkipForward className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </TabPanel>
      <TabPanel value={tabValue} index={3} dir={theme.direction}>
        {/** 排名 */}
        <div className='grid grid-cols-1 md:grid-cols-5 gap-6'>
          <div className='col-span-1 md:col-span-2'>
            <h3 className="text-lg font-semibold mb-4 text-left text-antiquewhite">Rank</h3>
            <div className='flex space-x-3'>
              <span className="font-medium text-yellow-400">current Rounds:</span>
              <span className="mt-1 text-sm text-gray-100 text-left">{curRound}</span>
            </div>
            <div className='flex space-x-3'>
              <span className="font-medium text-yellow-400">total Rounds:</span>
              <span className="mt-1 text-sm text-gray-100 text-left">{totalRound}</span>
            </div>
            <div className='flex space-x-3'>
              <span className="font-medium text-yellow-400">Win/Loss:</span>
              <div className='mt-1 text-sm text-gray-100 text-left'>
              {/* <TableContainer component={Paper} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}> */}
                {winlossTable && <Table sx={{ width: '40vw' }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell align="right" sx={{ mt: 1, fontSize: '0.5rem', color: 'rgba(255, 255, 255, 0.7)', textAlign: 'left', fontFamily: 'pressStart2P' }}>Win</TableCell>
                      <TableCell align="right" sx={{ mt: 1, fontSize: '0.5rem', color: 'rgba(255, 255, 255, 0.7)', textAlign: 'left', fontFamily: 'pressStart2P' }}>Loss</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {winlossTable.map((row) => (
                      <TableRow
                        key={row.name}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell scope="row" sx={{ mt: 1, fontSize: '0.4rem', color: 'rgba(255, 255, 255, 0.7)', textAlign: 'left', fontFamily: 'pressStart2P' }}>
                          {row.name}
                        </TableCell>
                        <TableCell align="right" sx={{ mt: 1, fontSize: '0.4rem', color: 'rgba(255, 255, 255, 0.7)', textAlign: 'left', fontFamily: 'pressStart2P' }}>{row.win}</TableCell>
                        <TableCell align="right" sx={{ mt: 1, fontSize: '0.4rem', color: 'rgba(255, 255, 255, 0.7)', textAlign: 'left', fontFamily: 'pressStart2P' }}>{row.loss}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>}
              {/* </TableContainer> */}
              </div>
            </div>
          </div>
        </div>
      </TabPanel>




      {/* <div className="grid grid-cols-1 md:grid-cols-5 gap-6"> */}

          {/** 角色介绍 */}
        {/* <div className="p-4 rounded-lg shadow-md" style={{ width: '10rem'}}>
          <h3 className="text-[1.5vw] font-semibold mb-4 text-left text-antiquewhite">Game Role</h3>
              <div className='space-y-3'>
                {roleResponsibility.map(item => (
                  <div key={item.name} className='role-resp-card'>
                    <div className='player-content'>
                      <div className="flex-1">
                        <div className="font-medium text-left text-yellow-400">{item.name}</div>
                        <div className={`role-style`}>{item?.resp}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
        </div> */}

        {/* 左侧玩家列表 */}
        {/* <div className="p-4 rounded-lg shadow-md" style={{ width: '50vh'}}>
          <h3 className="text-[1.5vw] font-semibold mb-4 text-left text-antiquewhite">Player List</h3>
          <div className="space-y-3">
            {gameData.players.map((player) => (
              <div 
              key={player.id}
              className="role-card"
              >
                <div className='player-content'>
                  <div className={`h-8 w-8 rounded-full ${roleColors[player?.role]} flex items-center justify-center flex-shrink-0`}>
                    <Avatar alt={player.name} src={roleAvatar[player?.role]} />
                  </div>
                  <div className="ml-3 flex-1">
                    <div className=" text-[1.5vw] font-medium text-left text-yellow-400">{player.name}</div>
                    <div className={`role-style ${player?.role}`}>{player?.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div> */}

      {/* </div> */}

      {/* <DialogModal /> */}
     </div>
  );
};

export default PlayerGameView;