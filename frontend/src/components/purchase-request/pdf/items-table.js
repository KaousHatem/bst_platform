import React from 'react';
import { useState, useEffect } from 'react';
import {Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import TableHeader from './table/table-header'
import TableBody from './table/table-body'

const styles = StyleSheet.create({
   
    headerContainer:{
        // flexDirection: 'row',
        // marginTop: 20,
    },
    documentTitle:{
        marginTop: 20,
        color: 'black',
        textTransform: 'uppercase',
        textAlign: 'center',
        fontSize: 20,
        fontFamily: 'Helvetica-Bold',

    },
    
  });


const ItemsTable = ({purchaseRequest}) => {

    
    
    return(
    <View style={styles.headerContainer}>
        <TableHeader />
        <TableBody products={purchaseRequest.purchaseReqProducts} 
        delay={purchaseRequest.provision.delay} />
        
    </View>
  );

}
  
  export default ItemsTable