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

} from '@mui/material';
import {LocalizationProvider, DatePicker, AdapterDateFns} from '@mui/lab'
import InputLabel from '@mui/material/InputLabel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { SupplierAddToolbar } from '../../components/supplier/supplier-add-toolbar';
import { DashboardLayout } from '../../components/dashboard-layout';

import { format } from 'date-fns'

import SupplierProvider from '../../services/supplier-provider'


import UXAccess from '../../utils/ux-access'



const AddSupplier = () => {
  const router = useRouter();
  
  const [errorSBOpen, setErrorSBOpen] = useState(false)

  const [loadingOpen, setLoadingOpen] = useState(false)
  const [errorSBText, setErrorSBText] = useState("")

  
  const CONNECTION_ERROR = "Probleme de connexion, Veuillez de ressayer"



  


  const handleOnSubmit = (e) => {
    e.preventDefault();
    var data = {
      name: e.target.name.value,
      register_number: e.target.registerNumber.value,
    }

    e.target.address.value ? data.address = e.target.address.value : undefined
    e.target.city.value ? data.city = e.target.city.value : undefined
    e.target.state.value ? data.state = e.target.state.value : undefined
    e.target.codePostal.value ? data.code_postal = e.target.codePostal.value : undefined
    e.target.number.value ? data.number = e.target.number.value : undefined
    e.target.email.value ? data.email = e.target.email.value : undefined



    
    SupplierProvider.addSupplier(data).then(
      (response) => {
        console.log(response.data)
        setLoadingOpen(false)
        router.push('/supplier');
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
        EURL BST | AJOUTER FOURNISSEUR
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
        <SupplierAddToolbar isAddPage={true} 
        handleSaveAsDraft={handleOnSubmit} />
        <Box sx={{ 
          mt: 3 ,
          backgroundColor: "white",
        }}>
          <Card>
            <CardContent>
              <Box >
                <form id="add-supplier-form" 
                onSubmit={(event) => handleOnSubmit(event)}>
                  <Grid container 
                  spacing={1} 
                  columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item 
                    xs={6}>
                      {/*<InputLabel>
                        Nom du Fournisseur
                      </InputLabel>*/}
                      <TextField
                        label="Nom du Fournisseur"
                        fullWidth
                        margin="normal"
                        name="name"
                        type="text"
                        variant="outlined"
                        required
                      />
                    </Grid>
                    <Grid item 
                    xs={6}>
                      {/*<InputLabel>
                        Registre du commerce 
                      </InputLabel>*/}
                      <TextField
                        label="Registre du commerce"
                        fullWidth
                        margin="normal"
                        name="registerNumber"
                        type="text"
                        variant="outlined"
                        required
                      />
                    </Grid>
                    <Grid item 
                    xs={6}>
                      {/*<InputLabel>
                        Addresse
                      </InputLabel>*/}
                      <TextField
                        label="Addresse"
                        fullWidth
                        margin="normal"
                        name="address"
                        type="text"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item 
                    xs={6}>
                      {/*<InputLabel>
                        Ville
                      </InputLabel>*/}
                      <TextField
                        label="Ville"
                        fullWidth
                        margin="normal"
                        name="city"
                        type="text"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item 
                    xs={6}>
                      {/*<InputLabel>
                        Wilaya
                      </InputLabel>*/}
                      <TextField
                        label="Wilaya"
                        fullWidth
                        margin="normal"
                        name="state"
                        type="text"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item 
                    xs={6}>
                      {/*<InputLabel>
                        Code Postale
                      </InputLabel>*/}
                      <TextField
                        label="Code Postale"
                        fullWidth
                        margin="normal"
                        name="codePostal"
                        type="text"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item 
                    xs={6}>
                      {/*<InputLabel>
                        Email
                      </InputLabel>*/}
                      <TextField
                        label="Email"
                        fullWidth
                        margin="normal"
                        name="email"
                        type="email"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item 
                    xs={6}>
                      {/*<InputLabel>
                        Numero Telephone
                      </InputLabel>*/}
                      <TextField
                        label="Numero Telephone"
                        fullWidth
                        margin="normal"
                        name="number"
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

AddSupplier.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default AddSupplier;
