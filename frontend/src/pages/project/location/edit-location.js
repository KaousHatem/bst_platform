import Head from 'next/head';
import NextLink from 'next/link';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {  Select, MenuItem, Box, Button, Container, Grid, Link, TextField, Typography, Card, CardContent, } from '@mui/material';
import {LocalizationProvider, DatePicker, AdapterDateFns} from '@mui/lab'
import InputLabel from '@mui/material/InputLabel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import {LocationAddToolbar} from '../../../components/project/location/location-add-toolbar'
import { DashboardLayout } from '../../../components/dashboard-layout';
import frLocale from 'date-fns/locale/fr';

import { format } from 'date-fns'

import LocationProvider from '../../../services/location-provider'



const EditLocation = () => {

  const [value, setValue] = useState(new Date());
  const [locationValue, setLocationValue] = useState("");
  const [locations, setLocations] = useState([])
  const [roleValue, setRoleValue] = useState("");



  const router = useRouter();
  const [locationId, setLocationId] = useState(router.query.id);
  const [location, setLocation] = useState({})
  const [loading, SetLoading] = useState(true)


  const handleOnSubmit = (e) => {
    e.preventDefault();
    const data = {
      'name':e.target.name.value,
      'city':e.target.city.value,
      'state':e.target.state.value,
      'codePostal':e.target.codePostal.value
    }
    console.log(data)
    LocationProvider.updateLocation(data,locationId).then(
      (response) => {
        alert("done")
        console.log(response.data)
        router.push('/project/location/');
      },
      error => {
        alert(error.message)
      }
      )
  }


  useEffect(() => {

    if(locationId && JSON.stringify(location) === "{}"){
      LocationProvider.getLocations(locationId).then(
        (response) => {
          console.log(response.data)
          setLocation(response.data)
          SetLoading(false)        
        },
        (error) => {
          alert(error.message)
        }
        )
    }
  },[])

  
  return (
    loading === false && 
    <>
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
        <LocationAddToolbar/>
        <Box sx={{ 
          mt: 3 ,
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
                      <InputLabel>
                        Nom du Site
                      </InputLabel>
                      <TextField
                        fullWidth
                        margin="normal"
                        name="name"
                        type="text"
                        variant="outlined"
                        defaultValue={location.name}
                      />
                    </Grid>
                    <Grid item 
                    xs={6}>
                      <InputLabel>
                        Ville 
                      </InputLabel>
                      <TextField
                        fullWidth
                        margin="normal"
                        name="city"
                        type="text"
                        variant="outlined"
                        defaultValue={location.city}
                      />
                    </Grid>
                    <Grid item 
                    xs={6}>
                      <InputLabel>
                        Wilaya
                      </InputLabel>
                      <TextField
                        fullWidth
                        margin="normal"
                        name="state"
                        type="text"
                        variant="outlined"
                        defaultValue={location.state}
                      />
                    </Grid>
                    <Grid item 
                    xs={6}>
                      <InputLabel>
                        Code Postale
                      </InputLabel>
                      <TextField
                        fullWidth
                        margin="normal"
                        name="codePostal"
                        type="text"
                        variant="outlined"
                        defaultValue={location.codePostal}
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
  </>
  );
};

EditLocation.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default EditLocation;
