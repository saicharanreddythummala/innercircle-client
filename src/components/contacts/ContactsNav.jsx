import React from 'react';
import { useEffect, useState } from 'react';
import { Typography } from '@mui/material';

export default function ContactsNav({ className, contacts, changeChat }) {
  const [currentUserName, setCurrentUserName] = useState('');
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);

  useEffect(() => {
    async function getUser() {
      const data = await JSON.parse(localStorage.getItem('user'));
      setCurrentUserName(data.username);
      setCurrentUserImage(data.avatar);
    }
    getUser();
  }, []);


  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };

  return (
    <>
      {currentUserName && currentUserImage ? (
        <>
          <div className={className}>
            <div className="logo d-flex align-items-center">
              <Typography variant="h4" color="white">
                InnerCircle
              </Typography>
            </div>
            <div className="contacts">
              {contacts.map((c, i) => (
                <div
                  key={c._id}
                  className={`contact ${
                    i === currentSelected ? 'selected' : ''
                  }`}
                  onClick={() => changeCurrentChat(i, c)}
                >
                  <div className="avatar">
                    <img src={`data:image/svg+xml;base64,${c.avatar}`} alt="" />
                  </div>
                  <div className="username">
                    <h3>{c.username}</h3>
                  </div>
                </div>
              ))}
            </div>
            <div className="c_user d-flex align-items-center">
              <Typography variant="h4" color={'white'} className="ms-3">
                {currentUserName}
              </Typography>
              <div className="avatar ms-2">
                <img
                  src={`data:image/svg+xml;base64,${currentUserImage}`}
                  alt=""
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <>no users</>
      )}
    </>
  );
}
