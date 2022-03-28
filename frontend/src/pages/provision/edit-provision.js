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
import ProductProvider from '../../services/product-provider'
import ProvisionProvider from '../../services/provision-provider'
import ProvisionProductProvider from '../../services/provision-product-provider'
import UserProvider from '../../services/user-provider' 

import UXAccess from '../../utils/ux-access'


const EditProvision = () => {

  const [value, setValue] = React.useState(new Date());
  const [locations, setLocations] = useState([])
  const [locationValue, setLocationValue] = React.useState(false);
  const [oldProducts, setOldProducts] = useState([])
  const [products, setProducts] = useState([])

  const [successUpdate, setSuccessUpdate] = useState(true)
  

  const router = useRouter();
  const [provisionId, setProvisionId] = useState(router.query.provisionId)
  const [provision, setProvision] = useState({})

  const handleChange = (newValue) => {
    setProvision({...provision,'delay':format(newValue,'yyyy-MM-dd')});
  };

  const handleLocationChange = (newValue) => {
    setProvision({...provision,'destination':newValue.target.value})
  };

  const handleOnSubmit = (e, status) => {
    e.preventDefault();
    const data = {
      destination: provision.destination,
      delay: provision.delay,
      status: status,
      ref: null
    }
    

    const provision_product_list = []

    ProvisionProvider.editProvision(data,provisionId ).then(
      (response) => {
        console.log(response.data)
       
      },
      error => {
        setSuccessUpdate(false)
        alert(error.message)
      }
      )
    console.log(oldProducts)
    products.forEach((product) => {
      if (product.provisionProductId !== undefined){
        // const product_tmp = oldProducts.filter((item => {
        //   return(item.provisionProductId === product.provisionProductId)}))[0]
        const provisionProduct_tmp = {
          product: product.data.id,
          provision: provisionId,
          unit: product.data.unit,
          quantity: product.quantity
        }
        ProvisionProductProvider.editProvisionProduct(provisionProduct_tmp, product.provisionProductId).then(
          (response) => {
            // alert("done")
            console.log(response.data)
            // router.push('/provision/list-provision');
          },
          error => {

            setSuccessUpdate(false)
            alert(error.message)
          }
          )
            // do the update
      
      }else {

        const provisionProduct_tmp = {
            product: product.data.id,
            provision: provisionId,
            unit: product.data.unit,
            quantity: product.quantity
          }
        provision_product_list = [ ... provision_product_list, provisionProduct_tmp]
        // add the product
      }
    })
    if (provision_product_list.length){
      ProvisionProductProvider.addProvisionProduct(provision_product_list).then(
        (response) => {
          // alert("done")
          console.log(response.data)
          // router.push('/provision/list-provision');
        },
        error => {
          setSuccessUpdate(false)
          alert(error.message)
        }
        )
    }
    const deleted_product = oldProducts.filter((row) => {return(!products.includes(row))})
    if(deleted_product.length){
      deleted_product.forEach((product) => {
        ProvisionProductProvider.deleteProvisionProduct(product.provisionProductId).then(
          (response) => {
            console.log('provision_product '+product.provisionProductId.toString()+' deleted successfully')
          },
          (error) => {
            setSuccessUpdate(false)
            alert(error.message)
          }
          )
      })
    }
    if(successUpdate){
      alert("done")
      router.push('/provision/list-provision');
    }

  }

  const handleApprove = () => {
    const data = {
      destination: provision.destination,
      delay: provision.delay,
      status: '9',
      ref: null
    }
    ProvisionProvider.approveProvision(provisionId).then(
      (response) => {
        alert("done")
        router.push('/provision/list-provision');
      },
      (error) => {
        alert("error")
      })
  }
  const handleReject = () => {
    const data = {
      destination: provision.destination,
      delay: provision.delay,
      status: '4',
      ref: null
    }
    ProvisionProvider.editProvision(data, provisionId).then(
      (response) => {
        alert("done")
        router.push('/provision/list-provision');
      },
      (error) => {
        alert("error")
      })
  }


  useEffect(  () => {
    LocationProvider.getLocations().then(
        (response) => {
          console.log(response.data)
          setLocations(response.data)
        }
      )
    if(provisionId && JSON.stringify(provision) === "{}"){
      ProvisionProvider.getProvisions(provisionId).then(
        (response) => {
          setProvision(response.data)
          console.log(response.data)
          const product_list = response.data.provisionProducts.map((provisionProduct) => {
            return ({data:provisionProduct.product,quantity:provisionProduct.quantity, provisionProductId:provisionProduct.id})
          })
          setOldProducts(product_list)
          setProducts(product_list)
        },
        (error) => {
          console.log(error)
        }
        )
    }


    
  },[])

  
  return (
    <>
    <Head>
      <title>
        EURL BST | EDITER DEMANDE APPRO
      </title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      { JSON.stringify(provision) !== "{}" && <Container maxWidth={false}>
        <ProvisionAddToolbar handleReject={handleReject} 
          handleApprove={handleApprove} 
          provisionStatus={provision.status} 
          provisionId={provisionId} 
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
                        value={provision.ref}
                        disabled
                      />
                    </Grid>
                    <Grid item 
                    xs={6}>
                      <InputLabel>
                        Destination de livraison
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        name="destination"
                        fullWidth
                        margin="normal"
                        label="destination"
                        
                        sx={{
                          my: 2
                        }} 
                        value={provision.destination !== undefined && provision.destination}
                        onChange={handleLocationChange}
                        disabled={provision.status!=="0" || !UXAccess.hasAllLocationAccess()}
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
                        value={provision.delay}
                        selected={provision.delay}
                        onChange={handleChange}        
                        renderInput={(params) => <TextField {...params} 
                        fullWidth 
                        sx={{
                          my: 2
                        }}/>}
                        disabled={provision.status!=="0"}
                      />
                    </Grid>
                  </Grid>
                </form>

                <ProvisionAddProduct selecetedProducts={products} 
                setSelectedProducts={setProducts} 
                isDraft={provision.status==='0'}/>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>}
    </Box>
  </>
  );
};

EditProvision.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default EditProvision;
