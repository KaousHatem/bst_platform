import Head from 'next/head';
import NextLink from 'next/link';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
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

import { ReceiptAddToolbar } from '../../components/receipt/receipt-add-toolbar';
import { DashboardLayout } from '../../components/dashboard-layout';

import { ReceiptProduct } from '../../components/receipt/receipt-product'
import { ReceiptAttachDialog } from 'src/components/receipt/receipt-attach-dialog';

import { format } from 'date-fns'

import ReceiptProvider from '../../services/receipt-provider'
import ReceiptProductProvider from '../../services/receipt-product-provider'
import receiptDocumentProvider from 'src/services/receipt-document-provider';

import UXAccess from '../../utils/ux-access'

const EditReceipt = () => {


  const router = useRouter();

  const [loading, setLoading] = useState(true)

  const [receiptId, setReceiptId] = useState(router.query.id && parseInt(router.query.id) || undefined)

  const [receipt, setReceipt] = useState()

  const [purchaseOrder, setPurchaseOrder] = useState()
  const [receiptProducts, setReceiptProducts] = useState([])

  const [user, setUser] = useState()



  const [errorSBOpen, setErrorSBOpen] = useState(false)

  const [loadingOpen, setLoadingOpen] = useState(false)
  const [errorSBText, setErrorSBText] = useState("")
  let [severity, setSeverity] = useState()

  let [attachOpen, setAttachOpen] = useState(false)
  let [selectedFile, setSelectedFile] = useState()
  let [isSelected, setIsSelected] = useState(false);
  let [attachLoading, setAttachLoading] = useState(false)
  let [signedDocument, setSignedDocument] = useState()


  const CONNECTION_ERROR = "Probleme de connexion, Veuillez de ressayer"


  const handleOnSubmit = (e) => {
    e.preventDefault();

    var receiptData = {}


    if (e.target.invoice) {
      receiptData = e.target.invoice.value.length ? {
        invoice: e.target.invoice.value,
        ...receiptData
      } : receiptData
    }

    if (e.target.do) {
      receiptData = e.target.do.value.length ? {
        do: e.target.do.value,
        ...receiptData
      } : receiptData
    }

    if (Object.keys(receiptData).length) {
      setLoadingOpen(true)
      ReceiptProvider.updateReceipt(receiptData, receiptId).then(
        (response) => {
          setLoadingOpen(false)
          router.push('/receipt')
        }, (error) => {
          setLoadingOpen(false)
          handleSBOpen(CONNECTION_ERROR)
        })
    } else {
      router.push('/receipt')
    }



    const newReceiptProducts = receiptProducts.filter((product) => {
      return product.status === 'new'
    }).map((product) => {
      return {
        id: product.id,
        note: product.note,
        conformity: product.conformity
      }
    })

    if (newReceiptProducts.length) {
      setLoadingOpen(true)
      ReceiptProductProvider.bulkUpdateReceiptProduct(newReceiptProducts).then(
        response => {
          setLoadingOpen(false)
          router.push('/receipt')
        }, error => {
          setLoadingOpen(false)
          handleSBOpen(CONNECTION_ERROR)
        })
    } else {
      router.push('/receipt')
    }





  }

  const handleSBClose = () => {
    setErrorSBOpen(false)
  }

  const handleSBOpen = (text, severity = 'error') => {
    setSeverity(severity)
    setErrorSBText(text)
    setErrorSBOpen(true)
  }


  const handleAttachOpen = () => {
    setAttachOpen(true)
  }

  const handleAttachClose = () => {
    setAttachOpen(false)
  }

  const handleSelectFile = (e) => {

    if (e.target.files.length > 0 && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setIsSelected(true);
    }

  }

  const handleDeleteAttachedFile = (e) => {
    if (signedDocument) {
      let id = signedDocument.id
      setLoadingOpen(true)
      receiptDocumentProvider.deleteReceiptDocument(id).then(
        response => {
          handleSBOpen("Le fichier à été supprimer avec succée", "success")
          router.reload(window.location.pathname)
          setLoadingOpen(false)
        },
        error => {
          setLoadingOpen(false)
          handleSBOpen(CONNECTION_ERROR)
        }
      )
    }
  }

  const handleUploadAttachement = (e) => {
    let formData = new FormData();

    formData.append("file", selectedFile);
    formData.append("receipt", receiptId);
    setLoadingOpen(true)
    receiptDocumentProvider.addReceiptDocument(formData).then(
      response => {
        router.reload(window.location.pathname)
        setLoadingOpen(false)
      },
      error => {
        setLoadingOpen(false)
        handleSBOpen(CONNECTION_ERROR)
      }
    )
  }



  useEffect(() => {

    setLoadingOpen(true)
    Promise.all([
      receiptId && ReceiptProvider.getReceipts(receiptId),
      // UserProvider.getMeUser(),
    ]).then(
      responses => {
        if (responses.length) {
          console.log(responses)
          setReceipt(responses[0].data)
          setSignedDocument(responses[0].data.document ? responses[0].data.document : undefined)
          setReceiptProducts(responses[0].data.receiptProducts.map(product => {

            return {
              id: product.id,
              sku: product.purchaseOrderProduct.purchaseProduct.provisionProduct.product.sku,
              name: product.purchaseOrderProduct.purchaseProduct.provisionProduct.product.name,
              unit: product.purchaseOrderProduct.purchaseProduct.unit.ref,
              quantity: product.purchaseOrderProduct.purchaseProduct.quantity,
              quantityReceipt: product.quantity_receipt,
              quantityAccepted: product.quantity_accepted,
              note: product.note,
              conformity: product.conformity,
              unitPrice: product.purchaseOrderProduct.unitPrice,
              status: 'old',
            }
          }))

        }
        setLoadingOpen(false)
        setLoading(false)


      }
      , errors => {
        setLoadingOpen(false)
        handleSBOpen(CONNECTION_ERROR)
        setLoading(false)
      }
    )

  }, [receiptId])



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
          EURL BST | BON DE RECEPTION
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
            id={receiptId}
            handleAttachOpen={handleAttachOpen}
            signedDocument={signedDocument}
            handleDeleteAttachedFile={handleDeleteAttachedFile} />
          <Box sx={{
            mt: 3,
            backgroundColor: "white",
          }}>
            <Card>
              <CardContent>
                <Box >
                  <form id="edit-receipt-form"
                    onSubmit={(event) => handleOnSubmit(event, 1)}>
                    <Grid container
                      spacing={1}
                      columnSpacing={{
                        xs: 1, sm: 2, md: 3
                      }}>
                      <Grid item
                        xs={4}>
                        <InputLabel>
                          Reference
                        </InputLabel>
                        <Typography
                          sx={{
                            my: 2
                          }} >
                          {receipt.ref}
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
                          {receipt.purchaseOrder.ref}
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
                          {format(new Date(receipt.purchaseOrder.created_on), 'dd-MM-yyyy')}
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
                          {receipt.purchaseOrder.supplier.name}
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
                          {format(new Date(receipt.created_on), 'dd-MM-yyyy')}
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
                          {receipt.created_by.fullname}
                        </Typography>
                      </Grid>
                      <Grid item
                        xs={12}>
                        <InputLabel>
                          Magasin
                        </InputLabel>
                        <Typography
                          sx={{
                            my: 2
                          }} >
                          {receipt.purchaseOrder.purchaseRequest.provision.destination.name}
                        </Typography>
                      </Grid>
                      {receipt.do ?
                        <Grid item
                          xs={4}>
                          <InputLabel>
                            N° Bon de livraison
                          </InputLabel>
                          <Typography
                            sx={{
                              my: 2
                            }} >
                            {receipt.do}
                          </Typography>
                        </Grid> :
                        <Grid item
                          xs={4}>
                          <TextField
                            label="N° Bon de livraison "
                            fullWidth
                            margin="normal"
                            name="do"
                            type="text"
                            variant="outlined"
                          />
                        </Grid>
                      }
                      {receipt.invoice ?
                        <Grid item
                          xs={4}>
                          <InputLabel>
                            N° Facture
                          </InputLabel>
                          <Typography
                            sx={{
                              my: 2
                            }} >
                            {receipt.invoice}
                          </Typography>
                        </Grid> :
                        <Grid item
                          xs={4}>
                          <TextField
                            label="N° Facture"
                            fullWidth
                            margin="normal"
                            name="invoice"
                            type="text"
                            variant="outlined"
                          />
                        </Grid>
                      }

                    </Grid>
                  </form>


                  <ReceiptProduct setSelectedProducts={setReceiptProducts}
                    selectedProducts={receiptProducts} />
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Container>
      </Box>
      <Snackbar open={errorSBOpen}
        onClose={handleSBClose}>
        <Alert variant="filled"
          severity={severity}>
          {errorSBText}
        </Alert>
      </Snackbar>
      <ReceiptAttachDialog attachOpen={attachOpen}
        handleAttachOpen={handleAttachOpen}
        handleAttachClose={handleAttachClose}
        handleSelectFile={handleSelectFile}
        loading={attachLoading}
        isSelected={isSelected}
        selectedFile={selectedFile}
        handleUploadAttachement={handleUploadAttachement}

      />
    </>
  );
};

EditReceipt.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default EditReceipt;
