import React from 'react';
import { useState, useEffect } from 'react';
import {Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { format } from 'date-fns'

const borderColor = 'black'
const textColor = 'black'
const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: 'white',
        // borderRight: '1 solid '+borderColor,
        // borderLeft: '1 solid '+borderColor,
        alignItems: 'center',
        // height: 17,
        minHeight: 17,
        textAlign: 'center',
        flexGrow: 1,

    },
    num: {
        color: textColor,
        height: '100%',
        width: '6%',
        display: 'flex',
        justifyContent: "center",
        textAlign: 'center',
        fontSize:'9',
        borderRight: '1 solid '+borderColor,
        borderBottom: '1 solid '+borderColor,
    },
    description: {
        color: textColor,
        display: 'flex',
        justifyContent: "center",
        textAlign: 'left',
        paddingHorizontal:'5px',
        height: '100%',
        width: '62%',
        fontSize:'9',
        borderRight: '1 solid '+borderColor,
        borderBottom: '1 solid '+borderColor,
    },
    unit: {
        color: textColor,
        display: 'flex',
        justifyContent: "center",
        textAlign: 'center',
        height: '100%',
        width: '10%',
        fontSize:'9',
        borderRight: '1 solid '+borderColor,
        borderBottom: '1 solid '+borderColor,
        
    },
    qty: {
        color: textColor,
        display: 'flex',
        justifyContent: "center",
        textAlign: 'center',
        height: '100%',
        width: '10%',
        fontSize:'9',
        borderRight: '1 solid '+borderColor,
        borderBottom: '1 solid '+borderColor,
    },
    
    delay: {
        color: textColor,
        display: 'flex',
        justifyContent: "center",
        textAlign: 'center',
        height: '100%',
        width: '12%',
        fontSize:'9',
    },
    last:{
        borderBottom: '0'
    }
  });


const TableRow = ({num, product, delay_data, delay=false, last=false}) => {

    
    const getDate = (date) => {
        return format(new Date(date),'dd/MM/yyyy')
    }

  
    
    return(
        <View style={styles.container}>
            <View style={[styles.num, last && styles.last]}>
                <Text >{num}</Text>
            </View>
            <View style={[styles.description, last && styles.last]}>
                <Text>{product.product.name}</Text>
            </View>
            <View style={[styles.unit, last && styles.last]}>
                <Text>{product.unit.ref}</Text>
            </View>
            <View style={[styles.qty, last && styles.last]}>
                <Text>{product.quantity}</Text>
            </View>
            <View style={styles.delay}>
                {delay && <Text>{getDate(delay_data)}</Text>}  
            </View>
        </View>
  );

}
  
  export default TableRow