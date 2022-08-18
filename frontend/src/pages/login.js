import Head from 'next/head';
import React, { Component } from "react";
import { useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { 
  Box, 
  Button, 
  Container, 
  Grid, 
  Link, 
  TextField, 
  Typography,
  Snackbar,
  Alert,
  Backdrop,
  CircularProgress,
} from '@mui/material';

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

  const [errorSBOpen, setErrorSBOpen] = useState(false)

  const [loadingOpen, setLoadingOpen] = useState(false)
  const [errorSBText, setErrorSBText] = useState("")

  const CONNECTION_ERROR = "Probleme de connexion, Veuillez de ressayer"
  
  
  


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
    setLoadingOpen(true)
    AuthProvider.login(username, password).then(
      (response) => {
        const returnUrl = router.query.returnUrl || '/';
        router.push(returnUrl);
        setLoadingOpen(false)  
      },
      error => {
        if(error.response.status===400){
          handleSBOpen(error.response.data.error)
          setLoadingOpen(false)
        }else{
          handleSBOpen(CONNECTION_ERROR)
          setLoadingOpen(false)
        }

        setLoading(false)
      }
    );
   
  }

  const handleSBClose = () => {
    setErrorSBOpen(false)
  }

  const handleSBOpen = (text) => {
    setErrorSBText(text)
    setErrorSBOpen(true)
  }


  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loadingOpen}
        onClick={()=>{setLoadingOpen(false)}}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
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
                EURL BST PLATFORM
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
        <Snackbar open={errorSBOpen} 
        onClose={handleSBClose}>
          <Alert variant="filled" 
          severity="error">
            {errorSBText}
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
  
}
export default Login;
