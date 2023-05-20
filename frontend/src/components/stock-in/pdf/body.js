import React from 'react';
import { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import ItemsTable from './items-table'

const styles = StyleSheet.create({

    headerContainer: {
        marginBottom: 'auto',
    },


});


const Body = ({ stockInDocument, page, length }) => {

    return (
        <View style={styles.headerContainer}>
            <ItemsTable stockInDocument={stockInDocument}
                length={length}
                page={page} />
        </View>
    );

}

export default Body