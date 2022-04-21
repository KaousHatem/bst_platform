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

const EditPurchaseRequest = () => {

  const [successUpdate, setSuccessUpdate] = useState(true)
  const [loading, setLoading] = useState(true)

  const [provisionValue, setProvisionValue] = useState()
  const [provisions, setProvisions] = useState([])
  const [provisionProducts, setProvisionProducts] = useState([])

  const [selecetedProducts, setSelectedProducts] = useState([])
  const [oldSelecetedProducts, setOldSelectedProducts] = useState([])

  const router = useRouter();
  const purchaseRequestId = router.query.id
  const [purchaseRequest, setPurchaseRequest] = useState({})
  const [productInPurchase, setProductInPurchase] = useState([])

  const handleSetProvisionProducts = (id=-1) => {
    console.log(provisions)
    setProvisionProducts(provisions.filter((provision) => {
      return provision.id === id
    })[0].provisionProducts )
  }

  const handleProvisionChange = async (newValue) => {
    setProvisionValue(newValue.target.value)

    const response = await ProvisionProvider.getProductInPurchase(newValue.target.value)

    if (response.data){
      setProductInPurchase(response.data.map((product) => {return product.id}))
    }
    
    handleSetProvisionProducts(newValue.target.value)
  };

  const handleOnSubmit = (e, status) => {
    e.preventDefault();
    console.log(provisionValue)
    console.log(purchaseRequest.provision.id)
    const data = {
      provision: provisionValue === undefined && purchaseRequest.provision.id || provisionValue,
      status: status,
    }
    const pr_product_list = []

    PurchaseRequestProvider.updatePurchaseRequest(data,purchaseRequestId ).then(
      (response) => {
        console.log(response.data)
       
      },
      error => {
        setSuccessUpdate(false)
        alert(error.message)
      }
      )

    selecetedProducts.forEach((product) => {
      if(!oldSelecetedProducts.includes(product)){
        const product_tmp = {
          provisionProduct: product.id,
          purchaseRequest: purchaseRequestId,
        }
        pr_product_list = [ ... pr_product_list, product_tmp]
      }

      
    })
    if (pr_product_list.length){
      PRProductProvider.addPRProduct(pr_product_list).then(
      (response) => {
        console.log(response.data)
      },
      error => {
        alert(error.message)
        setSuccessUpdate(false)
      }
      )
    }

    oldSelecetedProducts.forEach((product) => {
      if(!selecetedProducts.includes(product)) {
        const id = purchaseRequest.purchaseReqProducts.filter((purchaseReqProduct) => {
            return purchaseReqProduct.provisionProduct === product
        })[0].id
        PRProductProvider.deletePRProduct(id).then(
        (response) => {
          console.log(response.data)
        },
        error => {
          alert(error.message)
          setSuccessUpdate(false)
        }
        )
      }
    })

    if(successUpdate){
      alert("done")
      router.push('/purchase-request');
    }
    
    
  }

  const handleApprove = () => {
    if (purchaseRequestId){
      PurchaseRequestProvider.approvePurchaseRequest(purchaseRequestId).then(
      (response) => {
        alert("done")
        router.push('/purchase-request');
      },
      (error) => {
        alert("error")
      })
    }
    
  }

  const handleReject = () => {
    const data = {
      status: '4',
    }
    PurchaseRequestProvider.updateStatusPurchaseRequest(data, purchaseRequestId).then(
      (response) => {
        alert("done")
        router.push('/purchase-request');
      },
      (error) => {
        alert("error")
      })
  }


  useEffect(() => {
     if(purchaseRequestId){
       Promise.all([
        ProvisionProvider.getOnlyApprovedProvisions(),
        PurchaseRequestProvider.getPurchaseRequests(purchaseRequestId)
        ]).then(async (responses) => {
          console.log(responses)
          if (responses[0].data.length){
            var data = {}
            if (!responses[0].data.map((provision) => {return provision.id}).includes(responses[1].data.provision.id)){
              const response = await ProvisionProvider.getProvisions(responses[1].data.provision.id)
              data = response.data
            }
           
            setProvisions([...responses[0].data, data])
            provisions = [...responses[0].data, data]
          }else{

            const response = await ProvisionProvider.getProvisions(responses[1].data.provision.id)
            setProvisions([response.data])
            provisions = [response.data]


            
          }
          console.log(responses[1].data.provision.id)
          console.log('test')
          if(responses[1].data.provision.id){
            const provisionResponse = await ProvisionProvider.getProductInPurchase(responses[1].data.provision.id)
            console.log(responses[1].data.purchaseReqProducts)
            if (provisionResponse.data){
              const oldProvisionProducts = responses[1].data.purchaseReqProducts.map((product) => {return product.provisionProduct.id})
              console.log(oldProvisionProducts)
              console.log(provisionResponse.data)
              setProductInPurchase(provisionResponse.data.map((product) => {if(!oldProvisionProducts.includes(product.id)){return product.id}}))
            }
          }
          console.log(responses[1].data)
          setPurchaseRequest(responses[1].data)
          if(responses[1].data.purchaseReqProducts){
            console.log(responses[1].data.purchaseReqProducts.map((product)=>{return product.provisionProduct}))
            setSelectedProducts(responses[1].data.purchaseReqProducts.map((product)=>{return product.provisionProduct}))
            setOldSelectedProducts(responses[1].data.purchaseReqProducts.map((product)=>{return product.provisionProduct}))
            handleSetProvisionProducts(responses[1].data.provision.id)
            
          }
          setLoading(false)
        })
    }
    
  },[])
  
  return ( !loading &&
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
        <PRAddToolbar 
        handleSaveAsDraft={handleOnSubmit}
        purchaseRequestStatus={purchaseRequest.status} 
        handleApprove={handleApprove}
        handleReject={handleReject}
        purchaseRequestId={purchaseRequestId} />
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
                        value={purchaseRequest.ref}
                        disabled
                      />
                    </Grid>
                    <Grid item 
                    xs={6}>
                      <InputLabel>
                        Demande D'appro
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
                        // value={provisionValue}
                        defaultValue={purchaseRequest.provision.id}
                        onChange={handleProvisionChange}
                        disabled={selecetedProducts.length !== 0}
                      >
                        {provisions.slice(0,provisions.length).map((provision) => (
                          <MenuItem key={provision.ref} 
                          value={provision.id}>{provision.ref}</MenuItem>
                        ))}
                      </Select>
                    </Grid>
                    <Grid item
                    xs={5}>
                      <InputLabel>
                        Destination
                      </InputLabel>
                      <Typography
                      sx={{
                          my: 2
                        }} >
                        {purchaseRequest.provision.destination}
                      </Typography>
                    </Grid>
                    <Grid item
                    xs={4}>
                      <InputLabel>
                        Cree par
                      </InputLabel>
                      <Typography
                      sx={{
                          my: 2
                        }} >
                        {purchaseRequest.created_by.username}
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
                        {format(new Date(purchaseRequest.created_on),'yyyy-MM-dd hh:mm')}
                      </Typography>
                    </Grid>
                    <Grid item
                    xs={5}>
                      <InputLabel>
                        Apprové par
                      </InputLabel>
                      <Typography
                      sx={{
                          my: 2
                        }} >
                        {purchaseRequest.approved_by === null && "_" || purchaseRequest.approved_by.username}
                      </Typography>
                    </Grid>
                    
                    <Grid item
                    xs={4}>
                      <InputLabel>
                        Apprové en
                      </InputLabel>
                      <Typography
                      sx={{
                          my: 2
                        }} >
                        {purchaseRequest.approved_on === null && "_" || format(new Date(purchaseRequest.approved_on),'yyyy-MM-dd hh:mm')}
                      </Typography>
                    </Grid>
                    <Grid item
                    xs={3}>
                      <InputLabel>
                        Delai
                      </InputLabel>
                      <Typography
                      sx={{
                          my: 2
                        }} >
                        {purchaseRequest.provision.delay}
                      </Typography>
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

EditPurchaseRequest.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default EditPurchaseRequest;
