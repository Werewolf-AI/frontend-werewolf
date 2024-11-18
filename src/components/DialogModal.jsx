import React, { useEffect, useState } from "react";
import useDialogueLoader from '../DialogueLoader'
import 'react-chat-elements/dist/main.css';

const DialogModal = () => { // {isVisible, onClose}
    const [inputValue, setInputValue] = useState('');
    const { dialogue, loadDialogue } = useDialogueLoader()

    useEffect(() => {
        loadDialogue() // 初始加载对话数据 后面被动接受服务器数据
    }, [loadDialogue])

    const [messages, setMessages] = useState([
        {
            position: 'left',
            type: 'text',
            text: '你好!',
            date: new Date(),
          },
          {
            position: 'right',
            type: 'text',
            text: '你好，有什么可以帮你的?',
            date: new Date(),
          },
    ])

    const handleSendMessage = () => {
        if (inputValue.trim()) {
          setMessages([...messages, inputValue]);
          setInputValue(''); // 清空输入框
        }
      };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>聊天窗口</h2>
        <div style={{ height: '300px', overflowY: 'auto', border: '1px solid #ddd', padding: '10px', marginBottom: '10px' }}>
          {messages.map((msg, index) => (
            <div key={index} style={{ margin: '5px 0' }}>
              <div style={{ backgroundColor: '#f1f1f1', padding: '10px', borderRadius: '5px' }}>
                <strong>{msg.player_name} ({msg.role})：</strong>{msg.text}
              </div>
            </div>
          ))}
        </div>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="输入消息..."
          style={{ width: 'calc(100% - 22px)', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <button onClick={handleSendMessage} style={{ marginTop: '10px', padding: '10px', borderRadius: '5px' }}>
          发送
        </button>
      </div>
    )
}

export default DialogModal