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
import { StockOutDocumentFile } from '../../components/stock-out/stock-out-document-file'
import { DashboardLayout } from '../../components/dashboard-layout';

import { format } from 'date-fns'

import StockOutDocumentProvider from '../../services/stock-out-document-provider'
import StockOutProvider from '../../services/stock-out-provider'
import stockOutDocumentProductProvider from '../../services/stock-out-document-product-provider'
import StockOutDocumentFileProvider from '../../services/stock-out-document-file-provider'

import UXAccess from '../../utils/ux-access'



const EditStockOutDocument = () => {
    const router = useRouter();

    const [errorSBOpen, setErrorSBOpen] = useState(false)

    const [loadingOpen, setLoadingOpen] = useState(true)
    const [errorSBText, setErrorSBText] = useState("")


    let stockOutDocumentId = router.query.id
    let [stockOutDocument, setStockOutDocument] = useState()

    let [selectedProducts, setSelectedProducts] = useState([])
    let [allConfirmed, setAllConfirmed] = useState([])
    let [selectedFile, setSelectedFile] = useState()

    const [open, setOpen] = React.useState(false);

    const target_text = {
        3: "Chantier",
        4: "Autre"
    }

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

        setLoadingOpen(true)
        let formData = new FormData();
        formData.append('file', selectedFile)
        formData.append('stock_out_document', stockOutDocumentId)
        StockOutDocumentFileProvider.addStockOutDocumentFile(formData).then(
            response => {
                setLoadingOpen(false)
                const data = {
                    pathname: '/stock-out/',
                }
                router.push(data);

            },
            error => {
                setLoadingOpen(false)
                handleSBOpen(CONNECTION_ERROR)
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



    useEffect(() => {
        setLoadingOpen(true)
        StockOutDocumentProvider.getStockOutDocuments(stockOutDocumentId).then(
            response => {
                setStockOutDocument(response.data)
                setSelectedProducts(response.data.products.map(product => {
                    return {
                        data: product.product,
                        price: product.price,
                        unit: product.unit,
                        quantity: product.quantity
                    }
                }))
                setLoadingOpen(false)
            },
            error => {
                setLoadingOpen(false)
                handleSBOpen(CONNECTION_ERROR)
            }
        )

    }, [stockOutDocumentId])







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
                        EURL BST | BON DE SORTIE
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
                            id={stockOutDocumentId}
                            selectedFile={selectedFile}
                            status={stockOutDocument.status} />
                        <Box sx={{
                            mt: 3,
                            backgroundColor: "white",
                        }}>
                            <Card>
                                <CardContent>
                                    <Box >
                                        <form id="edit-stock-out-document-form"
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
                                                        {stockOutDocument.ref}
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
                                                    <InputLabel>
                                                        Destination
                                                    </InputLabel>
                                                    <Typography
                                                        sx={{
                                                            my: 2
                                                        }} >
                                                        {target_text[stockOutDocument.target]}
                                                    </Typography>
                                                </Grid>
                                                <Grid item
                                                    xs={4}>
                                                    <InputLabel>
                                                        Reference du source
                                                    </InputLabel>
                                                    <Typography
                                                        sx={{
                                                            my: 2
                                                        }} >
                                                        {stockOutDocument.target_detail}
                                                    </Typography>
                                                </Grid>
                                                <Grid item
                                                    xs={4}>
                                                    <InputLabel>
                                                        Note
                                                    </InputLabel>
                                                    <Typography
                                                        sx={{
                                                            my: 2
                                                        }} >
                                                        {stockOutDocument.note ? stockOutDocument.note : "_"}
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
                                                    <InputLabel>
                                                        Date de creation
                                                    </InputLabel>
                                                    <Typography
                                                        sx={{
                                                            my: 2
                                                        }} >
                                                        {format(new Date(stockOutDocument.created_on), 'dd/MM/yyyy hh:mm')}
                                                    </Typography>
                                                </Grid>
                                                <Grid item
                                                    xs={4}>
                                                    <InputLabel>
                                                        Crée par
                                                    </InputLabel>
                                                    <Typography
                                                        sx={{
                                                            my: 2
                                                        }} >
                                                        {stockOutDocument.created_by.fullname}
                                                    </Typography>
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
                                                        {stockOutDocument.store.name}
                                                    </Typography>
                                                </Grid>

                                            </Grid>
                                            {stockOutDocument.status === "1" && <Grid container
                                                spacing={1}
                                                columnSpacing={{
                                                    xs: 1, sm: 2, md: 3
                                                }}> <Grid item
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
                                                            Ajouter le bon de sortie accusé
                                                        </Button>
                                                    </InputLabel>
                                                </Grid>
                                                <Grid item
                                                    xs={4}>
                                                    <InputLabel>
                                                        Le nom du fichier
                                                    </InputLabel>
                                                    <Typography
                                                        sx={{
                                                            my: 2
                                                        }} >
                                                        {selectedFile ? selectedFile.name : "_"}
                                                    </Typography>
                                                </Grid></Grid>}



                                        </form>
                                        {stockOutDocument.status === "999" && <><InputLabel
                                            sx={{
                                                mb: '10px',
                                                mt: '20px',
                                            }}
                                        >
                                            le bon de sortie accusé
                                        </InputLabel>
                                            <StockOutDocumentFile

                                                files={stockOutDocument.file} /></>}


                                        <InputLabel
                                            sx={{
                                                mb: '10px',
                                                mt: '20px',
                                            }}
                                        >
                                            Les Articles
                                        </InputLabel>
                                        <StockOutAddProduct selectedProducts={selectedProducts}
                                            setAllConfirmed={setAllConfirmed}
                                            setSelectedProducts={setSelectedProducts}
                                            isAdd={false} />
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

EditStockOutDocument.getLayout = (page) => (
    <DashboardLayout>
        {page}
    </DashboardLayout>
);

export default EditStockOutDocument;
