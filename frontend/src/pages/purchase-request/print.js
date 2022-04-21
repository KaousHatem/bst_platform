
import React, { Component, Fragment } from 'react';
import { useRouter } from 'next/router';

import { useState, useEffect } from 'react';
import { Page, Document, Image, StyleSheet, PDFViewer,Svg, View } from '@react-pdf/renderer';
import {  Select, MenuItem, Box, Button, Container, Grid, Link, TextField, Typography, Card, CardContent, } from '@mui/material';

import Header from '../../components/purchase-request/pdf/header'
import Body from '../../components/purchase-request/pdf/body'
import Footer from '../../components/purchase-request/pdf/footer'
import QRGenerator from '../../components/purchase-request/pdf/qr-generator'

import PurchaseRequestProvider from '../../services/purchase-request-provider'

const styles = StyleSheet.create({
    page: {
        fontFamily: 'Helvetica',
        fontSize: 11,
        paddingTop: 30,
        paddingLeft:40,
        paddingRight:40,
        paddingBottom:30,
        lineHeight: 1.5,
        display:'flex',
        flexDirection: 'column',
    }, 
  });

const PurchaseRequestPage = () => {

    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [svgQrCode, setSvgQrCode] = useState()
    const [value, setValue] = useState('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NDUwMTEyMTQsInVzZXJfaWQiOjF9.SsgZbjD_58LEoOEMxOFO9CB_uOcze3MFgJUisUG3TsY')
    const [purchaseRequestId, setPurchaseRequestId] = useState(router.query.id)
    const [purchaseRequest, setPurchaseRequest] = useState()



    useEffect(()=>{
        console.log(purchaseRequestId)
        if(purchaseRequestId){
          PurchaseRequestProvider.getPurchaseRequests(purchaseRequestId).then(
            (response) => {
              setPurchaseRequest(response.data)
              console.log(response.data)
              setLoading(false)
              
            },
            (error) => {
              console.log(error)
            }
            )
        }


    },[purchaseRequestId])
	return(
        !loading && 
		<Fragment>
            <Box sx={{display:'none'}}
            key={'qrGenerator_'+value}>
                <QRGenerator value={value}/>
            </Box>
			<PDFViewer width={window && window.innerWidth} 
            height={window && window.innerHeight} >
				<Document>
					<Page size="A4" 
                    style={styles.page}>
                    {console.log(purchaseRequest)}
						<Header purchaseRequest={purchaseRequest} />
						<Body purchaseRequest={purchaseRequest} />
                        <Footer value={value} 
                        purchaseRequest={purchaseRequest}/>
                        
					</Page>
				</Document>
			</PDFViewer>
		</Fragment>
        );
}


export default PurchaseRequestPage