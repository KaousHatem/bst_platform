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

import { DashboardLayout } from '../../components/dashboard-layout';

import { format } from 'date-fns'


import UXAccess from '../../utils/ux-access'
import StoreProvider from 'src/services/store-provider';
import StockProvider from 'src/services/stock-provider';
import { TransferAddProduct } from 'src/components/transfer/transfer-add-product';
import { TransferAddToolbar } from '../../components/transfer/transfer-add-toolbar';

import TransferProvider from 'src/services/transfer-provider';
import TransferProductProvider from 'src/services/transfer-product-provider'
import TransferDocumentProvider from 'src/services/transfer-document-provider'
import UserProvider from '../../services/user-provider'

import { TransferUploadDialog } from 'src/components/transfer/transfer-upload-dialog';

const EditTransfer = () => {
    const router = useRouter();
    const transferId = router.query.id

    const [transfer, setTransfer] = useState()
    const [errorSBOpen, setErrorSBOpen] = useState(false)

    const [loadingOpen, setLoadingOpen] = useState(true)
    const [errorSBText, setErrorSBText] = useState("")

    let [stores, setStores] = useState([])

    let [sourceStore, setSourceStore] = useState('')

    let [storeProducts, setStoreProducts] = useState([])
    let [selectedProducts, setSelectedProducts] = useState([])

    let [error, setError] = useState(false)

    let [uploadOpen, setUploadOpen] = useState(false)
    let [selectedFile, setSelectedFile] = useState()
    let [loading, setLoading] = useState(false);
    let [isSelected, setIsSelected] = useState(false);

    let [isReceived, setIsReceived] = useState(false)

    let [userLocation, setUserLocation] = useState()

    const CONNECTION_ERROR = "Probleme de connexion, Veuillez de ressayer"
    const SOURCE_TARGET_ERROR = "Veuillez de choisir le destinataire different de expéditeur"
    const QUANTITY_ERROR = "Veuillez de verifier les quantités des articles"
    const NO_PRODUCT_ERROR = "Veuillez d'ajouter au moin un article"

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleUploadOpen = () => {
        setUploadOpen(true)
    }

    const handleUploadClose = () => {
        setUploadOpen(false)
    }

    const handleSelectFile = (e) => {

        if (e.target.files.length > 0 && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
            setIsSelected(true);
        }

    }




    const handleOnSubmit = (e) => {
        e.preventDefault();

        let formData = new FormData();

        formData.append("file", selectedFile);
        formData.append("transfer", transferId);

        let data = {
            status: "999",
            received_on: new Date(),
        }

        TransferDocumentProvider.addTransferDocument(formData).then(
            response => {
                handleUploadClose()
                setLoadingOpen(true)
                TransferProvider.updatePartialTransfer(data, transferId)
                    .then(
                        response => {

                            setLoadingOpen(false)
                            router.push('/transfer');
                        },
                        error => {
                            setLoadingOpen(false)
                            handleSBOpen(CONNECTION_ERROR)
                        }
                    )
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

    const handleSourceStoreChange = (e) => {
        setSourceStore(e.target.value)
        setLoadingOpen(true)
        StockProvider.getStocksByStore(e.target.value)
            .then(
                response => {
                    console.log(response.data)
                    setStoreProducts(response.data[0].id ? response.data : [])
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
            TransferProvider.getTransfers(transferId),
            !UXAccess.hasAllLocationAccess() && UserProvider.getMeUser(),
        ])
            .then(
                responses => {
                    setTransfer(responses[0].data)
                    setSelectedProducts(responses[0].data.products)
                    setIsReceived(responses[0].data.status === "999")
                    setLoadingOpen(false)

                    if (responses[1]) {
                        setUserLocation(responses[1].data.location)
                    }
                },
                errors => {
                    setLoadingOpen(false)
                    handleSBOpen(CONNECTION_ERROR)
                }
            )

    }, [transferId])


    return (<>
        {loadingOpen ?
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
                        EURL BST | AJOUTER TRANSFERT
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
                        <TransferAddToolbar
                            id={transferId}
                            handleUploadOpen={handleUploadOpen}
                            isReceived={isReceived}
                            document={transfer.document}
                            userLocation={userLocation}
                            targetLocation={transfer.target.location}
                        />
                        <Box sx={{
                            mt: 3,
                            backgroundColor: "white",
                        }}>
                            <Card>
                                <CardContent>
                                    <Box >
                                        <form id="edit-transfer-form"
                                            onSubmit={(event) => handleOnSubmit(event)}>
                                            <Grid container
                                                spacing={1}
                                                columnSpacing={{
                                                    xs: 1, sm: 2, md: 3
                                                }}>
                                                <Grid item
                                                    xs={12}>
                                                    <InputLabel>
                                                        Reference
                                                    </InputLabel>
                                                    <Typography
                                                        sx={{
                                                            my: 2
                                                        }} >
                                                        {transfer.ref}
                                                    </Typography>
                                                </Grid>
                                                <Grid item
                                                    xs={6}>
                                                    <InputLabel>
                                                        Transfer de
                                                    </InputLabel>
                                                    <Typography
                                                        sx={{
                                                            my: 2
                                                        }} >
                                                        {transfer.source.name}
                                                    </Typography>
                                                </Grid>
                                                <Grid item
                                                    xs={6}>
                                                    <InputLabel>
                                                        Transfer vers
                                                    </InputLabel>
                                                    <Typography
                                                        sx={{
                                                            my: 2
                                                        }} >
                                                        {transfer.target.name}
                                                    </Typography>
                                                </Grid>
                                                <Grid item
                                                    xs={6}>
                                                    <InputLabel>
                                                        Cree par
                                                    </InputLabel>
                                                    <Typography
                                                        sx={{
                                                            my: 2
                                                        }} >
                                                        {transfer.created_by.fullname}
                                                    </Typography>
                                                </Grid>
                                                <Grid item
                                                    xs={6}>
                                                    <InputLabel>
                                                        Cree on
                                                    </InputLabel>
                                                    <Typography
                                                        sx={{
                                                            my: 2
                                                        }} >
                                                        {format(new Date(transfer.created_on), 'yyyy-MM-dd hh:mm')}
                                                    </Typography>
                                                </Grid>
                                                <Grid item
                                                    xs={6}>
                                                    <InputLabel>
                                                        Reçu par
                                                    </InputLabel>
                                                    <Typography
                                                        sx={{
                                                            my: 2
                                                        }} >
                                                        {transfer.received_by === null ? "_" : transfer.received_by.fullname}
                                                    </Typography>
                                                </Grid>
                                                <Grid item
                                                    xs={6}>
                                                    <InputLabel>
                                                        Reçu on
                                                    </InputLabel>
                                                    <Typography
                                                        sx={{
                                                            my: 2
                                                        }} >
                                                        {transfer.received_on === null ? "_" : format(new Date(transfer.received_on), 'yyyy-MM-dd hh:mm')}
                                                    </Typography>
                                                </Grid>
                                            </Grid>

                                        </form>
                                        <TransferAddProduct storeProducts={storeProducts}
                                            selectedProducts={selectedProducts}
                                            setSelectedProducts={setSelectedProducts}
                                            setError={setError} />
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
                <TransferUploadDialog uploadOpen={uploadOpen}
                    handleUploadOpen={handleUploadOpen}
                    handleUploadClose={handleUploadClose}
                    handleOnSubmit={handleOnSubmit}
                    handleSelectFile={handleSelectFile}
                    loading={loading}
                    isSelected={isSelected} />
            </>}
    </>
    );
};

EditTransfer.getLayout = (page) => (
    <DashboardLayout>
        {page}
    </DashboardLayout>
);

export default EditTransfer;
