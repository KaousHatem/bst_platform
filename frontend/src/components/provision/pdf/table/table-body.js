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


const TableBody = ({provisionProducts ,delay}) => {

    
    return(
        <View style={styles.container}>
            {provisionProducts.map((product) => (
                <TableRow 
                key={'0'+(provisionProducts.indexOf(product)+1)}
                num={'0'+(provisionProducts.indexOf(product)+1)} 
                product={product} 
                delay_data={delay} 
                delay={provisionProducts.indexOf(product)===0} 
                last={provisionProducts.indexOf(product)===provisionProducts.length-1} />
            ))}
            
            
        </View>
  );

}
  
  export default TableBody