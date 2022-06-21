import React from 'react';
import { useState, useEffect } from 'react';
import {Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import ItemsTable from './items-table'

const styles = StyleSheet.create({
   
    headerContainer:{
        // flexDirection: 'row',
        // marginBottom: 300,
    },
    documentTitle:{
        marginTop: 20,
        marginBottom: 20,
        color: 'black',
        textTransform: 'uppercase',
        textAlign: 'center',
        fontSize: 20,
        fontFamily: 'Helvetica-Bold',

    },
    
  });


const Body = ({purchaseRequest}) => {
    
    return(
    <View style={styles.headerContainer}>
        <Text style={styles.documentTitle}>Demande d`&apos;`achat</Text>
        <ItemsTable purchaseRequest={purchaseRequest}/>
    </View>
  );

}
  
  export default Body