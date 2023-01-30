import React from 'react';
import { useState, useEffect } from 'react';
import {Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import ItemsTable from './items-table'
import bstLogo from '../../../../public/static/bst-logo.jpg'
import { format } from 'date-fns'


const styles = StyleSheet.create({
   
    footerContainer:{
        display:'flex',
        flexDirection: 'row',
        justifyContent: "space-between",
        marginTop: 'auto',
        // marginBottom: 128,
    },
    text:{
        color: 'black',
        letterSpacing: 0.5,
        fontFamily: 'Helvetica-Bold',
        fontSize:11,
        marginTop:5,
    },

    visaDemand: {
        display: 'flex',
        width: '70%',

    },
    VisaLogistic: {
        marginLeft:'auto',
        // width: '30%',
    },
    chop:{
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        alignSelf:'flex-start',
        // height: 128,
        // width: '90',
        // padding: 15,
        paddingHorizontal: 5,
        paddingTop:5,
        border:'3 solid #04006e',
        borderRadius: 10,
    },
    qrCode:{
        height: 75,
        width: 75,
    },
    logo:{
        height:30,
        width: 30
    }

    
  });


const Footer = ({creator, approver,purchaseRequest}) => {

    const getDate = (date) => {
        // const [year, month, day] = date.split('-')
        // console.log(day+'/'+month+'/'+year)
        return format(new Date(date),'dd/MM/yyyy')
    }

 
    
    return(
    <View style={styles.footerContainer}>
        <View style={styles.visaDemand}>
            <Text style={styles.text}>Direction Logistique</Text>
            <Text style={styles.text}>Date: {getDate(purchaseRequest.created_on)}</Text>
            
            <View style={styles.chop}>
                <Image style={styles.qrCode} 
                src={document.getElementById(creator).toDataURL()}/>
                <Image style={styles.logo}
                src={bstLogo.src}/>
            </View>
            
        </View>
        <View style={styles.VisaLogistic}>
            <Text style={styles.text}>Directeur General</Text>
            <Text style={styles.text}>Date: {purchaseRequest.approved_on!==null && getDate(purchaseRequest.approved_on)}</Text>
            
            {purchaseRequest.approved_by!==null && <View style={styles.chop}>
                <Image style={styles.qrCode} 
                src={document.getElementById(approver).toDataURL()}/>
                <Image style={styles.logo}
                src={bstLogo.src}/>
            </View>}
        </View>
    </View>
  );

}
  
  export default Footer