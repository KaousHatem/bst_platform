
import React, { Component, Fragment } from 'react';
import { useRouter } from 'next/router';

import { useState, useEffect } from 'react';
import { Page, Document, Image, StyleSheet, PDFViewer, Svg, View } from '@react-pdf/renderer';
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
} from '@mui/material';

import HeaderProvision from '../../components/provision/pdf/header-provision'
import BodyProvision from '../../components/provision/pdf/body-provision'
import FooterProvision from '../../components/provision/pdf/footer-provision'
import StaticFooter from '../../components/provision/pdf/static-footer'
import QRGenerator from '../../components/provision/pdf/qr-generator'

import ProvisionProvider from '../../services/provision-provider'
import UserProvider from '../../services/user-provider'

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

const ProvisionPage = () => {
    const router = useRouter()
    const [svgQrCode, setSvgQrCode] = useState()
    const [value, setValue] = useState('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NDUwMTEyMTQsInVzZXJfaWQiOjF9.SsgZbjD_58LEoOEMxOFO9CB_uOcze3MFgJUisUG3TsY')
    const [provisionId, setProvisionId] = useState(router.query.id)
    const [provision, setProvision] = useState()

    const [creator, setCreator] = useState(null)
    const [approver, setApprover] = useState(null)

    const [pages, setPages] = useState(1)

    const [loadingOpen, setLoadingOpen] = useState(true)
    const [errorSBText, setErrorSBText] = useState("")




    useEffect(() => {

        if (provisionId) {
            ProvisionProvider.getProvisions(provisionId).then(
                (response) => {
                    setProvision(response.data)
                    console.log(response.data)
                    setPages(Math.ceil(response.data.provisionProducts.length / 20))
                    Promise.all([
                        UserProvider.getUserSignature(response.data.created_by.id),
                        (response.data.status !== "4" && response.data.approved_by !== null) && UserProvider.getUserSignature(response.data.approved_by.id)
                    ]).then(
                        responses => {
                            setCreator(responses[0].data.private_key + '_' + responses[0].data.username)
                            if (responses[1]) {
                                setApprover(responses[1].data.private_key + '_' + responses[1].data.username)
                            }
                            setLoadingOpen(false)
                        }, errors => {
                            setLoadingOpen(false)
                        }
                    )
                },
                (error) => {
                    console.log(error)
                    setLoadingOpen(false)
                }
            )
        }


    }, [provisionId])
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
            <Box sx={{ display: 'none' }}
                key={'qrGenerator_' + creator}>
                <QRGenerator value={creator} />
            </Box>
            {approver !== null && <Box sx={{ display: 'none' }}
                key={'qrGenerator_' + approver}>
                <QRGenerator value={approver} />
            </Box>}
            <PDFViewer width={window && window.innerWidth}
                height={window && window.innerHeight} >
                <Document>
                    {[...Array(pages).keys()].map((page) => (
                        <Page size="A4"
                            key={page}
                            style={styles.page}>
                            <HeaderProvision provision={provision}
                                pages={pages}
                                page={page + 1} />
                            <BodyProvision provision={provision}
                                page={page}
                                length="20" />
                            {page + 1 == pages &&
                                <FooterProvision value={value}
                                    provision={provision}
                                    creator={creator}
                                    approver={approver} />
                            }
                            <StaticFooter />

                        </Page>
                    ))}


                </Document>
            </PDFViewer>
        </Fragment>

    );
}


export default ProvisionPage