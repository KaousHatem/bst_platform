import Head from 'next/head';
import React, { Component } from "react";
import { useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Container, Grid, Link, TextField, Typography } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Facebook as FacebookIcon } from '../icons/facebook';
import { Google as GoogleIcon } from '../icons/google';

import AuthProvider from '../services/auth-provider'



const Login = (props) => {

 

  const router = useRouter();
 
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  
  // const router = useRouter();
    /*const formik = useFormik({
      initialValues: {
        username: '',
        password: ''
      },
      validationSchema: Yup.object({
        username: Yup
          .string()
          .max(255)
          .required(
            'Email is required'),
        password: Yup
          .string()
          .max(255)
          .required(
            'Password is required')
      }),
      onSubmit: (values) => {
        //AuthProvider.login(values.username,values.password)
        console.log(values.username)
        router.push('/');
      }
    });*/
  


  const onChangeUsername = (e) =>{
    setUsername(e.target.value)
  }

  const onChangePassword = (e) => {
    setPassword(e.target.value)
  }

  const handleLogin = (e) => {
    e.preventDefault();
    
    setMessage("")
    setLoading(true)

    //form.validateAll();
    AuthProvider.login(username, password).then(
      (response) => {
        // console.log(response)
        const returnUrl = router.query.returnUrl || '/';
        router.push(returnUrl);  
      },
      error => {
        
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.error) ||
          error.message ||
          error.toString();
        console.log(resMessage)
        setMessage(resMessage)
        setLoading(false)
      }
    );
    
  }
  return (
    <>
      <Head>
        <title>EURL BST | Connecter</title>
      </Head>
      <Box
        component="main"
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexGrow: 1,
          minHeight: '100%'
        }}
      >
        <Container maxWidth="sm">
          <form onSubmit={handleLogin}>
            <Box sx={{ my: 3 }}>
              <Typography
                // color="textPrimary"
                variant="h4"
                align="center"
                color="#26356B"
                sx = {{
                  letterSpacing:5
                }}
              >
                EURL BST PLATFORMES
              </Typography>
            </Box>
            <InputLabel>
              Nom Utilisateur 
            </InputLabel>
            <TextField
              //error={Boolean(formik.touched.email && formik.errors.email)}
              fullWidth
              margin="normal"
              name="username"
              value={username}
              onChange={onChangeUsername}
              type="username"
              variant="outlined"
              required
            />
            <InputLabel
              sx={{
                mt: 2
              }}
            >
              Mot de pass
            </InputLabel>
            <TextField
              fullWidth
              margin="normal"
              name="password"
              value={password}
              onChange={onChangePassword}
              type="password"
              variant="outlined"
              required
              
            />
            <Box sx={{ py: 2, mt: 3}}>
              <Button
                color="primary"
                disabled={loading}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
              >
                Se Connecter
              </Button>
            </Box>
          </form>
        </Container>
      </Box>
    </>
  );
  
}
export default Login;
