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
        paddingBottom:'30%',
        // backgroundColor:'green',
        // marginBottom: 128,
    },
    text:{
        color: 'black',
        letterSpacing: 0.5,
        fontFamily: 'Helvetica-Bold',
        fontSize:11,
        marginTop:15,
    },

    visaDemand: {
        display: 'flex',
        width: '40%',

    },
    VisaLogistic: {
        marginLeft:'auto',
        width: '30%',
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
        height: 90,
        width: 90,
    },
    logo:{
        height:30,
        width: 30
    }

    
  });


const Footer = ({}) => {

    
    
    return(
    <View style={styles.footerContainer}>
        <View style={styles.visaDemand}>
            <Text style={styles.text}>Accusé Fournisseur: </Text>
            
        </View>
        <View style={styles.VisaLogistic}>
            <Text style={styles.text}>Visa Acheteur:</Text>
        </View>
        <View style={styles.VisaLogistic}>
            <Text style={styles.text}>Visa Direction:</Text>
        </View>
    </View>
  );

}
  
  export default Footer