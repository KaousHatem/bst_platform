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
  FormControl,

} from '@mui/material';
import {LocalizationProvider, DatePicker, AdapterDateFns} from '@mui/lab'
import InputLabel from '@mui/material/InputLabel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { StockInitAddToolbar } from '../../components/stock-init/stock-init-add-toolbar';
import {ProductSelectDialog} from '../../components/stock-init/product-select-dialog'
import { DashboardLayout } from '../../components/dashboard-layout';

import { format } from 'date-fns'

import StockProvider from '../../services/stock-provider'
import StockInitProvider from '../../services/stock-init-provider'
import ProductProvider from '../../services/product-provider'

import UXAccess from '../../utils/ux-access'



const AddStockInit = () => {
  const router = useRouter();
  
  const [errorSBOpen, setErrorSBOpen] = useState(false)

  const [loadingOpen, setLoadingOpen] = useState(false)
  const [errorSBText, setErrorSBText] = useState("")

  const [storeId, setStoreId] = useState(router.query.storeId && parseInt(router.query.storeId) || undefined)
  const [stockId, setStockId] = useState(router.query.stockId && parseInt(router.query.stockId) || undefined)


  const [ selectedProduct, setSelectedProduct] = useState()

  const [open, setOpen] = React.useState(false);

  
  const CONNECTION_ERROR = "Probleme de connexion, Veuillez de ressayer"
  const STOCK_EXIST_ERROR = "Cette article existe dans ce magasin"
  const PRODUCT_NOT_SELECTED_ERROR = "Veuillez de selectionner un article"



  const handleClickOpen = () => {
    setOpen(true);
  };


  const handleOnSubmit = (e) => {
    e.preventDefault();

    if(storeId){

      if (selectedProduct){
        var data = {
          product: selectedProduct.id,
          quantity: e.target.quantity.value,
          price:e.target.price.value,
          store:storeId,
          // note: e.target.note.value,

        }

        setLoadingOpen(true)

        StockProvider.addStock(data).then(
          (response) => {
            console.log(response.data)
            const stockInitData = {
              stock:response.data.id,
              quantity: data.quantity,
              price: data.price,
              note:e.target.note.value,


            }
            StockInitProvider.addStockInit(stockInitData).then(
              response=>{
                setLoadingOpen(false)
                router.back();
              },
              error=>{
                setLoadingOpen(false)
                handleSBOpen(CONNECTION_ERROR)
              }
              )
          },
          error => {
            try{
              if(error.response.data.code === 'stock_exist'){
                setLoadingOpen(false)

                handleSBOpen(STOCK_EXIST_ERROR)
              }else{
                setLoadingOpen(false)
                handleSBOpen(CONNECTION_ERROR)
              }
            }
            catch(e){
              setLoadingOpen(false)
              handleSBOpen(CONNECTION_ERROR)
            }
            
            
          }
          )
      }else{
        handleSBOpen(PRODUCT_NOT_SELECTED_ERROR)
      }
    }else if(stockId){
      setLoadingOpen(true)
      const stockInitData = {
        stock:stockId,
        quantity: e.target.quantity.value,
        price: e.target.price.value,
        note:e.target.note.value,
        }
      StockInitProvider.addStockInit(stockInitData).then(
        response=>{
          setLoadingOpen(false)
          router.back();
        },
        error=>{
          setLoadingOpen(false)
          handleSBOpen(CONNECTION_ERROR)
        }
        )
    }
    
  }

  const handleSBClose = () => {
    setErrorSBOpen(false)
  }

  const handleSBOpen = (text) => {
    setErrorSBText(text)
    setErrorSBOpen(true)
  }


  useEffect(()=>{
    if(stockId){
      setLoadingOpen(true)
      Promise.all([
        StockProvider.getStocks(stockId),
        ]).then(
        responses=>{
          console.log(responses[0].data.product)
          setSelectedProduct(responses[0].data.product)
          setLoadingOpen(false)
        },
        errors=>{
          setLoadingOpen(false)
          handleSBOpen(CONNECTION_ERROR)
        })
    }
    
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
        EURL BST | AJOUTER MAGASIN
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
        <StockInitAddToolbar isAddPage={true} 
        handleSaveAsDraft={handleOnSubmit} />
        <Box sx={{ 
          mt: 3 ,
          backgroundColor: "white",
        }}>
          <Card>
            <CardContent>
              <Box >
                <form id="add-store-init-form" 
                onSubmit={(event) => handleOnSubmit(event)}>
                  <Grid container 
                  spacing={1} 
                  columnSpacing={{ 
                    xs: 1, sm: 2, md: 3 }}>
                    <Grid item
                    xs={2.25}>
                      <InputLabel>
                        Reference
                      </InputLabel>
                      <Typography
                      sx={{
                          my: 2
                        }} >
                        -
                      </Typography>
                    </Grid>
                    <Grid item
                    xs={2.25}>
                      <InputLabel>
                        Sku
                      </InputLabel>
                      <Typography
                      sx={{
                          my: 2
                        }} >
                        {selectedProduct ? selectedProduct.sku : "-"}
                      </Typography>
                    </Grid>
                    <Grid item
                    xs={2.25}>
                      <InputLabel>
                        Designation
                      </InputLabel>
                      <Typography
                      sx={{
                          my: 2
                        }} >
                        {selectedProduct ? selectedProduct.name : "-"}
                      </Typography>
                    </Grid>
                    <Grid item
                    xs={2.25}>
                      <InputLabel>
                        Unité
                      </InputLabel>
                      <Typography
                      sx={{
                          my: 2
                        }} >
                        {selectedProduct ? selectedProduct.base_unit.ref : "-"}
                      </Typography>
                    </Grid>
                    {storeId && <Grid item
                    xs={3}>
                      <Button
                      color="primary"
                      variant="contained"
                      onClick={handleClickOpen}
                    >
                      Selectionner un article
                    </Button>
                    </Grid>}
                    <Grid item 
                    xs={4}>
                      <TextField
                        fullWidth
                        label="Quantité"
                        margin="normal"
                        name="quantity"
                        type="text"
                        variant="outlined"
                        required
                      />
                    </Grid>
                    <Grid item 
                    xs={4}>
                      <TextField
                        fullWidth
                        label="Prix unitaire"
                        margin="normal"
                        name="price"
                        type="text"
                        variant="outlined"
                        required
                      />
                    </Grid>
                    <Grid item 
                    xs={4}>
                      <TextField
                        fullWidth
                        label="Observation"
                        margin="normal"
                        name="note"
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

    <ProductSelectDialog open={open} 
      handleClickOpen={handleClickOpen} 
      setOpen={setOpen}
      selectedProduct={selectedProduct} 
      setSelectedProduct={setSelectedProduct}/>
  </>
  );
};

AddStockInit.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default AddStockInit;
