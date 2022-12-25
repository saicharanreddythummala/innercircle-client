import React, { useRef } from 'react';
import './chatContainer.scss';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Logout from '@mui/icons-material/Logout';
import ChatInput from '../chatInput/ChatInput';
import axios from 'axios';
import { getMsgsApi, sendMessgaeApi } from '../../utils/apiCalls';
import { useEffect, useState } from 'react';
import {v4 as uuid4} from 'uuid'

export default function ChatContainer({ currentChat, currentUser, socket }) {


  const navigate = useNavigate();
  const scroll = useRef();

  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);


  //logout function
  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleSendMsg = async (msg) => {
    await axios.post(`${sendMessgaeApi}`, {
      from: currentUser._id,
      to: currentChat._id,
      message: msg,
    });

    socket.current.emit('send-msg', {
      to: currentChat._id,
      from: currentUser._id,
      msg,
    });
    // await axios.post(sendMessageRoute, {
    //   from: data._id,
    //   to: currentChat._id,
    //   message: msg,
    // });

    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg });
    setMessages(msgs);

    // getMsgs();
  };



  useEffect(() => {
    if (socket.current) {
      socket.current.on('msg-recieve', (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, [socket]);


  //arrival messages
  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);


  //scroll
  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);


  //get msgs
  async function getMsgs() {
    if (currentChat) {
      const data = await JSON.parse(localStorage.getItem('user'));
      const response = await axios.post(getMsgsApi, {
        from: data._id,
        to: currentChat._id,
      });
      setMessages(response.data);
    }
  }

  useEffect(() => {
    getMsgs();
  }, [currentChat._id]);


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
