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


const AddTransfer = () => {
    const router = useRouter();

    const [errorSBOpen, setErrorSBOpen] = useState(false)

    const [loadingOpen, setLoadingOpen] = useState(true)
    const [errorSBText, setErrorSBText] = useState("")

    let [stores, setStores] = useState([])

    let [sourceStore, setSourceStore] = useState('')

    let [storeProducts, setStoreProducts] = useState([])
    let [selectedProducts, setSelectedProducts] = useState([])

    let [error, setError] = useState(false)

    const CONNECTION_ERROR = "Probleme de connexion, Veuillez de ressayer"
    const SOURCE_TARGET_ERROR = "Veuillez de choisir le destinataire different de expéditeur"
    const QUANTITY_ERROR = "Veuillez de verifier les quantités des articles"
    const NO_PRODUCT_ERROR = "Veuillez d'ajouter au moin un article"

    const handleClickOpen = () => {
        setOpen(true);
    };

    const validation = (e) => {
        if (e.target.source.value === e.target.target.value) {
            handleSBOpen(SOURCE_TARGET_ERROR)
            return false
        }
        if (error) {
            handleSBOpen(QUANTITY_ERROR)
            return false
        }
        if (selectedProducts.length === 0) {
            handleSBOpen(NO_PRODUCT_ERROR)
            return false
        }
        return true
    }
    const handleOnSubmit = (e) => {
        e.preventDefault();

        if (!validation(e)) {
            return false
        }

        let data = {
            source: e.target.source.value,
            target: e.target.target.value,
        }
        console.log(data)

        setLoadingOpen(true)
        TransferProvider.addTransfer(data)
            .then(
                response => {
                    let transferId = response.data.id
                    let data_product = selectedProducts.map(product => {
                        console.log(product)
                        return {
                            product: product.product.id,
                            price: product.price,
                            quantity: product.quantity,
                            transfer: transferId,
                            unit: product.product.base_unit.id
                        }
                    })

                    TransferProductProvider.addTransferProduct(data_product)
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
            StoreProvider.getStores(),
        ])
            .then(
                responses => {
                    setStores(responses[0].data)
                    setLoadingOpen(false)
                },
                errors => {
                    setLoadingOpen(false)
                    handleSBOpen(CONNECTION_ERROR)
                }
            )

    }, [])


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
                            isAdd={true}
                        />
                        <Box sx={{
                            mt: 3,
                            backgroundColor: "white",
                        }}>
                            <Card>
                                <CardContent>
                                    <Box >
                                        <form id="add-transfer-form"
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
                                                        -
                                                    </Typography>
                                                </Grid>
                                                <Grid item
                                                    xs={6}>
                                                    <FormControl
                                                        fullWidth
                                                        sx={{
                                                            my: 1
                                                        }}
                                                    >
                                                        <InputLabel id="demo-simple-select-label">Transfert De *</InputLabel>
                                                        <Select
                                                            name="source"
                                                            fullWidth
                                                            margin="dense"
                                                            label="Transfert De *"
                                                            labelId="demo-simple-select-label"
                                                            id="demo-simple-select"
                                                            value={sourceStore}
                                                            defaultValue=""
                                                            onChange={handleSourceStoreChange}
                                                            required
                                                        >
                                                            {stores.slice(0, stores.length).map((store) => (
                                                                <MenuItem key={store.id}
                                                                    value={store.id}>{store.name}</MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item
                                                    xs={6}>
                                                    <FormControl
                                                        fullWidth
                                                        sx={{
                                                            my: 1
                                                        }}
                                                    >
                                                        <InputLabel id="demo-simple-select-label">Transfert vers *</InputLabel>
                                                        <Select
                                                            name="target"
                                                            fullWidth
                                                            margin="dense"
                                                            label="Transfert vers"
                                                            labelId="demo-simple-select-label"
                                                            id="demo-simple-select"
                                                            // disabled={!UXAccess.hasAllLocationAccess()}
                                                            required
                                                        >
                                                            {stores.slice(0, stores.length).map((store) => (
                                                                <MenuItem key={store.id}
                                                                    value={store.id}>{store.name}</MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                            </Grid>

                                        </form>
                                        <TransferAddProduct storeProducts={storeProducts}
                                            selectedProducts={selectedProducts}
                                            setSelectedProducts={setSelectedProducts}
                                            setError={setError}
                                            isAddPage={true} />
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
            </>}
    </>
    );
};

AddTransfer.getLayout = (page) => (
    <DashboardLayout>
        {page}
    </DashboardLayout>
);

export default AddTransfer;
