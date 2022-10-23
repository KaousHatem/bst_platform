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

import { StockOutAddToolbar } from '../../components/stock-out/stock-out-add-toolbar';
import {ProductSelectDialog} from '../../components/stock-init/product-select-dialog'
import { DashboardLayout } from '../../components/dashboard-layout';

import { format } from 'date-fns'

import StockProvider from '../../services/stock-provider'
import StockOutProvider from '../../services/stock-out-provider'

import UXAccess from '../../utils/ux-access'



const AddStockOut = () => {
  const router = useRouter();
  
  const [errorSBOpen, setErrorSBOpen] = useState(false)

  const [loadingOpen, setLoadingOpen] = useState(true)
  const [errorSBText, setErrorSBText] = useState("")

  const [stockId, setStockId] = useState(router.query.stockId && parseInt(router.query.stockId) || undefined)
  const [stock, setStock] = useState()

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
    var base_quantity = 0
    if(e.target.unit.value === stock.product.base_unit.ref){
      base_quantity = e.target.quantity.value
    }else{
      const unit_conversion = stock.product.unit_conversions.find((unit)=>{return unit.to_unit.ref===e.target.unit.value})
      base_quantity = parseInt(e.target.quantity.value) * unit_conversion.multiplier
      
    }
     
    const data = {
      quantity: base_quantity,
      price: stock.price,
      target: e.target.targetType.value,
      target_detail: e.target.targetDetail.value,
      stock: stockId,
    }
    console.log(data)
    setLoadingOpen(true)
    StockOutProvider.addStockOut(data).then(
      response=>{
        setLoadingOpen(false)
        router.back();
      },error=>{
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


  useEffect(()=>{
    setLoadingOpen(true)
    Promise.all([
      StockProvider.getStocks(stockId),
      ]).then(
      responses=>{
        console.log(responses)
        setStock(responses[0].data)
        setLoadingOpen(false)
      },
      errors=>{
        setLoadingOpen(false)
        handleSBOpen(CONNECTION_ERROR)
      })
    
  },[])


  
  
  return (
    <> {loadingOpen ?
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={loadingOpen}
      onClick={()=>{setLoadingOpen(false)}}
    >
      <CircularProgress color="inherit" />
    </Backdrop> : 
    <>
    <Head>
      <title>
        EURL BST | AJOUTER BON DE SORTIE
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
        <StockOutAddToolbar />
        <Box sx={{ 
          mt: 3 ,
          backgroundColor: "white",
        }}>
          <Card>
            <CardContent>
              <Box >
                <form id="add-stock-out-form" 
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
                          {stock.product.sku}
                        </Typography>
                      </Grid>
                      <Grid item
                      xs={4}>
                        <InputLabel>
                          Designation
                        </InputLabel>
                        <Typography
                        sx={{
                            my: 2
                          }} >
                          {stock.product.name}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container 
                    spacing={1} 
                    columnSpacing={{ 
                      xs: 1, sm: 2, md: 3 }}>
                      <Grid item
                      xs={4}>
                        <FormControl sx={{
                              my: 2
                            }} 
                            fullWidth>
                          <InputLabel id="demo-simple-select-label">
                            Type de destination
                          </InputLabel>
                          <Select
                            name="targetType"
                            fullWidth
                            margin="normal"
                            labelId="demo-simple-select-label"
                            label="Type de destination"
                            id="demo-simple-select"
                          >
                            <MenuItem key={"3"} 
                              value={"3"}>Vers le chantier</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item 
                      xs={4}>
                        <TextField
                          fullWidth
                          label="Destination"
                          margin="normal"
                          name="targetDetail"
                          type="text"
                          variant="outlined"
                          required
                        />
                      </Grid>
                    </Grid>
                    <Grid container 
                    spacing={1} 
                    columnSpacing={{ 
                      xs: 1, sm: 2, md: 3 }}>
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
                        <FormControl sx={{
                              my: 2
                            }} 
                            fullWidth>
                          <InputLabel id="demo-simple-select-label">
                            Unité
                          </InputLabel>
                          <Select
                            name="unit"
                            fullWidth
                            margin="normal"
                            labelId="demo-simple-select-label"
                            label="Unité"
                            id="demo-simple-select"
                          >
                            <MenuItem 
                              key={stock.product.base_unit.ref}
                              value={stock.product.base_unit.ref}>{stock.product.base_unit.ref}</MenuItem>
                            
                            {stock.product.unit_conversions && stock.product.unit_conversions.map((unit)=>(
                              <MenuItem 
                                key={unit.to_unit.ref}
                                value={unit.to_unit.ref} >{unit.to_unit.ref}</MenuItem>))}
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                    <Grid container 
                    spacing={1} 
                    columnSpacing={{ 
                      xs: 1, sm: 2, md: 3 }}>
                      <Grid item 
                      xs={5}>
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
    </>
  }
  </>
  );
};

AddStockOut.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default AddStockOut;
