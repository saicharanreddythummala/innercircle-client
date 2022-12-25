import React, { useState, useEffect } from 'react';
import { Button, Grid, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useFormik } from 'formik';
import './register.scss';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { registerApi } from '../../utils/apiCalls';
import Loader from '../../utils/Loader';

export default function Register() {
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

    if (!values.email) {
      errors.email = 'email required';
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
      errors.email = 'Invalid email address';
    }

    if (!values.password) {
      errors.password = 'password required';
    } else if (values.password.length < 8) {
      errors.password = 'password should be more than 8 characters';
    }

    if (!values.confirmPassword) {
      errors.confirmPassword = 'confirm Password required';
    } else if (values.password !== values.confirmPassword) {
      errors.confirmPassword = 'passwords does not match';
    }

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validate,
    onSubmit: async (values) => {
      setloading(true);
      const userData = {
        username: values.username,
        email: values.email,
        password: values.password,
      };

      const { data } = await axios.post(registerApi, userData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (data.status === false) {
        alert(data.msg);
      }
      if (data.status === true) {
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/chat');
      }

      setloading(false);

      navigate('/setAvatar');
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
            <div className="logo">
              <Typography variant="h3" className="text-center">
                InnerCircle
              </Typography>
            </div>
            <div className="rgstr_grid flex-grow-1 d-flex justify-content-center align-items-center">
              <Grid container spacing={3}>
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
                    id="email"
                    fullWidth
                    label="email"
                    variant="outlined"
                    sx={tfOptions}
                    onChange={formik.handleChange}
                    value={formik.values.email}
                  />
                  {formik.errors.email ? (
                    <p className="err_msg">{formik.errors.email}</p>
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
                <Grid item xs={12}>
                  <TextField
                    id="confirmPassword"
                    fullWidth
                    type={'password'}
                    label="confirm password"
                    variant="outlined"
                    sx={tfOptions}
                    onChange={formik.handleChange}
                    value={formik.values.confirmPassword}
                  />
                  {formik.errors.confirmPassword ? (
                    <p className="err_msg">{formik.errors.confirmPassword}</p>
                  ) : null}
                </Grid>
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    className="rgstr_btn"
                    onClick={formik.handleSubmit}
                  >
                    Register
                  </Button>
                </Grid>
                <Typography
                  variant="body1"
                  className="mt-2 rgstr_redirect text-end"
                >
                  Already have an account?{' '}
                  <span>
                    <Link to="/login">Login</Link>
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
