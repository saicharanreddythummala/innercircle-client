import React from 'react';
import { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Chat from '../../components/chat/Chat';

export default function Main() {
  const navigate = useNavigate();
  const [user, setUser] = useState();

  useEffect(()=>{
    async function getU(){
      if (localStorage.getItem('user') === null) {
        navigate('/login');
      } else {
        setUser(await JSON.parse(localStorage.getItem('user')));
        navigate('/chat');
      }
    }
      getU();
  }, [navigate]);


  return (
    <>
      {user && (
        <Routes>
          <Route path="/chat" element={<Chat user={user} />} />
        </Routes>
      )}
    </>
  );
}
