import React from 'react';
import { useState, useEffect } from 'react';
import {Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import ItemsTable from './items-table'

const styles = StyleSheet.create({
   
    headerContainer:{
        // flexDirection: 'row',
        // marginBottom: 300,
    },
    
    
  });


const Body = ({purchaseOrder}) => {
    
    return(
    <View style={styles.headerContainer}>
        <ItemsTable purchaseOrder={purchaseOrder}/>
    </View>
  );

}
  
export default Body