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
import { LocalizationProvider, DatePicker, AdapterDateFns } from '@mui/lab'
import InputLabel from '@mui/material/InputLabel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { LocationAddToolbar } from '../../../components/project/location/location-add-toolbar'
import { DashboardLayout } from '../../../components/dashboard-layout';
import frLocale from 'date-fns/locale/fr';

import { format } from 'date-fns'

import LocationProvider from '../../../services/location-provider'



const AddLocation = () => {


  const [errorSBOpen, setErrorSBOpen] = useState(false)

  const [loadingOpen, setLoadingOpen] = useState(false)
  const [errorSBText, setErrorSBText] = useState("")


  const CONNECTION_ERROR = "Probleme de connexion, Veuillez de ressayer"


  const router = useRouter();

  const handleOnSubmit = (e) => {
    e.preventDefault();
    const data = {
      'name': e.target.name.value,
      'address': e.target.address.value,
      'city': e.target.city.value,
      'state': e.target.state.value,
      'codePostal': e.target.codePostal.value
    }

    setLoadingOpen(true)
    LocationProvider.addLocation(data).then(
      (response) => {
        setLoadingOpen(false)
        router.push('/project/location/');

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
        onClick={() => { setLoadingOpen(false) }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Head>
        <title>
          EURL BST | AJOUTER UN SITE
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
          <LocationAddToolbar />
          <Box sx={{
            mt: 3,
            backgroundColor: "white",
          }}>
            <Card>
              <CardContent>
                <Box >
                  <form id="add-location-form"
                    onSubmit={(event) => handleOnSubmit(event)}>
                    <Grid container
                      spacing={1}
                      columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                      <Grid item
                        xs={6}>
                        <TextField
                          fullWidth
                          label="Nom du Site"
                          margin="normal"
                          name="name"
                          type="text"
                          variant="outlined"
                          required
                        />
                      </Grid>
                      <Grid item
                        xs={6}>
                        <TextField
                          fullWidth
                          label="Ville"
                          margin="normal"
                          name="city"
                          type="text"
                          variant="outlined"
                          required
                        />
                      </Grid>
                      <Grid item
                        xs={6}>
                        <TextField
                          fullWidth
                          label="Wilaya"
                          margin="normal"
                          name="state"
                          type="text"
                          variant="outlined"
                          required
                        />
                      </Grid>
                      <Grid item
                        xs={6}>
                        <TextField
                          fullWidth
                          label="Code Postale"
                          margin="normal"
                          name="codePostal"
                          type="text"
                          variant="outlined"
                          required
                        />
                      </Grid>
                      <Grid item
                        xs={12}>
                        <TextField
                          fullWidth
                          label="Adresse"
                          margin="normal"
                          name="address"
                          type="text"
                          variant="outlined"
                          required
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

AddLocation.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default AddLocation;
