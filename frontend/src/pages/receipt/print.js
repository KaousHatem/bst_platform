
import React, { Component, Fragment } from 'react';
import { useRouter } from 'next/router';

import { useState, useEffect } from 'react';
import { Page, Document, Image,Font,  StyleSheet, PDFViewer,Svg, View } from '@react-pdf/renderer';
import {  Select, MenuItem, Box, Button, Container, Grid, Link, TextField, Typography, Card, CardContent, } from '@mui/material';
import QRGenerator from '../../components/purchase-request/pdf/qr-generator'

import Header from '../../components/receipt/pdf/header'
import Body from '../../components/receipt/pdf/body'
import Footer from '../../components/receipt/pdf/footer'

import ReceiptProvider from '../../services/receipt-provider'
import UserProvider from '../../services/user-provider'


Font.register({
  family: "Roboto",
  src:
    "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf"
});

const styles = StyleSheet.create({
    page: {
        fontFamily: 'Helvetica',
        fontSize: 11,
        paddingTop: 0,
        paddingLeft:20,
        paddingRight:20,
        paddingBottom:30,
        lineHeight: 1.5,
        display:'flex',
        flexDirection: 'column',
    }, 
  });

const ReceiptPage = () => {

    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [svgQrCode, setSvgQrCode] = useState()
    const [creator, setCreator] = useState(null)
    const [approver, setApprover] = useState(null)
    const [receiptId, setReceiptId] = useState(router.query.id)
    const [receipt, setReceipt] = useState()



    useEffect(()=>{
        console.log(receiptId)
        if(receiptId){
          ReceiptProvider.getReceipts(receiptId).then(
            (response) => {
              setReceipt(response.data)
              Promise.all([
                  UserProvider.getUserSignature(response.data.created_by.id),
                  ]).then(
                  responses=>{
                      setCreator(responses[0].data.private_key+'_'+responses[0].data.username)
                      setLoading(false)
                  },errors=>{
                    console.log(errors)
                  }
                  )

            },
            (error) => {
              console.log(error)
            }
            )
        }


    },[receiptId])

	return(
        !loading && 
		<Fragment>
      <Box sx={{display:'none'}}
      key={'qrGenerator_'+creator}>
          <QRGenerator value={creator}/>
      </Box>
			<PDFViewer width={window && window.innerWidth} 
            height={window && window.innerHeight} >
				<Document>
					<Page size="A4" 
                    style={styles.page}>
						<Header receipt={receipt} />
						<Body receipt={receipt} />
            <Footer creator={creator} 
              receipt={receipt} />
                        
					</Page>
				</Document>
			</PDFViewer>
		</Fragment>
        );
}


export default ReceiptPage