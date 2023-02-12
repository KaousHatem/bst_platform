import React from 'react';
import { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import ItemsTable from './items-table'

const styles = StyleSheet.create({

  headerContainer: {
    // flexDirection: 'row',
    // marginBottom: 300,
    marginBottom: 'auto',
  },


});


const Body = ({ purchaseRequest, page, length }) => {

  return (
    <View style={styles.headerContainer}>

      <ItemsTable purchaseRequest={purchaseRequest}
        length={length}
        page={page} />
    </View>
  );

}

export default Body