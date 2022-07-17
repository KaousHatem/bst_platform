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

import {CategoryAddToolbar} from '../../components/category/category-add-toolbar'
import { DashboardLayout } from '../../components/dashboard-layout';
import frLocale from 'date-fns/locale/fr';

import { format } from 'date-fns'

import CategoryProvider from '../../services/category-provider'



const AddCategory = () => {


  const [errorSBOpen, setErrorSBOpen] = useState(false)

  const [loadingOpen, setLoadingOpen] = useState(false)
  const [errorSBText, setErrorSBText] = useState("")

  const CATEGORY_EXIST_ERROR = "La reference est déja existe"
  const CONNECTION_ERROR = "Probleme de connexion, Veuillez de ressayer"

  const router = useRouter();

  const handleOnSubmit = (e) => {
    e.preventDefault();
    var data = {
      'name':e.target.name.value,
    }
    if (e.target.ref.value){
      data = {
        'ref': e.target.ref.value,
        ...data
      }
    }
    console.log(data)
    setLoadingOpen(true)
    CategoryProvider.addCategory(data).then(
      (response) => {
        setLoadingOpen(false)
        router.push('/category/');

      },
      error => {
        if(error.response.status===409){
          setLoadingOpen(false)
          handleSBOpen(CATEGORY_EXIST_ERROR)
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
        EURL BST | AJOUTER UNE CATEGORIE
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
        <CategoryAddToolbar/>
        <Box sx={{ 
          mt: 3 ,
          backgroundColor: "white",
        }}>
          <Card>
            <CardContent>
              <Box >
                <form id="add-category-form" 
                onSubmit={(event) => handleOnSubmit(event)}>
                  <Grid container 
                  spacing={1} 
                  columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item 
                    xs={6}>
                      <InputLabel>
                        Reference
                      </InputLabel>
                      <TextField
                        fullWidth
                        margin="normal"
                        name="ref"
                        type="text"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item 
                    xs={6}>
                      <InputLabel>
                        Nom du Category 
                      </InputLabel>
                      <TextField
                        fullWidth
                        margin="normal"
                        name="name"
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

AddCategory.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default AddCategory;
