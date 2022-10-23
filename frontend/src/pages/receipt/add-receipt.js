import Head from 'next/head';
import NextLink from 'next/link';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
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

import { ReceiptAddToolbar } from '../../components/receipt/receipt-add-toolbar';
import { DashboardLayout } from '../../components/dashboard-layout';
import { PurchaseOrderProduct } from '../../components/purchase-order/purchase-order-product';
import { ReceiptAddProduct } from '../../components/receipt/receipt-add-product'

import { format } from 'date-fns'

import PurchaseOrderProvider from '../../services/purchase-order-provider'
import UserProvider from '../../services/user-provider'
import ReceiptProvider from '../../services/receipt-provider'
import ReceiptProductProvider from '../../services/receipt-product-provider'


import UXAccess from '../../utils/ux-access'

const AddReceipt = () => {


  const router = useRouter();

  const [loading, setLoading] = useState(true)

  const [purchaseOrderId, setPurchaseOrderId] = useState(router.query.id && parseInt(router.query.id) || undefined)
  
  const [purchaseOrder, setPurchaseOrder] = useState()
  const [purchaseProducts, setPurchaseProducts] = useState([])

  const [user, setUser] = useState()

  
  
  const [errorSBOpen, setErrorSBOpen] = useState(false)

  const [loadingOpen, setLoadingOpen] = useState(false)
  const [errorSBText, setErrorSBText] = useState("")

  
  const CONNECTION_ERROR = "Probleme de connexion, Veuillez de ressayer"
  const NO_PRODUCT_RECEIVED_ERROR = "Veuillez confirmer la reception au moin un article"


  const handleOnSubmit = (e) => {
    e.preventDefault();

    const receiptData = {
      invoice: e.target.invoice.value,
      do: e.target.do.value,
      purchaseOrder:purchaseOrderId.toString(),
    }
    let receipt_product_list = []

    const nbReceived = purchaseProducts.filter((product)=>{return product.received}).length
    if(nbReceived){
      setLoadingOpen(true)
      ReceiptProvider.addReceipt(receiptData).then(
        response=>{
          const receiptId = response.data.id;
          purchaseProducts.forEach((product)=>{
            if (product.received){
              const tmp_data = {
                receipt:response.data.id,
                purchaseOrderProduct: product.id,
                quantity_receipt: product.receivedQuantity,
                quantity_accepted: product.acceptedQuantity,
                conformity: product.conformity==="oui"? true : product.conformity==="non" ? false : null,
                note:product.note,
              }
              receipt_product_list = [...receipt_product_list, tmp_data]
            }
          })
          console.log(receipt_product_list)
          ReceiptProductProvider.addReceiptProduct(receipt_product_list).then(
            response=>{
              setLoadingOpen(false)
              const data = {
               pathname: '/receipt/edit-receipt',
               query:{'id':receiptId}
              }
              router.push(data);

            },
            error=>{
              setLoadingOpen(false)
              handleSBOpen(CONNECTION_ERROR)
            })

        },
        error=>{
          setLoadingOpen(false)
          handleSBOpen(CONNECTION_ERROR)
        })
    }else{
      handleSBOpen(NO_PRODUCT_RECEIVED_ERROR)
    }
  }



  const handleSBClose = () => {
    setErrorSBOpen(false)
  }

  const handleSBOpen = (text) => {
    setErrorSBText(text)
    setErrorSBOpen(true)
  }



  useEffect( () => {

    setLoadingOpen(true)
    Promise.all([
      purchaseOrderId && PurchaseOrderProvider.getPurchaseOrders(purchaseOrderId),
      UserProvider.getMeUser(),
      ]).then(
        responses => {
          if(responses.length){
            console.log(responses)
            setPurchaseOrder(responses[0].data)
            setPurchaseProducts(responses[0].data.purchaseOrderProducts.map(product=>{
              
              return {
                id: product.id,
                sku: product.purchaseProduct.provisionProduct.product.sku,
                name: product.purchaseProduct.provisionProduct.product.name,
                unit: product.purchaseProduct.unit.ref,
                quantity: product.leftQuantity,
                quantityLeft: product.leftQuantity,
                unitPrice: product.unitPrice,
              }
            }))
            setUser(responses[1].data)

          }
          setLoadingOpen(false)
          setLoading(false)
         

        }
        ,errors => {
          setLoadingOpen(false)
          handleSBOpen(CONNECTION_ERROR)
          setLoading(false)
        }
      )    
    
  },[purchaseOrderId])


  
  return ( !loading &&
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
        EURL BST | AJOUTER BON DE RECEPTION
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
        <ReceiptAddToolbar
        isAdd={true}
        id={handleOnSubmit} />
        <Box sx={{ 
          mt: 3 ,
          backgroundColor: "white",
        }}>
          <Card>
            <CardContent>
              <Box >
                <form id="add-receipt-form" 
                onSubmit={(event) => handleOnSubmit(event,1)}>
                  <Grid container 
                  spacing={1} 
                  columnSpacing={{ 
                    xs: 1, sm: 2, md: 3 }}>
                    <Grid item
                    xs={4}>
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
                    xs={4}>
                      <InputLabel>
                        Reference bon de commande
                      </InputLabel>
                      <Typography
                      sx={{
                          my: 2
                        }} >
                        {purchaseOrder.ref}
                      </Typography>
                    </Grid>
                    <Grid item
                    xs={4}>
                      <InputLabel>
                        Date de commande
                      </InputLabel>
                      <Typography
                      sx={{
                          my: 2
                        }} >
                        {format(new Date(purchaseOrder.created_on),'dd-MM-yyyy')}
                      </Typography>
                    </Grid>
                    <Grid item
                    xs={4}>
                      <InputLabel>
                        Fournisseur
                      </InputLabel>
                      <Typography
                      sx={{
                          my: 2
                        }} >
                        {purchaseOrder.supplier.name}
                      </Typography>
                    </Grid>
                    <Grid item
                    xs={4}>
                      <InputLabel>
                        Date de reception
                      </InputLabel>
                      <Typography
                      sx={{
                          my: 2
                        }} >
                        {format(new Date(),'dd-MM-yyyy')}
                      </Typography>
                    </Grid>
                    <Grid item
                    xs={4}>
                      <InputLabel>
                        Reçu par
                      </InputLabel>
                      <Typography
                      sx={{
                          my: 2
                        }} >
                        {user.username}
                      </Typography>
                    </Grid>
                    <Grid item 
                    xs={4}>
                      <TextField
                        fullWidth
                        label="N° Bon de livraison"
                        margin="normal"
                        name="do"
                        type="text"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item 
                    xs={4}>
                      <TextField
                        fullWidth
                        label="N° Facture"
                        margin="normal"
                        name="invoice"
                        type="text"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item
                    xs={4}>
                      <InputLabel>
                        Magasin
                      </InputLabel>
                      <Typography
                      sx={{
                          my: 2
                        }} >
                        {purchaseOrder.purchaseRequest.provision.destination}
                      </Typography>
                    </Grid>
                  </Grid>
                </form>


                <ReceiptAddProduct setSelectedProducts={setPurchaseProducts} 
                  selectedProducts={purchaseProducts}  />
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

AddReceipt.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default AddReceipt;
