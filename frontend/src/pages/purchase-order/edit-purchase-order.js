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
} from '@mui/material';
import { LocalizationProvider, DatePicker, AdapterDateFns } from '@mui/lab'
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

const EditPurchaseOrder = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true)

  const [purchaseRequestValue, setPurchaseRequestValue] = useState()

  const [purchaseOrderId, setPurchaseOrderId] = useState(router.query.id && parseInt(router.query.id) || undefined)
  const [purchaseOrder, setPurchaseOrder] = useState()



  const [purchaseProducts, setPurchaseProducts] = useState([])

  const [purchaseRequest, setPurchaseRequest] = useState()

  const [suppliers, setSuppliers] = useState([])



  const [errorSBOpen, setErrorSBOpen] = useState(false)

  const [loadingOpen, setLoadingOpen] = useState(false)
  const [errorSBText, setErrorSBText] = useState("")

  const [confirmed, setConfirmed] = useState(true)


  const CONNECTION_ERROR = "Probleme de connexion, Veuillez de ressayer"



  const handleOnSubmit = (e) => {
    e.preventDefault();

    const data_product = purchaseProducts.filter(product => { return product.unitPrice }
    ).map(product => {
      return {
        id: product.id,
        unitPrice: parseFloat(product.unitPrice + ".0")
      }
    })
    console.log(data_product)
    setLoadingOpen(true)
    POProductProvider.bulkUpdatePOProduct(data_product).then(
      response => {
        console.log(data_product)
        setLoadingOpen(false)
        // router.push('/purchase-order');
        console.log(response.data)
      },
      error => {
        setLoadingOpen(false)
        // router.push('/purchase-order');
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



  useEffect(() => {

    setLoadingOpen(true)

    Promise.all([
      PurchaseOrderProvider.getPurchaseOrders(purchaseOrderId),
    ]).then(
      responses => {
        setPurchaseOrder(responses[0].data)
        setPurchaseProducts(responses[0].data.purchaseOrderProducts.map(product => {
          if (!product.unitPrice) {
            setConfirmed(false)
          }
          return {
            id: product.id,
            sku: product.purchaseProduct.provisionProduct.product.sku,
            name: product.purchaseProduct.provisionProduct.product.name,
            unit: product.purchaseProduct.unit.ref,
            quantity: product.purchaseProduct.quantity,
            unitPrice: product.unitPrice
          }
        }))
        setLoadingOpen(false)
        setLoading(false)


      }
      , errors => {
        setLoadingOpen(false)
        handleSBOpen(CONNECTION_ERROR)
        setLoading(false)
      }
    )
  }, [])



  return (!loading &&
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loadingOpen}
        onClick={() => { setLoadingOpen(false) }}
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
            isAdd={false}
            id={purchaseOrderId}
            confirmed={confirmed}
            received={purchaseOrder.allReceived}
          />

          <Box sx={{
            mt: 3,
            backgroundColor: "white",
          }}>
            <Card>
              <CardContent>
                <Box >
                  <form id="add-purchase-order-form"
                    onSubmit={(event) => handleOnSubmit(event, 1)}>
                    <Grid container
                      spacing={1}
                      columnSpacing={{
                        xs: 1, sm: 2, md: 3
                      }}>
                      <Grid item
                        xs={6}>
                        <InputLabel>
                          Reference
                        </InputLabel>
                        <Typography
                          sx={{
                            my: 2
                          }} >
                          {purchaseOrder.ref}
                        </Typography>
                      </Grid>
                      <Grid item
                        xs={6}>
                        <InputLabel>
                          Reference De la demande d&apos;achat
                        </InputLabel>
                        <Typography
                          sx={{
                            my: 2
                          }} >
                          {purchaseOrder.purchaseRequest.ref}
                        </Typography>

                      </Grid>
                      <Grid item
                        xs={6}>
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
                          Reference de la demande d&apos;appro
                        </InputLabel>
                        <Typography
                          sx={{
                            my: 2
                          }} >
                          {purchaseOrder.purchaseRequest.provision.ref}
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
                          {purchaseOrder.purchaseRequest.provision.destination.name}
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
                          {purchaseOrder.purchaseRequest.provision.delay}
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
                          {purchaseOrder.purchaseRequest.provision.created_by.fullname}
                        </Typography>
                      </Grid>
                    </Grid>
                  </form>


                  <PurchaseOrderProduct setPurchaseProducts={setPurchaseProducts}
                    purchaseProducts={purchaseProducts} />
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

EditPurchaseOrder.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default EditPurchaseOrder;
