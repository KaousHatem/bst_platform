import React from 'react';
import { useState, useEffect } from 'react';
import {Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import header from '../../../header.png'
import { format } from 'date-fns'

const styles = StyleSheet.create({
   
    headerContainer:{
        // flexDirection: 'row',
        // marginTop: 20,
    },

    projectContainer:{
        display:"flex",
        flexDirection:"row",
        justifyContent:"center",
        fontFamily: 'Helvetica-Bold',
    }

    
  });


const Header = ({receipt}) => {
    
    return(
    <View style={styles.headerContainer}>
        <Image width={window && window.innerWidth} 
        style={styles.logo} 
        src={header.src} />
        <View style={styles.projectContainer}>
            <Text >Projet: </Text>
            <Text >{receipt.purchaseOrder.purchaseRequest.provision.destination.name}</Text>
        </View> 
        
    </View>
  );

}
  
  export default Header