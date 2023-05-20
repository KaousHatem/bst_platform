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
import { StockInDocumentFile } from '../../components/stock-in/stock-in-document-file'
import { DashboardLayout } from '../../components/dashboard-layout';

import { format } from 'date-fns'

import StockInDocumentProvider from '../../services/stock-in-document-provider'
import StockInDocumentSourceFileProvider from '../../services/stock-in-document-source-file-provider'
import StockInProvider from '../../services/stock-in-provider'
import stockInDocumentProductProvider from '../../services/stock-in-document-product-provider'
import StockInDocumentFileProvider from '../../services/stock-in-document-file-provider'

import UXAccess from '../../utils/ux-access'
import stockInProvider from '../../services/stock-in-provider';



const EditStockInDocument = () => {
    const router = useRouter();

    const [errorSBOpen, setErrorSBOpen] = useState(false)

    const [loadingOpen, setLoadingOpen] = useState(true)
    const [errorSBText, setErrorSBText] = useState("")


    let stockInDocumentId = router.query.id
    let [stockInDocument, setStockInDocument] = useState()

    let [selectedProducts, setSelectedProducts] = useState([])
    let [allConfirmed, setAllConfirmed] = useState([])
    let [selectedFile, setSelectedFile] = useState()

    const [open, setOpen] = React.useState(false);

    const source_text = {
        1: "Achat sans dossier",
        3: "Autre"
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
        formData.append('stock_in_document', stockInDocumentId)
        StockInDocumentFileProvider.addStockInDocumentFile(formData).then(
            response => {
                setLoadingOpen(false)
                const data = {
                    pathname: '/stock-in/',
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
        StockInDocumentProvider.getStockInDocuments(stockInDocumentId).then(
            response => {
                setStockInDocument(response.data)
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

    }, [stockInDocumentId])







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
                            id={stockInDocumentId}
                            selectedFile={selectedFile}
                            status={stockInDocument.status} />
                        <Box sx={{
                            mt: 3,
                            backgroundColor: "white",
                        }}>
                            <Card>
                                <CardContent>
                                    <Box >
                                        <form id="edit-stock-in-document-form"
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
                                                        {stockInDocument.ref}
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
                                                        Source
                                                    </InputLabel>
                                                    <Typography
                                                        sx={{
                                                            my: 2
                                                        }} >
                                                        {source_text[stockInDocument.source]}
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
                                                        {stockInDocument.source_id}
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
                                                        {stockInDocument.note ? stockInDocument.note : "_"}
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
                                                        {format(new Date(stockInDocument.created_on), 'dd/MM/yyyy hh:mm')}
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
                                                        {stockInDocument.created_by.fullname}
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
                                                        {stockInDocument.store.name}
                                                    </Typography>
                                                </Grid>

                                            </Grid>
                                            {stockInDocument.status === "1" && <Grid container
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
                                                            Ajouter le bon d&apos;entré accusé
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
                                        {stockInDocument.status === "999" && <><InputLabel
                                            sx={{
                                                mb: '10px',
                                                mt: '20px',
                                            }}
                                        >
                                            le bon d&apos;entré accusé
                                        </InputLabel>
                                            <StockInDocumentFile

                                                files={stockInDocument.file} /></>}
                                        <InputLabel
                                            sx={{
                                                mb: '10px',
                                                mt: '20px',
                                            }}
                                        >
                                            Les documents de jusitificatif
                                        </InputLabel>
                                        <StockInDocumentFile

                                            files={stockInDocument.source_file} />

                                        <InputLabel
                                            sx={{
                                                mb: '10px',
                                                mt: '20px',
                                            }}
                                        >
                                            Les Articles
                                        </InputLabel>
                                        <StockInAddProduct selectedProducts={selectedProducts}
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

EditStockInDocument.getLayout = (page) => (
    <DashboardLayout>
        {page}
    </DashboardLayout>
);

export default EditStockInDocument;
