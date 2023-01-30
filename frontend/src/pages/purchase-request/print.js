
import React, { Component, Fragment } from 'react';
import { useRouter } from 'next/router';

import { useState, useEffect } from 'react';
import { Page, Document, Image, StyleSheet, PDFViewer,Svg, View } from '@react-pdf/renderer';
import {  Select, MenuItem, Box, Button, Container, Grid, Link, TextField, Typography, Card, CardContent, } from '@mui/material';

import Header from '../../components/purchase-request/pdf/header'
import Body from '../../components/purchase-request/pdf/body'
import Footer from '../../components/purchase-request/pdf/footer'
import QRGenerator from '../../components/purchase-request/pdf/qr-generator'
import StaticFooter from '../../components/purchase-request/pdf/static-footer'


import PurchaseRequestProvider from '../../services/purchase-request-provider'
import UserProvider from '../../services/user-provider'

const styles = StyleSheet.create({
    page: {
        fontFamily: 'Helvetica',
        fontSize: 11,
        paddingTop: 10,
        paddingLeft:40,
        paddingRight:40,
        paddingBottom:5,
        lineHeight: 1.5,
        display:'flex',
        flexDirection: 'column',
    }, 
  });

const PurchaseRequestPage = () => {

    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [svgQrCode, setSvgQrCode] = useState()
    const [creator, setCreator] = useState(null)
    const [approver, setApprover] = useState(null)
    const [purchaseRequestId, setPurchaseRequestId] = useState(router.query.id)
    const [purchaseRequest, setPurchaseRequest] = useState()

    const [pages, setPages] = useState(1)



    useEffect(()=>{
        console.log(purchaseRequestId)
        if(purchaseRequestId){
          PurchaseRequestProvider.getPurchaseRequests(purchaseRequestId).then(
            (response) => {
              setPurchaseRequest(response.data)
              setPages(Math.ceil(response.data.purchaseReqProducts.length/20))
              console.log(response.data)
              Promise.all([
                  UserProvider.getUserSignature(response.data.created_by.id),
                  (response.data.approved_by!==null) && UserProvider.getUserSignature(response.data.approved_by.id)
                  ]).then(
                  responses=>{
                      setCreator(responses[0].data.private_key+'_'+responses[0].data.username)
                      if(responses[1]){
                          setApprover(responses[1].data.private_key+'_'+responses[1].data.username)
                      }
                      setLoading(false)
                  },
                  )
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
            key={'qrGenerator_'+creator}>
                <QRGenerator value={creator}/>
            </Box>
            {approver !== null && <Box sx={{display:'none'}}
            key={'qrGenerator_'+approver}>
                <QRGenerator value={approver}/>
            </Box>}
			<PDFViewer width={window && window.innerWidth} 
            height={window && window.innerHeight} >
				<Document>
                    {[...Array(pages).keys()].map((page)=>(
                        <Page size="A4" 
                        style={styles.page}>
                            <Header purchaseRequest={purchaseRequest} 
                            pages={pages} 
                            page={page+1}/>
                            <Body purchaseRequest={purchaseRequest} 
                            page={page} 
                            length="20"/>
                            {page+1 == pages && <Footer creator={creator} 
                                approver={approver}
                            purchaseRequest={purchaseRequest}/>}
                            <StaticFooter />
                            
                        </Page>
                    ))}
				</Document>
			</PDFViewer>
		</Fragment>
        );
}


export default PurchaseRequestPage