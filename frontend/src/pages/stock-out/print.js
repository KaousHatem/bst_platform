
import React, { Component, Fragment } from 'react';
import { useRouter } from 'next/router';

import { useState, useEffect } from 'react';
import { Page, Document, Image, Font, StyleSheet, PDFViewer, Svg, View } from '@react-pdf/renderer';
import { Select, MenuItem, Box, Button, Container, Grid, Link, TextField, Typography, Card, CardContent, } from '@mui/material';

import Header from '../../components/stock-out/pdf/header'
import Body from '../../components/stock-out/pdf/body'
import Footer from '../../components/stock-out/pdf/footer'
import StaticFooter from '../../components/stock-in/pdf/static-footer'

import StockOutDocumentProvider from '../../services/stock-out-document-provider'


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
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 5,
        lineHeight: 1.5,
        display: 'flex',
        flexDirection: 'column',
    },
});

const StockInDoumentPage = () => {

    const router = useRouter()
    const [loading, setLoading] = useState(true)

    const stockOutDocumentId = router.query.id
    const [stockOutDocument, setStockOutDocument] = useState()

    const [pages, setPages] = useState(1)



    useEffect(() => {
        console.log(stockOutDocumentId)
        if (stockOutDocumentId) {
            StockOutDocumentProvider.getStockOutDocuments(stockOutDocumentId).then(
                (response) => {
                    setStockOutDocument(response.data)
                    console.log(response.data)
                    setPages(Math.ceil(response.data.products.length / 15))

                    setLoading(false)
                },
                (error) => {
                    console.log(error)
                }
            )
        }


    }, [stockOutDocumentId])

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
                            <Header stockOutDocument={stockOutDocument}
                                pages={pages}
                                page={page + 1} />
                            <Body stockOutDocument={stockOutDocument}
                                page={page}
                                length={15}
                            />
                            <Footer stockOutDocument={stockOutDocument} />
                            <StaticFooter />

                        </Page>
                    ))}

                </Document>
            </PDFViewer>
        </Fragment>
    );
}


export default StockInDoumentPage