
import React, { Component, Fragment } from 'react';
import { useRouter } from 'next/router';

import { useState, useEffect } from 'react';
import { Page, Document, Image, Font, StyleSheet, PDFViewer, Svg, View } from '@react-pdf/renderer';
import { Select, MenuItem, Box, Button, Container, Grid, Link, TextField, Typography, Card, CardContent, } from '@mui/material';

import Header from '../../components/stock-in/pdf/header'
import Body from '../../components/stock-in/pdf/body'
import Footer from '../../components/stock-in/pdf/footer'
import StaticFooter from '../../components/stock-in/pdf/static-footer'

import StockInDocumentProvider from '../../services/stock-in-document-provider'


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

    const stockInDocumentId = router.query.id
    const [stockInDocument, setStockInDocument] = useState()

    const [pages, setPages] = useState(1)



    useEffect(() => {
        console.log(stockInDocumentId)
        if (stockInDocumentId) {
            StockInDocumentProvider.getStockInDocuments(stockInDocumentId).then(
                (response) => {
                    setStockInDocument(response.data)
                    console.log(response.data)
                    setPages(Math.ceil(response.data.products.length / 15))

                    setLoading(false)
                },
                (error) => {
                    console.log(error)
                }
            )
        }


    }, [stockInDocumentId])

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
                            <Header stockInDocument={stockInDocument}
                                pages={pages}
                                page={page + 1} />
                            <Body stockInDocument={stockInDocument}
                                page={page}
                                length={15}
                            />
                            <Footer stockInDocument={stockInDocument} />
                            <StaticFooter />

                        </Page>
                    ))}

                </Document>
            </PDFViewer>
        </Fragment>
    );
}


export default StockInDoumentPage