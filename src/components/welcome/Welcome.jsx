import { Typography } from '@mui/material';
import React from 'react';
import welcome from '../../assets/welcome.svg';

export default function Welcome({ className }) {
  return (
    <>
      <div
        className={`${className} d-flex flex-column justify-content-center align-items-center`}
      >
        <Typography variant="h3" className="text-center mb-2">
          Welcome
        </Typography>
        <img src={welcome} alt="" />
      </div>
    </>
  );
}
