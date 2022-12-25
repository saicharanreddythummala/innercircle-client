import React from 'react';
import { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Chat from '../../components/chat/Chat';

export default function Main() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('user') === null) {
      navigate('/login');
    } else {
      navigate('/chat');
    }
  }, [navigate]);

  return (
    <>
      <Routes>
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </>
  );
}
