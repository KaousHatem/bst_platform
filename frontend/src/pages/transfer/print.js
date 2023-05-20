
import React, { Component, Fragment } from 'react';
import { useRouter } from 'next/router';

import { useState, useEffect } from 'react';
import { Page, Document, Image, Font, StyleSheet, PDFViewer, Svg, View } from '@react-pdf/renderer';
import { Select, MenuItem, Box, Button, Container, Grid, Link, TextField, Typography, Card, CardContent, } from '@mui/material';

import Header from '../../components/transfer/pdf/header'
import Body from '../../components/transfer/pdf/body'
import Footer from '../../components/transfer/pdf/footer'
import StaticFooter from '../../components/transfer/pdf/static-footer'

import TransferProvider from '../../services/transfer-provider'


Font.register({
    family: "Roboto",
    src:
        "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf"
});

const styles = StyleSheet.create({
    page: {
        fontFamily: 'Helvetica',
        fontSize: 11,
        paddingTop: 30,
        paddingLeft: 40,
        paddingRight: 40,
        paddingBottom: 5,
        lineHeight: 1.5,
        display: 'flex',
        flexDirection: 'column',
    },
});

const TransferPage = () => {

    const router = useRouter()
    const [loading, setLoading] = useState(true)

    const transferId = router.query.id
    const [transfer, setTransfer] = useState()

    const [pages, setPages] = useState(1)



    useEffect(() => {
        console.log(transferId)
        if (transferId) {
            TransferProvider.getTransfers(transferId).then(
                (response) => {
                    setTransfer(response.data)
                    console.log(response.data)
                    setPages(Math.ceil(response.data.products.length / 15))

                    setLoading(false)
                },
                (error) => {
                    console.log(error)
                }
            )
        }


    }, [transferId])

    return (
        !loading &&
        <Fragment>
            <PDFViewer width={window && window.innerWidth}
                height={window && window.innerHeight} >
                <Document>
                    {[...Array(pages).keys()].map((page) => (
                        <Page size="A4"
                            key={page}
                            style={styles.page}>
                            <Header transfer={transfer}
                                pages={pages}
                                page={page + 1} />
                            <Body transfer={transfer}
                                page={page}
                                length={15}
                            />
                            <Footer />
                            <StaticFooter />

                        </Page>
                    ))}

                </Document>
            </PDFViewer>
        </Fragment>
    );
}


export default TransferPage