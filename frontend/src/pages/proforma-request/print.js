
import React, { Component, Fragment } from 'react';
import { useRouter } from 'next/router';

import { useState, useEffect } from 'react';
import { Page, Document, Image, StyleSheet, PDFViewer, Svg, View } from '@react-pdf/renderer';
import { Select, MenuItem, Box, Button, Container, Grid, Link, TextField, Typography, Card, CardContent, Backdrop, CircularProgress, } from '@mui/material';

import Header from '../../components/proforma-request/pdf/header'
import Body from '../../components/proforma-request/pdf/body'
import Footer from '../../components/proforma-request/pdf/footer'
import StaticFooter from '../../components/proforma-request/pdf/static-footer'
import ProformaRequestProvider from 'src/services/proforma-request-provider';



const styles = StyleSheet.create({
    page: {
        fontFamily: 'Helvetica',
        fontSize: 11,
        paddingTop: 10,
        paddingLeft: 40,
        paddingRight: 40,
        paddingBottom: 5,
        lineHeight: 1.5,
        display: 'flex',
        flexDirection: 'column',
    },
});

const PurchaseRequestPage = () => {

    const router = useRouter()

    const proformaRequestId = router.query.id

    const [proformaRequest, setProformaRequest] = useState()

    const [pages, setPages] = useState(1)

    const [loadingOpen, setLoadingOpen] = useState(true)



    useEffect(() => {
        if (proformaRequestId) {
            ProformaRequestProvider
                .getProformaRequests(proformaRequestId)
                .then(
                    (response) => {
                        console.log(response.data)
                        setProformaRequest(response.data)
                        setPages(Math.ceil(response.data.products.length / 18))
                        setLoadingOpen(false)
                    },
                    (error) => {
                        console.log(error)
                        setLoadingOpen(false)
                    }
                )
        }


    }, [proformaRequestId])
    return (
        loadingOpen &&
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loadingOpen}
            onClick={() => { setLoadingOpen(false) }}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
        ||
        <Fragment>
            <PDFViewer width={window && window.innerWidth}
                height={window && window.innerHeight} >
                <Document>
                    {[...Array(pages).keys()].map((page) => (
                        <Page size="A4"
                            key={page}
                            style={styles.page}>
                            <Header proformaRequest={proformaRequest}
                                pages={pages}
                                page={page + 1} />
                            <Body proformaRequest={proformaRequest}
                                page={page}
                                length={18} />
                            {page + 1 == pages && <Footer />}
                            <StaticFooter />

                        </Page>
                    ))}
                </Document>
            </PDFViewer>
        </Fragment>
    );
}


export default PurchaseRequestPage