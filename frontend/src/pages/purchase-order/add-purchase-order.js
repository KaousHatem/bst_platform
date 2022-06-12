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

import { PRAddToolbar } from '../../components/purchase-request/pr-add-toolbar';
import { DashboardLayout } from '../../components/dashboard-layout';
import { PRAddProduct } from '../../components/purchase-request/pr-add-product';

import { format } from 'date-fns'

import ProvisionProvider from '../../services/provision-provider'
import PurchaseRequestProvider from '../../services/purchase-request-provider'
import PRProductProvider from '../../services/pr-product-provider'
import PurchaseOrderProvider from '../../services/purchase-order-provider'
import SupplierProvider from '../../services/supplier-provider'

import UXAccess from '../../utils/ux-access'

const AddPurchaseRequest = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false)

  const [purchaseRequestValue, setPurchaseRequestValue] = useState(router.query.id && parseInt(router.query.id) || undefined)
  

  const [purchaseRequests, setPurchaseRequests] = useState([])
  const [purchaseProducts, setPurchaseProducts] = useState([])
  const [purchaseRequest, setPurchaseRequest] = useState()

  const [suppliers, setSuppliers] = useState([])
  
  // const [provisions, setProvisions] = useState([])
  // const [provisionProducts, setProvisionProducts] = useState([])

  // const [selecetedProducts, setSelectedProducts] = useState([])
  // const [productInPurchase, setProductInPurchase] = useState([])
  
  const [errorSBOpen, setErrorSBOpen] = useState(false)

  const [loadingOpen, setLoadingOpen] = useState(false)
  const [errorSBText, setErrorSBText] = useState("")

  // const [doneModeProducts, setDoneModeProducts] = useState([])
  
  const CONNECTION_ERROR = "Probleme de connexion, Veuillez de ressayer"



  const handlePurchaseRequestChange = async (newValue) => {
    setLoadingOpen(true)
    setPurchaseRequestValue(newValue.target.value)

    setLoadingOpen(true)
    PurchaseRequestProvider.getPurchaseRequests(newValue.target.value).then(
      response=>{
        console.log(response.data)
        setPurchaseRequest(response.data)
        setLoadingOpen(false)
      }
      ,error=>{
        setLoadingOpen(false)
        handleSBOpen(CONNECTION_ERROR)


      })
    
    // const response = await ProvisionProvider.getProductInPurchase(newValue.target.value)


    
    setLoadingOpen(false)
  };



  const handleOnSubmit = (e, status) => {
    e.preventDefault();
    // const data = {ProvisionProvider
    //   provision: purchaseRequestValue,
    //   status: status,
    //   ref: null
    // }

    // console.log(selecetedProducts)
    // if(selecetedProducts.length === 0 ){
    //   handleSBOpen("Veuillez ajouter les articles!")
    // } else{
    //   const pr_product_list = []
    //   setLoadingOpen(true)
    //   PurchaseRequestProvider.addPurchaseRequest(data).then(
    //     (response) => {
          
    //       selecetedProducts.forEach(product => {
    //         const product_tmp = {
    //           provisionProduct: product.productProvision.id,
    //           purchaseRequest: response.data.id,
    //           unit: product.unit,
    //           quantity: product.quantity
    //         }
    //         pr_product_list = [ ... pr_product_list, product_tmp]
    //       })
    //       console.log(pr_product_list)
    //       PRProductProvider.addPRProduct(pr_product_list).then(
    //         (response) => {
    //           console.log(response.data)
    //           setLoadingOpen(false)
    //           router.push('/purchase-request');
    //         },
    //         error => {
    //           setLoadingOpen(false)
    //           handleSBOpen(CONNECTION_ERROR)
    //           alert(error.message)
    //         }
    //         )
    //     },
    //     error => {
    //       setLoadingOpen(false)
    //       handleSBOpen(CONNECTION_ERROR)
    //       alert(error.message)
    //     }
    //     )
    // }
  }

  const handleSBClose = () => {
    setErrorSBOpen(false)
  }

  const handleSBOpen = (text) => {
    setErrorSBText(text)
    setErrorSBOpen(true)
  }


  useEffect( async () => {
    setLoadingOpen(true)

    Promise.all([
      PurchaseRequestProvider.getOnlyApprovedPR(),
      SupplierProvider.getSuppliers(),
      ]).then(
        responses => {
          setLoadingOpen(false)
          setPurchaseRequests(responses[0].data)
          setSuppliers(responses[1].data)
        }
        ,errors => {
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
        EURL BST | AJOUTER BON DE COMMANDE
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
        {/*<PRAddToolbar isAddPage={true} 
        handleSaveAsDraft={handleOnSubmit} />*/}
        <Box sx={{ 
          mt: 3 ,
          backgroundColor: "white",
        }}>
          <Card>
            <CardContent>
              <Box >
                <form id="add-purchase-order-form" 
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
                        Reference De la demande d'achat
                      </InputLabel>
                      <Select
                        name="purchaseRequest"
                        fullWidth
                        margin="normal"
                        labelId="demo-simple-select-label"
                        id="demo-simple-select" 
                        sx={{
                          my: 2
                        }} 
                        value={purchaseRequestValue}
                        onChange={handlePurchaseRequestChange}

                      >
                        {purchaseRequests.length && purchaseRequests.slice(0,purchaseRequests.length).map((purchaseRequest) => (
                          <MenuItem key={purchaseRequest.ref} 
                          value={purchaseRequest.id}>{purchaseRequest.ref}</MenuItem>
                        ))|| <MenuItem key={0} 
                          value={0} disabled>aucune demande d'achat</MenuItem>}
                      </Select>
                    </Grid>
                    <Grid item 
                    xs={6}>
                      <InputLabel>
                        Fournisseur
                      </InputLabel>
                      <Select
                        name="provision"
                        fullWidth
                        margin="normal"
                        labelId="demo-simple-select-label"
                        id="demo-simple-select" 
                        sx={{
                          my: 2
                        }} 
                        // value={supplierValue}
                        // onChange={handleSupplierChange}

                      >
                        {suppliers.length && suppliers.slice(0,suppliers.length).map((supplier) => (
                          <MenuItem key={supplier.id} 
                          value={supplier.id}>{supplier.name}</MenuItem>
                        ))|| <MenuItem key={0} 
                          value={0} disabled>aucun fournisseur</MenuItem>}
                      </Select>
                    </Grid>
                    <Grid item
                    xs={4}>
                      <InputLabel>
                        Reference de la demande d'appro
                      </InputLabel>
                      <Typography
                      sx={{
                          my: 2
                        }} >
                        {purchaseRequest && purchaseRequest.provision.ref || "_"}
                      </Typography>
                    </Grid>
                    <Grid item
                    xs={4}>
                      <InputLabel>
                        Destination
                      </InputLabel>
                      <Typography
                      sx={{
                          my: 2
                        }} >
                        {purchaseRequest && purchaseRequest.provision.destination || "_"}
                      </Typography>
                    </Grid>
                    <Grid item
                    xs={4}>
                      <InputLabel>
                        Delai
                      </InputLabel>
                      <Typography
                      sx={{
                          my: 2
                        }} >
                        {purchaseRequest && purchaseRequest.provision.delay || "_"}
                      </Typography>
                    </Grid>
                    <Grid item
                    xs={4}>
                      <InputLabel>
                        Demandeur
                      </InputLabel>
                      <Typography
                      sx={{
                          my: 2
                        }} >
                        {purchaseRequest && purchaseRequest.provision.created_by.username || "_"}
                      </Typography>
                    </Grid>
                  </Grid>
                </form>


                {/*<PurchaseOrderProduct selecetedProducts={selecetedProducts} 
                setSelectedProducts={setSelectedProducts}
                provisionProducts = {provisionProducts}
                productInPurchase = {productInPurchase}
                doneModeProducts = {doneModeProducts}
                setDoneModeProducts = {setDoneModeProducts} />*/}
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

AddPurchaseRequest.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default AddPurchaseRequest;
