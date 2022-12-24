import React, { useState, useEffect } from 'react';
import { Button, Grid, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useFormik } from 'formik';
import '../register/register.scss';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { loginApi } from '../../utils/apiCalls';
import Loader from '../../utils/Loader';
import './login.scss'

export default function Login() {
  const navigate = useNavigate();

  const [loading, setloading] = useState(false);

  const tfOptions = {
    '& label.Mui-focused': {
      color: '#9381ff',
    },
    '& .MuiInputBase-root': {
      backgroundColor: 'white',
      boxShadow: '0px 0px 8px #9381ff',
    },

    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#9381ff',
      },
      '&:hover fieldset': {
        borderColor: '#9381ff',
      },
      '& Mui-foucsed fieldset': {
        borderColor: '#9381ff',
      },
    },
  };

  const validate = (values) => {
    const errors = {};

    if (!values.username) {
      errors.username = 'username required';
    }

    if (!values.password) {
      errors.password = 'password required';
    }

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validate,
    onSubmit: async (values) => {
      try {
        setloading(true);
        const data = {
          username: values.username,
          password: values.password,
        };

        const result = await axios.post(loginApi, data, {
          headers: {
            'Content-Type': 'application/json',
          },
        });


        if (result.data.status === false) {
          alert(result.data.error);
        }
        if (result.data.status === true) {  
          localStorage.setItem('user', JSON.stringify(result.data.user));
        }

        setloading(false);

        navigate('/chat');
      } catch (err) {
        alert(err.response.data.error);
        setloading(false);
        navigate('/login');
      }
    },
  });

  useEffect(() => {
    if (localStorage.getItem('user')) {
      navigate('/chat');
    }
  }, [navigate]);

  return (
    <>
      <div className="register">
        {loading ? (
          <Loader />
        ) : (
          <div className="register container-fluid d-flex flex-column">
            <div className="logo mb-5">
              <Typography variant="h5" className="text-center">
                Hello again...!
              </Typography>
              <Typography variant="h6" className="text-center">
                welcome back
              </Typography>
            </div>
            <div className="rgstr_grid flex-grow-1 d-flex justify-content-center align-items-start">
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <TextField
                    id="username"
                    fullWidth
                    label="username"
                    variant="outlined"
                    sx={tfOptions}
                    onChange={formik.handleChange}
                    value={formik.values.username}
                  />
                  {formik.errors.username ? (
                    <p className="err_msg">{formik.errors.username}</p>
                  ) : null}
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    id="password"
                    fullWidth
                    type={'password'}
                    label="password"
                    variant="outlined"
                    sx={tfOptions}
                    onChange={formik.handleChange}
                    value={formik.values.password}
                  />
                  {formik.errors.password ? (
                    <p className="err_msg">{formik.errors.password}</p>
                  ) : null}
                </Grid>

                <Grid item xs={12} className='login_g'>
                  <Button
                    fullWidth
                    className="rgstr_btn"
                    onClick={formik.handleSubmit}
                  >
                    Login
                  </Button>
                </Grid>
                <Typography
                  variant="body1"
                  className="mt-2 rgstr_redirect text-end"
                >
                  Don't have an account?{' '}
                  <span>
                    <Link to="/register">Register</Link>
                  </span>
                </Typography>
              </Grid>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
