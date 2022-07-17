import Head from 'next/head';
import NextLink from 'next/link';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {  
  Select, 
  MenuItem, 
  Box, 
  Button, 
  Container, 
  Grid, 
  Link, 
  TextField, 
  Typography, 
  Card, 
  CardContent, 
  Backdrop,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import {LocalizationProvider, DatePicker, AdapterDateFns} from '@mui/lab'
import InputLabel from '@mui/material/InputLabel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { UserAddToolbar } from '../../components/user/user-add-toolbar';
import { DashboardLayout } from '../../components/dashboard-layout';
import frLocale from 'date-fns/locale/fr';

import { format } from 'date-fns'

import LocationProvider from '../../services/location-provider'
import UserProvider from '../../services/user-provider'

const EditUser = () => {

  const [value, setValue] = useState(new Date());
  const [locationValue, setLocationValue] = useState("");
  const [locations, setLocations] = useState([])
  const [roleValue, setRoleValue] = useState("");

  const router = useRouter();
  const [userId, setUserId] = useState(router.query.id);
  const [user, setUser] = useState({})
  const [loading, SetLoading] = useState(true)

  const [errorSBOpen, setErrorSBOpen] = useState(false)

  const [loadingOpen, setLoadingOpen] = useState(false)
  const [errorSBText, setErrorSBText] = useState("")

  const ALREADY_EXIST_ERROR = "Le nom d'utilisateur est déja existe"
  const CONNECTION_ERROR = "Probleme de connexion, Veuillez de ressayer"

  const roles = [
    {
      id:1,
      name:'Administrateur'
    },
    {
      id:2,
      name:'Administrateur Logistique'
    },
    {
      id:3,
      name:'Magasinier'
    },
  ]



  const handleChange = (newValue) => {
    setValue(newValue);
  };

  const handleRoleChange = (newValue) => {
    setRoleValue(newValue.target.value)
  };

  const handleLocationChange = (newValue) => {
    setLocationValue(newValue.target.value)
  };

  const handleOnSubmit = (e, status) => {
    e.preventDefault();
    const delay_date = format(value,'yyyy-MM-dd')
    const data = {
      username: e.target.username.value,
      password: e.target.password.value,
      fullname: e.target.fullname.value,
      group:roleValue,
      role:e.target.role.value,
      is_active: user.is_active,
      location: locations.filter((location) => {return location.name === locationValue})[0].id
    }


    setLoadingOpen(true)
    UserProvider.updateUser(data,userId).then(
      (response) => {
        setLoadingOpen(false)
        router.push('/user');
      },
      error => {
        if(error.cause.status===409){
          setLoadingOpen(false)
          handleSBOpen(ALREADY_EXIST_ERROR)
        }else{
          setLoadingOpen(false)
          handleSBOpen(CONNECTION_ERROR)
        }
      }
      )
  }

  const handleSBClose = () => {
    setErrorSBOpen(false)
  }

  const handleSBOpen = (text) => {
    setErrorSBText(text)
    setErrorSBOpen(true)
  }


  useEffect(() => {
    setLoadingOpen(true)
    Promise.all([
        LocationProvider.getLocations(),
        userId && UserProvider.getUsers(userId),
      ]).then(
      (responses) => {
        setLocations(responses[0].data)
        setUser(responses[1].data)
        setLocationValue(responses[1].data.location) 
        SetLoading(false)    
        setLoadingOpen(false)    
      },
      (errors)=>{
        setLoadingOpen(false)
        handleSBOpen(CONNECTION_ERROR)
      })
    

  },[userId])
  
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
      <title>
        EURL BST | AJOUTER DEMANDE APPRO
      </title>
    </Head>
    {loading === false && <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth={false}>
        <UserAddToolbar/>
        <Box sx={{ 
          mt: 3 ,
          backgroundColor: "white",
        }}>
          <Card>
            <CardContent>
              <Box >
                <form id="add-user-form" 
                onSubmit={(event) => handleOnSubmit(event,1)}>
                  <Grid container 
                  spacing={1} 
                  columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item 
                    xs={6}>
                      <InputLabel>
                        Nom d&apos;utilisateur 
                      </InputLabel>
                      <TextField
                        fullWidth
                        margin="normal"
                        name="username"
                        type="text"
                        variant="outlined"
                        defaultValue={user.username}
                      />
                    </Grid>
                    <Grid item 
                    xs={6}>
                      <InputLabel>
                        Nom et Prenom
                      </InputLabel>
                      <TextField
                        fullWidth
                        margin="normal"
                        name="fullname"
                        type="text"
                        variant="outlined"
                        defaultValue={user.fullname}
                      />
                    </Grid>
                    <Grid item 
                    xs={6}>
                      <InputLabel>
                        Role
                      </InputLabel>
                      <Select
                        name="role"
                        fullWidth
                        margin="normal"
                        labelId="demo-simple-select-label"
                        id="demo-simple-select" 
                        sx={{
                          my: 2
                        }} 
                        // value={roleValue}
                        defaultValue={user.role}
                        onChange={handleRoleChange}
                      >
                        {roles.slice(0,roles.length).map((role) => (
                          <MenuItem key={role.id} 
                          value={role.id}>{role.name}</MenuItem>
                        ))}
                      </Select>
                    </Grid>
                    <Grid item 
                    xs={6}>
                      <InputLabel>
                        Site
                      </InputLabel>
                      <Select
                        name="site"
                        fullWidth
                        margin="normal"
                        labelId="demo-simple-select-label"
                        id="demo-simple-select" 
                        sx={{
                          my: 2
                        }} 
                        defaultValue={user.location}
                        // selected={locationValue}
                        onChange={handleLocationChange}
                      >
                        {locations.slice(0,locations.length).map((location) => (
                          <MenuItem key={location.name} 
                          value={location.name}>{location.name}</MenuItem>
                        ))}
                      </Select>
                    </Grid>
                    <Grid item 
                    xs={6}>
                      <InputLabel>
                        Mot de pass
                      </InputLabel>
                      <TextField
                        fullWidth
                        margin="normal"
                        name="password"
                        type="text"
                        variant="outlined"
                      />
                    </Grid>
                    
                  </Grid>
                </form>

                
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>
      
    </Box>}
    <Snackbar open={errorSBOpen} 
      onClose={handleSBClose}>
        <Alert variant="filled" 
        severity="error">
          {errorSBText}
        </Alert>
      </Snackbar>
  </>
  );
};

EditUser.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default EditUser;
