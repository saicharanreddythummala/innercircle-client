import React, { useRef } from 'react';
import './chatContainer.scss';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Logout from '@mui/icons-material/Logout';
import ChatInput from '../chatInput/ChatInput';
import axios from 'axios';
import { getMsgsApi, sendMessgaeApi } from '../../utils/apiCalls';
import { useEffect, useState } from 'react';
import { v4 as uuid4 } from 'uuid';

export default function ChatContainer({ currentChat, socket }) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const scroll = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);

   //send message
   const handleSendMsg = async(msg) => {

    const user = await JSON.parse(localStorage.getItem('user'));
    await axios.post(`${sendMessgaeApi}`, {
      from: user._id,
      to: currentChat._id,
      message: msg,
    });


    socket.current.emit('send-msgs', {
      to: currentChat._id,
      from: user._id,
      msg,
    });

   
    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg });
    setMessages(msgs);
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on('receive-msg', (msg) => {
        console.log(msg)
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, [socket]);


  useEffect(() => {
    async function getMessages() {
      const user = await JSON.parse(localStorage.getItem('user'));
      const response = await axios.post(getMsgsApi, {
        from: user._id,
        to: currentChat._id,
      });
      setMessages(response.data);
    }
    getMessages()
  }, [currentChat._id]);


  //arrival messages
  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  //scroll
  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };


  return (
    <>
      <div className="chat_window d-flex flex-column">
        <div className="chat_header border-bottom p-3 d-flex justify-content-between align-items-center">
          <div className="user d-flex align-items-center">
            <div className="avatar">
              <img
                src={`data:image/svg+xml;base64,${currentChat.avatar}`}
                alt=""
              />
            </div>
            <div className="username ms-3">
              <h3>{currentChat.username}</h3>
            </div>
          </div>
          <Button variant="contained" size="small" onClick={logout}>
            <Logout />
          </Button>
        </div>
        <div className="chat_messages flex-grow-1 p-2">
          {messages.map((message, i) => {
            return (
              <div key={uuid4()} className="d-flex mb-2" ref={scroll}>
                <div className={`message`}>
                  <div
                    className={`${
                      message.fromSelf ? 'sent text-end' : 'recieved text-start'
                    }`}
                  >
                    <p>{message.message}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <ChatInput handleSendMsg={handleSendMsg} className="chat_input" />
      </div>
    </>
  );
}
