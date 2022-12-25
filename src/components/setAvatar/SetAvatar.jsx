import React, { useState, useEffect } from 'react';
import { Buffer } from 'buffer';
import { avatarApi, userAvatar } from '../../utils/apiCalls';
import Loader from '../../utils/Loader';
import { Button, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './setAvatar.scss'

export default function SetAvatar() {
  const navigate = useNavigate();

  const [avatars, setAvatars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);

  //set Avatar
  const setAvatar = async () => {
    if (selectedAvatar === undefined) {
      alert('Please select an avatar');
    } else {
      const user = await JSON.parse(localStorage.getItem('user'));

      const { data } = await axios.post(`${userAvatar}/${user._id}`, {
        image: avatars[selectedAvatar],
      });

      if (data.isSet) {
        user.isAvatar = true;
        user.avatar = data.image;
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/chat');
      } else {
        alert('Error setting avatar. Please try again.');
      }
    }
  };

  async function fetchAvatars() {
    const data = [];

    for (let i = 0; i < 4; i++) {
      const img = await axios.get(
        `${avatarApi}/${Math.round(Math.random() * 1000)}`
      );
      const buffer = new Buffer(img.data);
      data.push(buffer.toString('base64'));
    }
    setAvatars(data);
    setLoading(false);
  }

  useEffect(() => {
    setLoading(true);
    fetchAvatars();
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="container-fluid set_avatar d-flex flex-column justify-content-center align-items-center">
            <Typography variant="h4" color={'secondary'}>
              Choose an avatar
            </Typography>
            <div className="avatars d-flex">
              {avatars.map((avt, i) => (
                <div
                  className={`avatar ${selectedAvatar === i ? 'selected' : ''}`}
                  key={i}
                >
                  <img
                    src={`data:image/svg+xml;base64,${avt}`}
                    alt="avatar"
                    key={avt}
                    onClick={() => setSelectedAvatar(i)}
                  />
                </div>
              ))}
            </div>
            <Button className="rgstr_btn" onClick={setAvatar}>
              set avatar
            </Button>
          </div>
        </>
      )}
    </>
  );
}
