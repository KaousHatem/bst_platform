import React from 'react';
import { useState, useEffect } from 'react';
import {Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import TableRow from './table-row'

import {parseNumber} from '../../../../utils/parsers'

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


const TableBody = ({provisionProducts ,delay, page, length}) => {

    

    
    return(
        <View style={styles.container}>
            {provisionProducts.slice(page*length,page*length+length).map((product) => (
                <TableRow 
                key={(provisionProducts.indexOf(product)+1)}
                num={parseNumber(provisionProducts.indexOf(product)+1)} 
                product={product} 
                delay_data={delay} 
                delay={provisionProducts.indexOf(product)===0} 
                last={provisionProducts.indexOf(product)===(page+1)*length-1 || provisionProducts.indexOf(product)===provisionProducts.length-1} />
            ))}
            
            
        </View>
  );

}
  
  export default TableBody