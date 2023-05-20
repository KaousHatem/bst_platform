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
import proformaRequestProvider from 'src/services/proforma-request-provider';
import { ProformaRequestAddToolbar } from 'src/components/proforma-request/proforma-request-add-toolbar';
import { ProformaRequestAddProduct } from '../../components/proforma-request/proforma-request-add-product';
import proformaRequestProductProvider from 'src/services/proforma-request-product-provider';



const AddProformaRequest = () => {
    const router = useRouter();

    const [errorSBOpen, setErrorSBOpen] = useState(false)

    const [loadingOpen, setLoadingOpen] = useState(true)
    const [errorSBText, setErrorSBText] = useState("")

    const [selectedProducts, setSelectedProducts] = useState([])

    const CONNECTION_ERROR = "Probleme de connexion, Veuillez de ressayer"



    const handleClickOpen = () => {
        setOpen(true);
    };


    const handleOnSubmit = (e) => {
        e.preventDefault();
        setLoadingOpen(true)
        proformaRequestProvider.addProformaRequest({}).then(
            response => {
                const product_data = selectedProducts.map((product) => {
                    return {
                        proformaInvoiceRequest: response.data.id,
                        product: product.id,
                        unit: product.unit.id,
                        quantity: product.quantity,
                    }
                })

                proformaRequestProductProvider
                    .addProformaRequestProduct(product_data)
                    .then(
                        response => {
                            setLoadingOpen(false)
                            router.back();
                        }
                        , error => {
                            setLoadingOpen(false)
                            handleSBOpen(CONNECTION_ERROR)
                        }
                    )

            }, error => {
                setLoadingOpen(false)
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


    return (
        <>
            <Head>
                <title>
                    EURL BST | AJOUTER DEMANDE FACUTRE PROFORMA
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
                    <ProformaRequestAddToolbar
                        isAddPage={true}
                    />
                    <Box sx={{
                        mt: 3,
                        backgroundColor: "white",
                    }}>
                        <Card>
                            <CardContent>
                                <Box >
                                    <form id="add-proforma-request-form"
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

                                    </form>
                                    <ProformaRequestAddProduct selectedProducts={selectedProducts}
                                        setSelectedProducts={setSelectedProducts} />
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

AddProformaRequest.getLayout = (page) => (
    <DashboardLayout>
        {page}
    </DashboardLayout>
);

export default AddProformaRequest;
