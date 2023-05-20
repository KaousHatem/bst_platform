import React from 'react';
import { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import TableRow from './table-row'

import { parseNumber } from '../../../../utils/parsers'

const borderColor = 'black'
const textColor = 'black'
const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: "column",
        backgroundColor: 'white',
        borderRight: '1 solid ' + borderColor,
        borderLeft: '1 solid ' + borderColor,
        borderBottom: '1 solid ' + borderColor,
        alignItems: 'center',
        textAlign: 'center',
        flexGrow: 1,

    },

});


const TableBody = ({ products, page, length }) => {


    return (
        <View style={styles.container}>
            {products.slice(page * length, page * length + length).map((product) => (
                <TableRow
                    key={(products.indexOf(product) + 1)}
                    num={parseNumber(products.indexOf(product) + 1)}
                    product={product}
                    delay={products.indexOf(product) === 0}
                    last={products.indexOf(product) === (page + 1) * length - 1 || products.indexOf(product) === products.length - 1} />
            ))}


        </View>
    );

}

export default TableBody