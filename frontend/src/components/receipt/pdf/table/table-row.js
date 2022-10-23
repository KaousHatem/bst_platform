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
        // justifyContent: "space-between",
        backgroundColor: 'white',
        // borderRight: '1 solid '+borderColor,
        // borderLeft: '1 solid '+borderColor,
        alignItems: 'center',
        // height: 24,
        textAlign: 'center',
        // flexGrow: 1,
        fontSize:'9'

    },
    num: {
        color: textColor,
        height: '100%',
        width: '4%',
        display: 'flex',
        justifyContent: "center",
        textAlign: 'center',
        borderRight: '1 solid '+borderColor,
        borderBottom: '1 solid '+borderColor,
    },
    description: {
        color: textColor,
        display: 'flex',
        justifyContent: "center",
        textAlign: 'center',
        height: '100%',
        width: '30%',
        borderRight: '1 solid '+borderColor,
        borderBottom: '1 solid '+borderColor,
    },
    qty: {
        color: textColor,
        display: 'flex',
        justifyContent: "center",
        textAlign: 'center',
        height: '100%',
        width: '8%',
        borderRight: '1 solid '+borderColor,
        borderBottom: '1 solid '+borderColor,
    },
    
    conformity:{
        color: textColor,
        display: 'flex',
        justifyContent: "center",
        textAlign: 'center',
        height: '100%',
        width: '9%',
        borderRight: '1 solid '+borderColor,
        borderBottom: '1 solid '+borderColor,
    },

    note:{
        color: textColor,
        display: 'flex',
        justifyContent: "center",
        textAlign: 'center',
        height: '100%',
        width: '24%',
        borderRight: '1 solid '+borderColor,
        borderBottom: '1 solid '+borderColor,
    },
    last:{
        borderBottom: '0'
    }
  });


const TableRow = ({num, product, last=false}) => {
     const getDate = (date) => {
        return format(new Date(date),'dd/MM/yyyy')
    }

    
    return(
        <View style={styles.container}>
            <View style={[styles.num, last && styles.last]}>
                <Text >{num}</Text>
            </View>
            <View style={[styles.description, last && styles.last]}>
                <Text>{product.purchaseOrderProduct.purchaseProduct.provisionProduct.product.name}</Text>
            </View>
            <View style={[styles.qty, last && styles.last]}>
                <Text>{product.purchaseOrderProduct.purchaseProduct.quantity}</Text>
            </View>
            <View style={[styles.qty, last && styles.last]}>
                <Text>{product.quantity_receipt}</Text>
            </View>
            <View style={[styles.qty, last && styles.last]}>
                <Text>{product.quantity_accepted}</Text>
            </View>
            <View style={[styles.conformity, last && styles.last]}>
                <Text>{product.conformity===true ? "X" : ""}</Text>
            </View>
            <View style={[styles.conformity, last && styles.last]}>
                <Text>{product.conformity===false ? "X" : ""}</Text>
            </View>
            <View style={[styles.note, last && styles.last]}>
                <Text>{product.note}</Text>
            </View>
            
        </View>
  );

}
  
  export default TableRow