import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsersApi } from '../../utils/apiCalls';
import ChatContainer from '../chatContainer/ChatContainer';
import Welcome from '../welcome/Welcome';
import axios from 'axios';
import ContactsNav from '../contacts/ContactsNav';
import './chat.scss';
import MenuIcon from '@mui/icons-material/Menu';
import { io } from 'socket.io-client';
import '../chatContainer/chatContainer.scss';


export default function Chat() {
  const navigate = useNavigate();
  
  const socket = useRef();

  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [clicked, setClicked] = useState(false);


  useEffect(() => {
    async function getUser(){
       
      if (!localStorage.getItem('user')) {
        navigate('/login');
      } else {
        setCurrentUser(await JSON.parse(localStorage.getItem('user')));
      }
    }
    getUser();
  }, [navigate]);


  useEffect(() => {
    if(currentUser){

      socket.current = io(`http://localhost:4000`, {
        withCredentials: true,
      });
      socket.current.emit('add-user', currentUser._id);
    }
  }, [currentUser]);

    useEffect(() => {
    async function getContacts(){
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
          {/* {window.innerWidth < 600 ? (
            <MenuIcon
              className="menu ms-2"
              onClick={() => setClicked(!clicked)}
            />
          ) : null} */}
        </div>

        <div className="container">
          {currentChat === undefined ? (
            <Welcome className="welcome" />
          ) : (
            <ChatContainer
            currentChat={currentChat}
              setCurrentChat={setCurrentChat}
              socket={socket}
            />
          )}
        </div>
      </div>
    </>
  );
}
