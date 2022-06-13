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

import { POAddToolbar } from '../../components/purchase-order/po-add-toolbar';
import { DashboardLayout } from '../../components/dashboard-layout';
import { PurchaseOrderProduct } from '../../components/purchase-order/purchase-order-product';

import { format } from 'date-fns'

import ProvisionProvider from '../../services/provision-provider'
import PurchaseRequestProvider from '../../services/purchase-request-provider'
import POProductProvider from '../../services/po-product-provider'
import PurchaseOrderProvider from '../../services/purchase-order-provider'
import SupplierProvider from '../../services/supplier-provider'


import UXAccess from '../../utils/ux-access'

const AddPurchaseOrder = () => {
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
        setPurchaseProducts(response.data.purchaseReqProducts.map(product=>{
          return {
            id: product.id,
            sku: product.provisionProduct.product.sku,
            name: product.provisionProduct.product.name,
            unit: product.unit.ref,
            quantity: product.quantity,
            unitPrice: null
          }
        }))
        setLoadingOpen(false)
      }
      ,error=>{
        setLoadingOpen(false)
        handleSBOpen(CONNECTION_ERROR)


      })
    
    // const response = await ProvisionProvider.getProductInPurchase(newValue.target.value)


    
    setLoadingOpen(false)
  };



  const handleOnSubmit = (e) => {
    e.preventDefault();
    const data = {
      purchaseRequest: purchaseRequestValue,
      supplier: e.target.supplier.value,
    }
    console.log(data)
    setLoadingOpen(true)
    PurchaseOrderProvider.addPurchaseOrder(data).then(
      response=>{
        
        const data_product = response.data.purchaseOrderProducts.filter(product => {
          return purchaseProducts.find(purchaseProduct=>{return purchaseProduct.id===product.purchaseProduct.id}).unitPrice !== null
        }).map(product=>{
          return {
            id: product.id,
            unitPrice: parseFloat(purchaseProducts.find(purchaseProduct=>{return purchaseProduct.id===product.purchaseProduct.id}).unitPrice+".0")
          }
        })

        if (data_product.length){
          POProductProvider.bulkUpdatePOProduct(data_product).then(
            response=>{
              setLoadingOpen(false)
              router.push('/purchase-order');
              console.log(response.data)
            },
            error=>{
              setLoadingOpen(false)
              router.push('/purchase-order');
              handleSBOpen(CONNECTION_ERROR)
            })
        }else {
          setLoadingOpen(false)
          router.push('/purchase-order');

        }
        

      },
      error=>{
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



  useEffect( async () => {

    setLoadingOpen(true)

    Promise.all([
      PurchaseRequestProvider.getOnlyApprovedPR(),
      SupplierProvider.getSuppliers(),
      purchaseRequestValue && PurchaseRequestProvider.getPurchaseRequests(purchaseRequestValue),
      ]).then(
        responses => {
          setLoadingOpen(false)
          setPurchaseRequests(responses[0].data)
          setSuppliers(responses[1].data)
          if(responses[2]){
            setPurchaseRequest(responses[2].data)
            setPurchaseProducts(responses[2].data.purchaseReqProducts.map(product=>{
              return {
                id: product.id,
                sku: product.provisionProduct.product.sku,
                name: product.provisionProduct.product.name,
                unit: product.unit.ref,
                quantity: product.quantity,
                unitPrice: null
              }
            }))
          }
          

        }
        ,errors => {
          setLoadingOpen(false)
          handleSBOpen(CONNECTION_ERROR)
        }
      )    
  },[])

  useEffect( async () => {
    console.log(purchaseProducts)
  },[purchaseProducts])
  
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
        <POAddToolbar
        id={handleOnSubmit} />
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
                        name="supplier"
                        fullWidth
                        margin="normal"
                        labelId="demo-simple-select-label"
                        id="demo-simple-select" 
                        sx={{
                          my: 2
                        }} 
                        
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


                {purchaseRequest && <PurchaseOrderProduct setPurchaseProducts={setPurchaseProducts} purchaseProducts={purchaseProducts}  />}
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

AddPurchaseOrder.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default AddPurchaseOrder;
