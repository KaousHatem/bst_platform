import React from 'react';
import { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import TableHeader from './table/table-header'
import TableBody from './table/table-body'

const styles = StyleSheet.create({

    headerContainer: {
        // flexDirection: 'row',
        marginTop: 20,
    },

});


const ItemsTable = ({ stockInDocument, page, length }) => {



    return (
        <View style={styles.headerContainer}>
            <TableHeader />
            <TableBody products={stockInDocument.products}
                length={length}
                page={page} />

        </View>
    );

}

export default ItemsTable