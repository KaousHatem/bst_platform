import React from 'react';
import { useState, useEffect } from 'react';
import {Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import TableHeader from './table-header'
import TableBody from './table-body'

const borderColor = '#04006e'
const textColor = '#04006e'
const styles = StyleSheet.create({
    container: {
        marginTop:"20px"
    }

    
  });


const MainTable = ({receipt}) => {
    
    return(
        <View style={styles.container} >
            <TableHeader />
            <TableBody products={receipt.receiptProducts} />
        </View>
        
  );

}
  
  export default MainTable