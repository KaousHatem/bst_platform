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

import { ProvisionAddToolbar } from '../../components/provision/provision-add-toolbar';
import { DashboardLayout } from '../../components/dashboard-layout';
import frLocale from 'date-fns/locale/fr';
import { ProvisionAddProduct } from '../../components/provision/provision-add-product';
import { customers } from '../../__mocks__/customers';
import { productPrivision as products } from '../../__mocks__/product-privision';

import { format } from 'date-fns'

import LocationProvider from '../../services/location-provider'
import ProvisionProvider from '../../services/provision-provider'
import ProvisionProductProvider from '../../services/provision-product-provider'
import UserProvider from '../../services/user-provider' 

import UXAccess from '../../utils/ux-access'

const AddProvision = () => {

  const [loading, setLoading] = useState(false)

  const [value, setValue] = React.useState(new Date());
  const [locationValue, setLocationValue] = React.useState("");
  const [locations, setLocations] = useState([])
  const [userLocation, setUserLocation] = useState(null)

  const [selecetedProducts, setSelectedProducts] = useState([])

  const router = useRouter();

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  const handleLocationChange = (newValue) => {
    setLocationValue(newValue.target.value)
  };

  const handleOnSubmit = (e, status) => {
    e.preventDefault();
    const delay_date = format(value,'yyyy-MM-dd')
    const data = {
      destination: locationValue,
      delay: delay_date,
      status: status,
      ref: null
    }
    console.log(locationValue)

    const provision_product_list = []

    ProvisionProvider.addProvision(data).then(
      (response) => {
        
        selecetedProducts.forEach(product => {
          const product_tmp = {
            product: product.data.id,
            provision: response.data.id,
            unit: product.data.unit,
            quantity: product.quantity
          }
          provision_product_list = [ ... provision_product_list, product_tmp]
        })
        ProvisionProductProvider.addProvisionProduct(provision_product_list).then(
          (response) => {
            alert("done")
            console.log(response.data)
            router.push('/provision/list-provision');
          },
          error => {
            alert(error.message)
          }
          )
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
    console.log(userLocation)

    if(!UXAccess.hasAllLocationAccess()){
      UserProvider.getMeUser().then(
        (response) => {
          setLocationValue(response.data.location)
          }
      )
    }

    

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
        <ProvisionAddToolbar isAddPage={true} 
        handleSaveAsDraft={handleOnSubmit} />
        <Box sx={{ 
          mt: 3 ,
          backgroundColor: "white",
        }}>
          <Card>
            <CardContent>
              <Box >
                <form id="add-provision-form" 
                onSubmit={(event) => handleOnSubmit(event,1)}>
                  <Grid container 
                  spacing={1} 
                  columnSpacing={{ 
                    xs: 1, sm: 2, md: 3 }}>
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
                        disabled
                      />
                    </Grid>
                    <Grid item 
                    xs={6}>
                      <InputLabel>
                        Destination de livraison
                      </InputLabel>
                      <Select
                        name="destination"
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
                        disabled={!UXAccess.hasAllLocationAccess()}
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
                        Date de livraison 
                      </InputLabel>
                     
                      <DatePicker
                        name="delay"
                        inputFormat="dd/MM/yyyy"
                        dateFormat="dd/MM/yyyy"
                        value={value}
                        selected={value}
                        onChange={handleChange}        
                        renderInput={(params) => <TextField {...params} 
                          fullWidth 
                          sx={{
                          my: 2
                        }}/>}
                      />
                    </Grid>
                  </Grid>
                </form>

                <ProvisionAddProduct selecetedProducts={selecetedProducts} 
                setSelectedProducts={setSelectedProducts} />
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  </>
  );
};

AddProvision.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default AddProvision;
