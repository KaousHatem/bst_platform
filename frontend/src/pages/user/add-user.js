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
  CircularProgress,
  Snackbar,
  Alert,
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

const AddUser = () => {

  const [value, setValue] = useState(new Date());
  const [locationValue, setLocationValue] = useState("");
  const [locations, setLocations] = useState([])
  const [roleValue, setRoleValue] = useState("");

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

  const router = useRouter();

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
      fullname: e.target.fullName.value,
      group:roleValue,
      role:roleValue,
      location: locationValue
    }
    setLoadingOpen(true)
    UserProvider.addUser(data).then(
      (response) => {
        router.push('/user');
        setLoadingOpen(false)
      },
      (error) => {
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
    LocationProvider.getLocations().then(
        (response) => {
          setLocations(response.data)
          setLoadingOpen(false)
        },(error) => {
          setLoadingOpen(false)
          handleSBOpen(CONNECTION_ERROR)
        }
      )
  },[])
  
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
    <Box
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
                      />
                    </Grid>
                    <Grid item 
                    xs={6}>
                      <InputLabel>
                        Nom et Prénom
                      </InputLabel>
                      <TextField
                        fullWidth
                        margin="normal"
                        name="fullName"
                        type="text"
                        variant="outlined"
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
                        value={roleValue}
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
                        value={locationValue}
                        // selected={locationValue}
                        onChange={handleLocationChange}
                      >
                        {locations.slice(0,locations.length).map((location) => (
                          <MenuItem key={location.id} 
                          value={location.id}>{location.name}</MenuItem>
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
};

AddUser.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default AddUser;
