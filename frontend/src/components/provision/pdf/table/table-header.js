import React from 'react';
import { useState, useEffect } from 'react';
import {Text, View, StyleSheet, Image } from '@react-pdf/renderer';


const borderColor = '#04006e'
const textColor = '#04006e'
const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: "row",
        justifyContent: "space-between",
        borderColor: borderColor,
        backgroundColor: '#697d9e',
        borderWidth: 1,
        alignItems: 'center',
        height: 24,
        textAlign: 'center',
        fontStyle: 'bold',
        flexGrow: 1,

    },
    num: {
        color: textColor,
        height: '100%',
        width: '6%',
        display: 'flex',
        justifyContent: "center",
        textAlign: 'center',
        borderRightColor: borderColor,
        borderRightWidth: 1,
    },
    description: {
        color: textColor,
        display: 'flex',
        justifyContent: "center",
        textAlign: 'center',
        height: '100%',
        width: '62%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
    },
    unit: {
        color: textColor,
        display: 'flex',
        justifyContent: "center",
        textAlign: 'center',
        height: '100%',
        width: '10%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
    },
    qty: {
        color: textColor,
        display: 'flex',
        justifyContent: "center",
        textAlign: 'center',
        height: '100%',
        width: '10%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
    },
    
    delay: {
        color: textColor,
        display: 'flex',
        justifyContent: "center",
        textAlign: 'center',
        height: '100%',
        width: '12%'
    },
  });


const TableHeader = () => {
    
    return(
        <View style={styles.container}>
            <View style={styles.num}>
                <Text >N°</Text>
            </View>
            <View style={styles.description}>
                <Text>Designation</Text>
            </View>
            <View style={styles.unit}>
                <Text>Unité</Text>
            </View>
            <View style={styles.qty}>
                <Text>Quantité</Text>
            </View>
            <View style={styles.delay}>
                <Text>Delai</Text>
            </View>
        </View>
  );

}
  
  export default TableHeader