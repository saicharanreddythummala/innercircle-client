import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsersApi } from '../../utils/apiCalls';
import ChatContainer from '../chatContainer/ChatContainer';
import Welcome from '../welcome/Welcome';
import axios from 'axios';
import ContactsNav from '../contacts/ContactsNav';
import './chat.scss';
import { io } from 'socket.io-client';
import MenuIcon from '@mui/icons-material/Menu';

export default function Chat() {
  const navigate = useNavigate();

  const socket = useRef();

  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    async function getUser() {
      if (!localStorage.getItem('user')) {
        navigate('/login');
      } else {
        setCurrentUser(await JSON.parse(localStorage.getItem('user')));
      }
    }
    getUser();
  }, [navigate]);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(`https://innercircle-server.vercel.app`);
      socket.current.emit('add-user', currentUser._id);
    }
  }, [currentUser]);

  useEffect(() => {
    async function getContacts() {
      if (currentUser) {
        if (currentUser.isAvatar) {
          const data = await axios.get(`${getUsersApi}/${currentUser._id}`);
          setContacts(data.data);
        } else {
          navigate('/setAvatar');
        }
      }
    }

    getContacts();
  }, [currentUser, navigate]);

  const changeChat = (chat) => {
    setCurrentChat(chat);
  };

  return (
    <>
      <div className="chat_container d-flex">
        <div className="d-flex">
          <ContactsNav
            className={clicked ? 'menu_clicked contacts_nav' : 'contacts_nav'}
            contacts={contacts}
            changeChat={changeChat}
          />
          {window.length < 600 ? (
            null
          ) : <MenuIcon
          className="menu ms-2"
          onClick={() => setClicked(!clicked)}
        />}
        </div>

        <div className="container">
          {currentChat === undefined ? (
            <Welcome className="welcome" />
          ) : (
            <ChatContainer
              currentChat={currentChat}
              currentUser={currentUser}
              socket={socket}
            />
          )}
        </div>
      </div>
    </>
  );
}
