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
import { LocalizationProvider, DatePicker, AdapterDateFns } from '@mui/lab'
import InputLabel from '@mui/material/InputLabel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { StockOutDocumentAddToolbar } from '../../components/stock-out/stock-out-document-add-toolbar';

import { StockOutAddProduct } from '../../components/stock-out/stock-out-add-product'
import { DashboardLayout } from '../../components/dashboard-layout';

import { format } from 'date-fns'

import StockOutDocumentProvider from '../../services/stock-out-document-provider'

import StockOutProvider from '../../services/stock-out-provider'
import StockOutDocumentProductProvider from '../../services/stock-out-document-product-provider'

import UXAccess from '../../utils/ux-access'



const AddStockOutDocument = () => {
  const router = useRouter();

  const [errorSBOpen, setErrorSBOpen] = useState(false)

  const [loadingOpen, setLoadingOpen] = useState(false)
  const [errorSBText, setErrorSBText] = useState("")



  let [selectedProducts, setSelectedProducts] = useState([])
  let [allConfirmed, setAllConfirmed] = useState([])

  const [open, setOpen] = React.useState(false);


  const CONNECTION_ERROR = "Probleme de connexion, Veuillez de ressayer"
  const STOCK_EXIST_ERROR = "Cette article existe dans ce magasin"
  const PRODUCT_NOT_SELECTED_ERROR = "Veuillez de selectionner un article"




  const handleClickOpen = () => {
    setOpen(true);
  };


  const handleOnSubmit = (e) => {
    e.preventDefault();


    let data = {
      'target': e.target.targetType.value,
      'target_detail': e.target.targetDetail.value,
      'status': '1'

    }

    if (e.target.note.value) {
      data['note'] = e.target.note.value
    }


    StockOutDocumentProvider.addStockOutDocument(data).then(
      response => {
        let stockOutDocument = response.data
        let productData = selectedProducts.map((selectedProduct) => {
          return {
            quantity: selectedProduct.quantity,
            price: selectedProduct.price,
            unit: selectedProduct.unit.id,
            stock_out_document: stockOutDocument.id,
            product: selectedProduct.data.id,
          }
        })
        StockOutDocumentProductProvider.addStockOutDocumentProduct(productData).then(
          response => {
            alert('done_product')
            const params = {
              pathname: '/stock-out/edit-stock-out-document/',
              query: { 'id': stockOutDocument.id }
            }
            router.push(params);
          },
          error => {
            alert('error_product')
          }
        )
      },
      error => {
        alert('error')
      }
    )


  }

  const handleSBClose = () => {
    setErrorSBOpen(false)
  }

  const handleSBOpen = (text) => {
    setErrorSBText(text)
    setErrorSBOpen(true)
  }







  return (
    <> {loadingOpen ?
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loadingOpen}
        onClick={() => { setLoadingOpen(false) }}
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
            <StockOutDocumentAddToolbar
              isAdd={true} />
            <Box sx={{
              mt: 3,
              backgroundColor: "white",
            }}>
              <Card>
                <CardContent>
                  <Box >
                    <form id="add-stock-out-document-form"
                      onSubmit={(event) => handleOnSubmit(event)}>
                      <Grid container
                        spacing={1}
                        columnSpacing={{
                          xs: 1, sm: 2, md: 3
                        }}>
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


                      </Grid>
                      <Grid container
                        spacing={1}
                        columnSpacing={{
                          xs: 1, sm: 2, md: 3
                        }}>
                        <Grid item
                          xs={4}>
                          <FormControl sx={{
                            my: 2
                          }}
                            fullWidth>
                            <InputLabel id="demo-simple-select-label">
                              Type de Destination
                            </InputLabel>
                            <Select
                              name="targetType"
                              fullWidth
                              margin="normal"
                              labelId="demo-simple-select-label"
                              label="Type de source"
                              id="demo-simple-select"
                            >
                              <MenuItem key={"3"}
                                value={"3"}>Chantier</MenuItem>
                              <MenuItem key={"4"}
                                value={"4"}>Autre</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item
                          xs={4}>
                          <TextField
                            fullWidth
                            label="Detail du destination"
                            margin="normal"
                            name="targetDetail"
                            type="text"
                            variant="outlined"
                            required
                          />
                        </Grid>
                        <Grid item
                          xs={4}>
                          <TextField
                            fullWidth
                            label="Note"
                            margin="normal"
                            name="note"
                            type="text"
                            variant="outlined"
                          />
                        </Grid>
                      </Grid>



                    </form>
                    <StockOutAddProduct selectedProducts={selectedProducts}
                      setAllConfirmed={setAllConfirmed}
                      setSelectedProducts={setSelectedProducts} />
                  </Box>
                </CardContent>
              </Card>
            </Box>

          </Container>
        </Box >

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

AddStockOutDocument.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default AddStockOutDocument;
