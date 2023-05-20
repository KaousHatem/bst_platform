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
    FormControlLabel,
    Switch,

} from '@mui/material';
import { LocalizationProvider, DatePicker, AdapterDateFns } from '@mui/lab'
import InputLabel from '@mui/material/InputLabel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { DashboardLayout } from '../../components/dashboard-layout';

import { format } from 'date-fns'


import UXAccess from '../../utils/ux-access'
import ProformaRequestProvider from 'src/services/proforma-request-provider';
import { ProformaRequestAddToolbar } from 'src/components/proforma-request/proforma-request-add-toolbar';
import { ProformaRequestAddProduct } from '../../components/proforma-request/proforma-request-add-product';
import proformaRequestProductProvider from 'src/services/proforma-request-product-provider';
import SupplierProvider from 'src/services/supplier-provider';
import { ProformaInvoiceAddToolbar } from '../../components/proforma-invoice/proforma-invoice-add-toolbar';



const AddProformaInvoice = () => {
    const router = useRouter();

    const [errorSBOpen, setErrorSBOpen] = useState(false)

    const [loadingOpen, setLoadingOpen] = useState(true)
    const [errorSBText, setErrorSBText] = useState("")

    const [suppliers, setSuppliers] = useState([])
    const [proformaRequests, setProformaRequests] = useState([])
    const [uploaded, setUploaded] = useState(false)

    const CONNECTION_ERROR = "Probleme de connexion, Veuillez de ressayer"



    const handleClickOpen = () => {
        setOpen(true);
    };


    const handleOnSubmit = (e) => {
        e.preventDefault();
        setLoadingOpen(true)


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
            SupplierProvider.getSuppliers(),
            ProformaRequestProvider.getProformaRequests()
        ])
            .then(
                responses => {
                    console.log(responses)
                    setSuppliers(responses[0].data)
                    setProformaRequests(responses[1].data)
                    setLoadingOpen(false)
                },
                errors => {
                    setLoadingOpen(false)
                    handleSBOpen(CONNECTION_ERROR)
                }
            )

    }, [])


    return (
        <>
            <Head>
                <title>
                    EURL BST | AJOUTER FACUTRE PROFORMA
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
                    <ProformaInvoiceAddToolbar
                        isAddPage={true}
                    />
                    <Box sx={{
                        mt: 3,
                        backgroundColor: "white",
                    }}>
                        <Card>
                            <CardContent>
                                <Box >
                                    <form id="add-proforma-invoice-form"
                                        onSubmit={(event) => handleOnSubmit(event)}>
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
                                                    -
                                                </Typography>
                                            </Grid>
                                            <Grid item
                                                xs={6}>
                                                {
                                                    uploaded ?
                                                        <Button
                                                            color="primary"
                                                            variant="contained"
                                                            sx={{ mr: 4 }}
                                                        >
                                                            Importer le document
                                                        </Button> :
                                                        <Button
                                                            color="success"
                                                            variant="contained"
                                                            sx={{ mr: 4 }}
                                                        >
                                                            Le document
                                                        </Button>
                                                }


                                            </Grid>
                                            <Grid item
                                                xs={6}>
                                                <FormControl
                                                    fullWidth
                                                    sx={{
                                                        my: 1
                                                    }}
                                                >
                                                    <InputLabel id="demo-simple-select-label">Fournisseur *</InputLabel>
                                                    <Select
                                                        name="destination"
                                                        fullWidth
                                                        margin="dense"
                                                        label="Fournisseur"
                                                        labelId="demo-simple-select-label"
                                                        id="demo-simple-select"
                                                        required
                                                    >
                                                        {suppliers.length && suppliers.slice(0, suppliers.length).map((supplier) => (
                                                            <MenuItem key={supplier.id}
                                                                value={supplier.id}>{supplier.name}</MenuItem>
                                                        )) || <MenuItem key={0}
                                                            value={0}
                                                            disabled>aucun fournisseur</MenuItem>}
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
                                                    <InputLabel id="demo-simple-select-label">Demandes Facture Proforma *</InputLabel>
                                                    <Select
                                                        name="supplier"
                                                        fullWidth
                                                        margin="dense"
                                                        label="Demandes Facture Proforma "
                                                        labelId="demo-simple-select-label"
                                                        id="demo-simple-select"
                                                        required
                                                    >
                                                        {proformaRequests.length && proformaRequests.slice(0, proformaRequests.length).map((proformaRequest) => (
                                                            <MenuItem key={proformaRequest.id}
                                                                value={proformaRequest.id}>{proformaRequest.ref}</MenuItem>
                                                        )) || <MenuItem key={0}
                                                            value={0}
                                                            disabled>aucune demande</MenuItem>}
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid item
                                                xs={6}
                                            >
                                                <FormControlLabel
                                                    value="taxe"
                                                    control={<Switch color="primary" defaultChecked />}
                                                    label="TVA"
                                                    labelPlacement="start"
                                                />
                                            </Grid>

                                        </Grid>

                                    </form>
                                    {/* <ProformaRequestAddProduct selectedProducts={selectedProducts}
                                        setSelectedProducts={setSelectedProducts} /> */}
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

AddProformaInvoice.getLayout = (page) => (
    <DashboardLayout>
        {page}
    </DashboardLayout>
);

export default AddProformaInvoice;
