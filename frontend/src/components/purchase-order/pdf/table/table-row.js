import React from 'react';
import { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const borderColor = 'black'
const textColor = 'black'
const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: 'white',
        alignItems: 'center',
        minHeight: 17,
        textAlign: 'center',
        flexGrow: 1,
        fontSize: '9',
        // width: "80%"

    },
    num: {
        color: textColor,
        height: '100%',
        width: '6%',
        display: 'flex',
        justifyContent: "center",
        textAlign: 'center',
        borderRight: '1 solid ' + borderColor,
        borderBottom: '1 solid ' + borderColor,
    },
    description: {
        color: textColor,
        display: 'flex',
        justifyContent: "center",
        textAlign: 'left',
        paddingHorizontal: "5px",
        height: '100%',
        width: '76%',
        borderRight: '1 solid ' + borderColor,
        borderBottom: '1 solid ' + borderColor,
        flexWrap: 'wrap',

    },
    unit: {
        color: textColor,
        display: 'flex',
        justifyContent: "center",
        textAlign: 'center',
        height: '100%',
        width: '8%',
        borderRight: '1 solid ' + borderColor,
        borderBottom: '1 solid ' + borderColor,

    },
    qty: {
        color: textColor,
        display: 'flex',
        justifyContent: "center",
        textAlign: 'center',
        height: '100%',
        width: '10%',
        // borderRight: '1 solid ' + borderColor,
        borderBottom: '1 solid ' + borderColor,
    },


    last: {
        borderBottom: '0'
    }
});


const TableRow = ({ num, product, last = false }) => {




    return (
        <View style={styles.container}>
            <View style={[styles.num, last && styles.last]}>
                <Text >{num}</Text>
            </View>
            <View style={[styles.description, last && styles.last]}>
                <Text>{product.provisionProduct.product.name}</Text>
            </View>
            <View style={[styles.unit, last && styles.last]}>
                <Text>{product.unit.ref}</Text>
            </View>
            <View style={[styles.qty, last && styles.last]}>
                <Text>{product.quantity}</Text>
            </View>
        </View>
    );

}

export default TableRow