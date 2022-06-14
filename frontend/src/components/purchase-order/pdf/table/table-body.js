import React from 'react';
import { useState, useEffect } from 'react';
import {Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import TableRow from './table-row'

const borderColor = 'black'
const textColor = 'black'
const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: "column",
        backgroundColor: 'white',
        borderRight: '1 solid '+borderColor,
        borderLeft: '1 solid '+borderColor,
        borderBottom: '1 solid '+borderColor,
        alignItems: 'center',
        textAlign: 'center',
        flexGrow: 1,

    },
    
  });


const TableBody = ({products ,delay}) => {

    
    return(
        <View style={styles.container}>
            {products.map((product) => (
                <TableRow 
                key={'0'+(products.indexOf(product)+1)}
                num={'0'+(products.indexOf(product)+1)} 
                product={product.purchaseProduct} 
                last={products.indexOf(product)===products.length-1} />
            ))}
            
            
        </View>
  );

}
  
  export default TableBody