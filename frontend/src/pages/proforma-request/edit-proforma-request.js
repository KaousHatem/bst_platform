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
    const [oldSelectedProducts, setOldSelectedProducts] = useState([])

    const CONNECTION_ERROR = "Probleme de connexion, Veuillez de ressayer"

    const proformaRequestId = router.query.id

    const [proformaRequest, setProformaRequest] = useState()




    const handleClickOpen = () => {
        setOpen(true);
    };


    const handleOnSubmit = (e) => {
        e.preventDefault();

        const add_product_list = selectedProducts.filter((product) => { return product.proformaRequestProductId === undefined })
            .map((product) => {
                return {
                    proformaInvoiceRequest: proformaRequestId,
                    product: product.id,
                    unit: product.unit.id,
                    quantity: product.quantity,
                }
            })
        const edit_product_list = selectedProducts.filter(product => {
            const productProformaRequest = oldSelectedProducts.find(productProformaRequest => { return productProformaRequest.id === product.id })
            if (productProformaRequest !== undefined) {
                return productProformaRequest.quantity !== product.quantity
            }
        })
            .map((product) => {
                return {
                    id: product.proformaRequestProductId,
                    proformaInvoiceRequest: proformaRequestId,
                    product: product.id,
                    unit: product.unit.id,
                    quantity: product.quantity,
                }
            })

        console.log(edit_product_list)
        const delete_product_list = oldSelectedProducts.filter((oldProduct) => {
            return !selectedProducts.map(product => { return product.proformaRequestProductId })
                .includes(oldProduct.proformaRequestProductId)
        }).map(oldProduct => { return oldProduct.proformaRequestProductId })


        setLoadingOpen(true)

        Promise.all([
            add_product_list.length && proformaRequestProductProvider.addProformaRequestProduct(add_product_list),
            edit_product_list.length && proformaRequestProductProvider.bulkUpdateProformaRequestProduct(edit_product_list),
            delete_product_list.length && proformaRequestProductProvider.bulkDeleteProformaRequestProduct(delete_product_list)
        ]).then(
            responses => {
                console.log(responses)
                setLoadingOpen(false)
                router.back();
            }
            , errors => {
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
        const loadData = () => {
            setLoadingOpen(true)

            proformaRequestProvider
                .getProformaRequests(proformaRequestId)
                .then(
                    response => {

                        console.log({
                            id: response.data.id,
                            ref: response.data.ref,
                        })
                        setProformaRequest({
                            id: response.data.id,
                            ref: response.data.ref,
                        })
                        setSelectedProducts(response
                            .data
                            .products
                            .map((product) => {
                                return {
                                    proformaRequestProductId: product.id,
                                    id: product.product.id,
                                    sku: product.product.sku,
                                    name: product.product.name,
                                    unit: product.unit,
                                    quantity: product.quantity,
                                }
                            }))
                        setOldSelectedProducts(response
                            .data
                            .products
                            .map((product) => {
                                return {
                                    proformaRequestProductId: product.id,
                                    id: product.product.id,
                                    sku: product.product.sku,
                                    name: product.product.name,
                                    unit: product.unit,
                                    quantity: product.quantity,
                                }
                            }))
                        setLoadingOpen(false)
                    }
                    , error => {
                        setLoadingOpen(false)
                        handleSBOpen(CONNECTION_ERROR)
                    }
                )
        }
        loadData()
    }, [proformaRequestId])


    return (
        <>
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
                            EURL BST | EDITER DEMANDE FACUTRE PROFORMA
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
                                id={proformaRequestId} />
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
                                                            {proformaRequest.ref}
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
            }
        </>
    );
};

AddProformaRequest.getLayout = (page) => (
    <DashboardLayout>
        {page}
    </DashboardLayout>
);

export default AddProformaRequest;
