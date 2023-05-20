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

import { StockInDocumentAddToolbar } from '../../components/stock-in/stock-in-document-add-toolbar';
import { ProductSelectDialog } from '../../components/stock-init/product-select-dialog'
import { StockInAddProduct } from '../../components/stock-in/stock-in-add-product'
import { DashboardLayout } from '../../components/dashboard-layout';

import { format } from 'date-fns'

import StockInDocumentProvider from '../../services/stock-in-document-provider'
import StockInDocumentSourceFileProvider from '../../services/stock-in-document-source-file-provider'
import StockInProvider from '../../services/stock-in-provider'
import stockInDocumentProductProvider from '../../services/stock-in-document-product-provider'

import UXAccess from '../../utils/ux-access'
import stockInProvider from '../../services/stock-in-provider';
import { stockInDocumentSourceFileUrl } from '../../utils/networks';



const AddStockInDocument = () => {
  const router = useRouter();

  const [errorSBOpen, setErrorSBOpen] = useState(false)

  const [loadingOpen, setLoadingOpen] = useState(false)
  const [errorSBText, setErrorSBText] = useState("")



  let [selectedProducts, setSelectedProducts] = useState([])
  let [allConfirmed, setAllConfirmed] = useState([])
  let [selectedFile, setSelectedFile] = useState()

  const [open, setOpen] = React.useState(false);


  const CONNECTION_ERROR = "Probleme de connexion, Veuillez de ressayer"
  const STOCK_EXIST_ERROR = "Cette article existe dans ce magasin"
  const PRODUCT_NOT_SELECTED_ERROR = "Veuillez de selectionner un article"


  const handleSelectFile = (e) => {
    setSelectedFile(e.target.files[0])
  }

  const handleClickOpen = () => {
    setOpen(true);
  };


  const handleOnSubmit = (e) => {
    e.preventDefault();


    let data = {
      'source': e.target.sourceType.value,
      'source_id': e.target.sourceRef.value,
      'status': '1'

    }

    if (e.target.note.value) {
      data['note'] = e.target.note.value
    }

    let formData = new FormData();
    formData.append('file', selectedFile)

    StockInDocumentProvider.addStockInDocument(data).then(
      response => {
        let stockInDocument = response.data
        formData.append('stock_in_document', stockInDocument.id)
        StockInDocumentSourceFileProvider.addStockInDocumentSourceFile(formData).then(
          response => {
            let productData = selectedProducts.map((selectedProduct) => {
              return {
                quantity: selectedProduct.quantity,
                price: selectedProduct.price,
                unit: selectedProduct.unit.id,
                stock_in_document: stockInDocument.id,
                product: selectedProduct.data.id,
              }
            })
            stockInDocumentProductProvider.addStockInDocumentProduct(productData).then(
              response => {
                const params = {
                  pathname: '/stock-in/edit-stock-in-document/',
                  query: { 'id': stockInDocument.id }
                }
                router.push(params);
              },
              error => {
                alert('error_product')
              }
            )
            // alert('done_file')
          },
          error => {
            alert('error_file')
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
            EURL BST | AJOUTER BON D&apos;ENTRE
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
            <StockInDocumentAddToolbar
              isAdd={true} />
            <Box sx={{
              mt: 3,
              backgroundColor: "white",
            }}>
              <Card>
                <CardContent>
                  <Box >
                    <form id="add-stock-in-document-form"
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
                              Type de source
                            </InputLabel>
                            <Select
                              name="sourceType"
                              fullWidth
                              margin="normal"
                              labelId="demo-simple-select-label"
                              label="Type de source"
                              id="demo-simple-select"
                            >
                              <MenuItem key={"1"}
                                value={"1"}>Achat sans dossier</MenuItem>
                              <MenuItem key={"3"}
                                value={"3"}>Autre</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item
                          xs={4}>
                          <TextField
                            fullWidth
                            label="Reference de la source"
                            margin="normal"
                            name="sourceRef"
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
                      <Grid container
                        spacing={1}
                        columnSpacing={{
                          xs: 1, sm: 2, md: 3
                        }}>


                        <Grid item
                          xs={4}>
                          <InputLabel>
                            <input
                              id="btn-upload"
                              name="btn-upload"
                              style={{ display: 'none' }}
                              type="file"
                              accept=".jpg,.png,application/pdf"
                              onChange={(e) => { handleSelectFile(e) }}
                            />
                            <Button
                              component="span" >
                              Ajouter un document de justification
                            </Button>
                          </InputLabel>
                        </Grid>
                        <Grid item
                          xs={4}>
                          <InputLabel>
                            Le Document
                          </InputLabel>
                          <Typography
                            sx={{
                              my: 2
                            }} >
                            {selectedFile ? selectedFile.name : "-"}
                          </Typography>
                        </Grid>

                      </Grid>


                    </form>
                    <StockInAddProduct selectedProducts={selectedProducts}
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

AddStockInDocument.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default AddStockInDocument;
