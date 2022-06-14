
import React, { Component, Fragment } from 'react';
import { useRouter } from 'next/router';

import { useState, useEffect } from 'react';
import { Page, Document, Image,Font,  StyleSheet, PDFViewer,Svg, View } from '@react-pdf/renderer';
import {  Select, MenuItem, Box, Button, Container, Grid, Link, TextField, Typography, Card, CardContent, } from '@mui/material';

import Header from '../../components/purchase-order/pdf/header'
import Body from '../../components/purchase-order/pdf/body'
import Footer from '../../components/purchase-order/pdf/footer'

import PurchaseOrderProvider from '../../services/purchase-order-provider'
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
        paddingTop: 30,
        paddingLeft:40,
        paddingRight:40,
        paddingBottom:30,
        lineHeight: 1.5,
        display:'flex',
        flexDirection: 'column',
    }, 
  });

const PurchaseOrderPage = () => {

    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [svgQrCode, setSvgQrCode] = useState()
    const [creator, setCreator] = useState(null)
    const [approver, setApprover] = useState(null)
    const [purchaseOrderId, setPurchaseOrderId] = useState(router.query.id)
    const [purchaseOrder, setPurchaseOrder] = useState()



    useEffect(()=>{
        console.log(purchaseOrderId)
        if(purchaseOrderId){
          PurchaseOrderProvider.getPurchaseOrders(purchaseOrderId).then(
            (response) => {
              setPurchaseOrder(response.data)
              console.log(response.data)
              setLoading(false)
            },
            (error) => {
              console.log(error)
            }
            )
        }


    },[purchaseOrderId])

	return(
        !loading && 
		<Fragment>
			<PDFViewer width={window && window.innerWidth} 
            height={window && window.innerHeight} >
				<Document>
					<Page size="A4" 
                    style={styles.page}>
                    {console.log(purchaseOrder)}
						<Header purchaseOrder={purchaseOrder} />
						<Body purchaseOrder={purchaseOrder} />
            <Footer />
                        
					</Page>
				</Document>
			</PDFViewer>
		</Fragment>
        );
}


export default PurchaseOrderPage