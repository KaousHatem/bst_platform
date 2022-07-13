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
  FormControl,
} from '@mui/material';

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

  const [errorSBOpen, setErrorSBOpen] = useState(false)

  const [loadingOpen, setLoadingOpen] = useState(false)
  const [errorSBText, setErrorSBText] = useState("")


  const CONNECTION_ERROR = "Probleme de connexion, Veuillez de ressayer"
  const NO_PRODUCT_ERROR = "Veuillez de selectioner au moin un article"




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

    const add_provision_product_list = products.filter((product)=>{return product.provisionProductId === undefined})
                                            .map((product)=>{return {
                                                product: product.data.id,
                                                provision: provisionId,
                                                unit: product.unit,
                                                quantity: product.quantity
                                            }})


    const edit_provision_product_list = products.filter((product)=>{
                                                                        const oldProduct = oldProducts.find(oldProduct=>{return oldProduct.provisionProductId === product.provisionProductId})
                                                                        if (oldProduct !== undefined){
                                                                          return product.unit !== oldProduct.unit || product.quantity !== oldProduct.quantity
                                                                        }
                                                                      })
                                            .map((product)=>{return {
                                              id: product.provisionProductId,
                                              product: product.data.id,
                                              provision: provisionId,
                                              unit: product.unit,
                                              quantity: product.quantity
                                            }})

 

    const delete_provision_product_list = oldProducts.filter((oldProduct)=>{return !products.map(product=>{return product.provisionProductId})
                                                                                              .includes(oldProduct.provisionProductId)}) 
                                                        .map(oldProduct=>{return oldProduct.provisionProductId})       
    
    if(products.length){
      setLoadingOpen(true)                                                   
      Promise.all([
        ProvisionProvider.editProvision(data,provisionId ),
        add_provision_product_list.length && ProvisionProductProvider.addProvisionProduct(add_provision_product_list),
        edit_provision_product_list.length && ProvisionProductProvider.bulkUpdateProvisionProduct(edit_provision_product_list),
        delete_provision_product_list.length && ProvisionProductProvider.bulkDeleteProvisionProduct(delete_provision_product_list)
        ]).then(
        (responses)=>{
          console.log(responses)
          setLoadingOpen(false)
          router.push('/provision');
        },
        (errors)=>{
          setLoadingOpen(false)
          handleSBOpen(CONNECTION_ERROR)
        })
    }else{
      handleSBOpen(NO_PRODUCT_ERROR)
    }
  }


    

  const handleApprove = () => {
    const data = {
      destination: provision.destination,
      delay: provision.delay,
      status: '9',
      ref: null
    }
    setLoadingOpen(true) 
    ProvisionProvider.approveProvision(provisionId).then(
      (response) => {
        setLoadingOpen(false)
        router.push('/provision');
      },
      (error) => {
        setLoadingOpen(false)
        handleSBOpen(CONNECTION_ERROR)
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
        setLoadingOpen(false)
        router.push('/provision');
      },
      (error) => {
        setLoadingOpen(false)
        handleSBOpen(CONNECTION_ERROR)
      })
  }


  const handleSBClose = () => {
    setErrorSBOpen(false)
  }

  const handleSBOpen = (text) => {
    setErrorSBText(text)
    setErrorSBOpen(true)
  }


  useEffect(  () => {
    setLoadingOpen(true)
    Promise.all([
      LocationProvider.getLocations(),
      (provisionId) && ProvisionProvider.getProvisions(provisionId)
      ]).then(
      responses=>{
        setLocations(responses[0].data)
        console.log(responses)
        if(responses[1]){
          setProvision(responses[1].data)
          setOldProducts(responses[1].data.provisionProducts.map((provisionProduct) => {
            return ({
              data:provisionProduct.product,
              quantity:provisionProduct.quantity, 
              provisionProductId:provisionProduct.id, 
              unit: provisionProduct.unit.ref
            })
          }))
          setProducts(responses[1].data.provisionProducts.map((provisionProduct) => {
            return ({
              data:provisionProduct.product,
              quantity:provisionProduct.quantity, 
              provisionProductId:provisionProduct.id, 
              unit: provisionProduct.unit.ref
            })
          }))
        }
        setLoadingOpen(false)
      },
      errors=>{
        console.log(errors)
        setLoadingOpen(false)
        handleSBOpen(CONNECTION_ERROR)
      }
      )
  },[provisionId])

  
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
                      <TextField
                        fullWidth
                        label="Reference"
                        margin="dense"
                        name="ref"
                        type="text"
                        variant="outlined"
                        value={provision.ref}
                        disabled
                      />
                    </Grid>
                    <Grid item 
                    xs={6}>
                      <FormControl
                        fullWidth
                        sx={{
                            my: 1
                          }}
                      >
                        <InputLabel id="demo-simple-select-label">Destination de livraison *</InputLabel>
                        <Select
                          labelId="demo-simple-select-standard-label"
                          label="Destination de livraison *"
                          id="demo-simple-select-standard"
                          name="destination"
                          fullWidth
                          margin="dense"
                          value={provision.destination}
                          onChange={handleLocationChange}
                          disabled={provision.status!=="0" || !UXAccess.hasAllLocationAccess()}
                          required
                        >
                          {locations.slice(0,locations.length).map((location) => (
                            <MenuItem key={location.name} 
                            value={location.name}>{location.name}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item 
                    xs={6}>
                      <DatePicker
                        name="delay"
                        label="Date de livraison *"
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
                        required
                        disablePast
                      />
                    </Grid>
                  </Grid>
                  <Grid container 
                  spacing={1} 
                  columnSpacing={{ 
                    xs: 1, sm: 2, md: 3 }}>
                    <Grid item
                      xs={3}>
                        <InputLabel>
                          Cree par
                        </InputLabel>
                        <Typography
                        sx={{
                            my: 2
                          }} >
                          {provision.created_by.username}
                        </Typography>
                      </Grid>
                      <Grid item
                      xs={3}>
                        <InputLabel>
                          Cree en
                        </InputLabel>
                        <Typography
                        sx={{
                            my: 2
                          }} >
                          {format(new Date(provision.created_on),'yyyy-MM-dd hh:mm')}
                        </Typography>
                      </Grid>
                      <Grid item
                      xs={3}>
                        <InputLabel>
                          Apprové par
                        </InputLabel>
                        <Typography
                        sx={{
                            my: 2
                          }} >
                          {provision.approved_by === null && "_" || provision.approved_by.username}
                        </Typography>
                      </Grid>
                      
                      <Grid item
                      xs={3}>
                        <InputLabel>
                          Apprové en
                        </InputLabel>
                        <Typography
                        sx={{
                            my: 2
                          }} >
                          {provision.approved_on === null && "_" || format(new Date(provision.approved_on),'yyyy-MM-dd hh:mm')}
                        </Typography>
                      </Grid>
                    </Grid>
                </form>

                <ProvisionAddProduct selectedProducts={products} 
                setSelectedProducts={setProducts} 
                isDraft={provision.status==='0'}/>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>}
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

EditProvision.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default EditProvision;
