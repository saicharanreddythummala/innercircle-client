import React from 'react';
import { useState } from 'react';
import AddReactionIcon from '@mui/icons-material/AddReaction';
import SendIcon from '@mui/icons-material/Send';
import Picker from 'emoji-picker-react';
import { Button, Input, InputAdornment } from '@mui/material';
import './chatInput.scss';

export default function ChatInput({ className, handleSendMsg }) {
  const [msg, setMsg] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiPickerhideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (e) => {
    let message = msg;
    message += e.emoji;
    setMsg(message);
  };

  const sendChat = () => {
    if (msg.length > 0) {
      handleSendMsg(msg);
      setMsg('');
    }
  };

  return (
    <div className={`container-fluid ${className} d-flex w-100`}>
      <div className="button_container">
        <div className="emoji">
          <AddReactionIcon onClick={handleEmojiPickerhideShow} />
          {showEmojiPicker && (
            <Picker onEmojiClick={(e) => handleEmojiClick(e)} />
          )}
        </div>
      </div>
      <div className="input_container">
        <Input
          fullWidth
          type="text"
          placeholder="type your message here"
          onChange={(e) => setMsg(e.target.value)}
          value={msg}
          endAdornment={
            <InputAdornment position="start">
              <Button onClick={sendChat}>
                <SendIcon />
              </Button>
            </InputAdornment>
          }
        />
      </div>
    </div>
  );
}
