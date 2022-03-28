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
    console.log(e.target.username.value)
    const data = {
      username: e.target.username.value,
      password: e.target.password.value,
      fullname: e.target.firstName.value + ' ' + e.target.lastName.value,
      group:roleValue,
      role:roleValue,
      location: locationValue
    }

    console.log(data)



    UserProvider.addUser(data).then(
      (response) => {
        alert("done")
        console.log(response.data)
        router.push('/user');
      },
      error => {
        alert(error.message)
      }
      )
  }


  useEffect(() => {
    LocationProvider.getLocations().then(
        (response) => {
          console.log(response.data)
          setLocations(response.data)
        }
      )
  },[])
  
  return (
    <>
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
                        Nom d`&apos;`utilisateur 
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
                        Nom 
                      </InputLabel>
                      <TextField
                        fullWidth
                        margin="normal"
                        name="lastName"
                        type="text"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item 
                    xs={6}>
                      <InputLabel>
                        Prenom
                      </InputLabel>
                      <TextField
                        fullWidth
                        margin="normal"
                        name="firstName"
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
                        // selected={locationValue}
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
