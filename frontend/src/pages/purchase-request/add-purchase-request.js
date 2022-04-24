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

import { PRAddToolbar } from '../../components/purchase-request/pr-add-toolbar';
import { DashboardLayout } from '../../components/dashboard-layout';
import { PRAddProduct } from '../../components/purchase-request/pr-add-product';

import { format } from 'date-fns'

import ProvisionProvider from '../../services/provision-provider'
import PurchaseRequestProvider from '../../services/purchase-request-provider'
import PRProductProvider from '../../services/pr-product-provider'

import UXAccess from '../../utils/ux-access'

const AddPurchaseRequest = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false)

  const [provisionValue, setProvisionValue] = useState(router.query.provisionId && parseInt(router.query.provisionId) || undefined)
  const [provisions, setProvisions] = useState([])
  const [provisionProducts, setProvisionProducts] = useState([])

  const [selecetedProducts, setSelectedProducts] = useState([])
  const [productInPurchase, setProductInPurchase] = useState([])
  

  


  const handleProvisionChange = async (newValue) => {
    setProvisionValue(newValue.target.value)
    
    const response = await ProvisionProvider.getProductInPurchase(newValue.target.value)

    if (response.data.length){
      console.log(response.data)
      setProductInPurchase(response.data.map((product) => {return product.id}))
    }
    setProvisionProducts(provisions.filter((provision) => {
      return provision.id === newValue.target.value
    })[0].provisionProducts )
  };

  const handleOnSubmit = (e, status) => {
    e.preventDefault();
    const data = {
      provision: provisionValue,
      status: status,
      ref: null
    }

    const pr_product_list = []

    PurchaseRequestProvider.addPurchaseRequest(data).then(
      (response) => {
        
        selecetedProducts.forEach(product => {
          const product_tmp = {
            provisionProduct: product.id,
            purchaseRequest: response.data.id,
          }
          pr_product_list = [ ... pr_product_list, product_tmp]
        })
        console.log(pr_product_list)
        PRProductProvider.addPRProduct(pr_product_list).then(
          (response) => {
            alert("done")
            console.log(response.data)
            router.push('/purchase-request');
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


  useEffect( async () => {

    const response = await ProvisionProvider.getOnlyApprovedProvisions()
    if (response.data){
      if (!response.data.message) {
        setProvisions(response.data)  
        provisions = response.data  
      }
        
    }
    console.log(provisions)

    if(provisionValue!== undefined) {
      const response = await ProvisionProvider.getProductInPurchase(provisionValue)
      if (response.data.length){
        console.log(response.data)
        setProductInPurchase(response.data.map((product) => {return product.id}))
        
      }
      const selectedProvision =  provisions.filter((provision) => {
        return provision.id === provisionValue
      })
      if (selectedProvision.length){
        setProvisionProducts(selectedProvision[0].provisionProducts)
      }
      
    }

    
  },[])
  
  return (
    <>
    <Head>
      <title>
        EURL BST | AJOUTER DEMANDE D'ACHAT
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
        <PRAddToolbar isAddPage={true} 
        handleSaveAsDraft={handleOnSubmit} />
        <Box sx={{ 
          mt: 3 ,
          backgroundColor: "white",
        }}>
          <Card>
            <CardContent>
              <Box >
                <form id="add-purchase-request-form" 
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
                        Reference De la demande d'appro
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
                        value={provisionValue}
                        onChange={handleProvisionChange}
                        disabled={selecetedProducts.length !== 0}
                      >
                        {provisions.length && provisions.slice(0,provisions.length).map((provision) => (
                          <MenuItem key={provision.ref} 
                          value={provision.id}>{provision.ref}</MenuItem>
                        ))|| <MenuItem key={0} 
                          value={0} disabled>aucune demande d'appro</MenuItem>}
                      </Select>
                    </Grid>
                  </Grid>
                </form>

                <PRAddProduct selecetedProducts={selecetedProducts} 
                setSelectedProducts={setSelectedProducts}
                provisionProducts = {provisionProducts}
                productInPurchase = {productInPurchase} />
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  </>
  );
};

AddPurchaseRequest.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default AddPurchaseRequest;
