import React from 'react';
import { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import ItemsTable from './items-table'

const styles = StyleSheet.create({

  headerContainer: {

    marginBottom: 'auto',
  },


});


const Body = ({ proformaRequest, page, length }) => {

  return (
    <View style={styles.headerContainer}>

      <ItemsTable proformaRequest={proformaRequest}
        length={length}
        page={page} />
    </View>
  );

}

export default Body