
import React, { Component, Fragment } from 'react';
import { useRouter } from 'next/router';

import { useState, useEffect } from 'react';
import { Page, Document, Image, StyleSheet, PDFViewer,Svg, View } from '@react-pdf/renderer';
import {  Select, MenuItem, Box, Button, Container, Grid, Link, TextField, Typography, Card, CardContent, } from '@mui/material';

import HeaderProvision from '../../components/provision/pdf/header-provision'
import BodyProvision from '../../components/provision/pdf/body-provision'
import FooterProvision from '../../components/provision/pdf/footer-provision'
import QRGenerator from '../../components/provision/pdf/qr-generator'

import ProvisionProvider from '../../services/provision-provider'

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

const ProvisionPage = () => {
    const router = useRouter()
    const [svgQrCode, setSvgQrCode] = useState()
    const [value, setValue] = useState('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NDUwMTEyMTQsInVzZXJfaWQiOjF9.SsgZbjD_58LEoOEMxOFO9CB_uOcze3MFgJUisUG3TsY')
    const [provisionId, setProvisionId] = useState(router.query.id)
    const [provision, setProvision] = useState()



    useEffect(()=>{
        console.log(provisionId)
        if(provisionId){
          ProvisionProvider.getProvisions(provisionId).then(
            (response) => {
              setProvision(response.data)
              console.log(response.data)
              
            },
            (error) => {
              console.log(error)
            }
            )
        }


    },[provisionId])
	return(
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
						{provision && <HeaderProvision provision={provision} />}
						{provision && <BodyProvision provision={provision} />}
                        {provision && <FooterProvision value={value} 
                        provision={provision}/>}
                        
					</Page>
				</Document>
			</PDFViewer>
		</Fragment>
        );
}


export default ProvisionPage