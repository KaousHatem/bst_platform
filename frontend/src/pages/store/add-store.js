import Head from 'next/head';
import NextLink from 'next/link';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {  Select, 
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
  FormControl,

} from '@mui/material';
import {LocalizationProvider, DatePicker, AdapterDateFns} from '@mui/lab'
import InputLabel from '@mui/material/InputLabel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { StoreAddToolbar } from '../../components/store/store-add-toolbar';
import { DashboardLayout } from '../../components/dashboard-layout';

import { format } from 'date-fns'

import StoreProvider from '../../services/store-provider'
import LocationProvider from '../../services/location-provider'
import UserProvider from '../../services/user-provider'

import UXAccess from '../../utils/ux-access'



const AddStore = () => {
  const router = useRouter();
  
  const [errorSBOpen, setErrorSBOpen] = useState(false)

  const [loadingOpen, setLoadingOpen] = useState(false)
  const [errorSBText, setErrorSBText] = useState("")

  const [locations, setLocations] = useState([])
  const [users, setUsers] = useState([])

  
  const CONNECTION_ERROR = "Probleme de connexion, Veuillez de ressayer"



  


  const handleOnSubmit = (e) => {
    e.preventDefault();
    var data = {
      name: e.target.name.value,
      location: e.target.location.value,
      store_manager:e.target.manager.value,

    }

    console.log(data)

    



    setLoadingOpen(true)
    StoreProvider.addStore(data).then(
      (response) => {
        console.log(response.data)
        setLoadingOpen(false)
        router.push('/store');
      },
      error => {
        setLoadingOpen(false)
        handleSBOpen(CONNECTION_ERROR)
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


  useEffect(()=>{
    setLoadingOpen(true)
    Promise.all([
      LocationProvider.getLocations(),
      UserProvider.getUsersShort(),
      ]).then(
      responses=>{
        setLocations(responses[0].data)
        setUsers(responses[1].data)
        setLoadingOpen(false)
      },
      errors=>{
        setLoadingOpen(false)
        handleSBOpen(CONNECTION_ERROR)
      })
    
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
        EURL BST | AJOUTER MAGASIN
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
        <StoreAddToolbar isAddPage={true} 
        handleSaveAsDraft={handleOnSubmit} />
        <Box sx={{ 
          mt: 3 ,
          backgroundColor: "white",
        }}>
          <Card>
            <CardContent>
              <Box sx={{ maxWidth: 500 }}>
                <form id="add-store-form" 
                onSubmit={(event) => handleOnSubmit(event)}>
                  <TextField
                    label="Nom Magasin"
                    fullWidth
                    margin="normal"
                    name="name"
                    type="text"
                    variant="outlined"
                    required
                    sx={{
                        my: 2
                      }} 
                  />
                
                  <FormControl sx={{
                        my: 2
                      }} 
                      fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Site
                    </InputLabel>
                    <Select
                      name="location"
                      fullWidth
                      margin="normal"
                      labelId="demo-simple-select-label"
                      label="Site"
                      id="demo-simple-select" 
                      
                      // value={purchaseRequestValue}
                      // onChange={handlePurchaseRequestChange}

                    >
                      {locations.length && locations.slice(0,locations.length).map((location) => (
                        <MenuItem key={location.id} 
                        value={location.id}>{location.name}</MenuItem>
                      ))|| <MenuItem key={0} 
                        value={0} 
                        disabled>aucun site</MenuItem>}
                    </Select>
                  </FormControl>

                 

                  <FormControl sx={{
                        my: 2
                      }} 
                      fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Responsable
                    </InputLabel>
                    <Select
                      name="manager"
                      fullWidth
                      margin="normal"
                      labelId="demo-simple-select-label"
                      label="Responsable"
                      id="demo-simple-select" 
                      
                      // value={purchaseRequestValue}
                      // onChange={handlePurchaseRequestChange}

                    >
                      {users.length && users.slice(0,users.length).map((user) => (
                        <MenuItem key={user.id} 
                        value={user.id}>{user.fullname}</MenuItem>
                      ))|| <MenuItem key={0} 
                        value={0} 
                        disabled>aucun utilisateur</MenuItem>}
                    </Select>
                  </FormControl>
                  <FormControl sx={{
                        my: 2
                      }} 
                      fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Etat
                    </InputLabel>
                    <Select
                      name="status"
                      fullWidth
                      margin="normal"
                      labelId="demo-simple-select-label"
                      label="Etat"
                      id="demo-simple-select" 
                      
                      // value={purchaseRequestValue}
                      // onChange={handlePurchaseRequestChange}

                    >
                      <MenuItem key={0} 
                        value={true}>ouvert</MenuItem>
                      <MenuItem key={1} 
                        value={false}>fermé</MenuItem>
                    </Select>
                  </FormControl>
                </form>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
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

AddStore.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default AddStore;
