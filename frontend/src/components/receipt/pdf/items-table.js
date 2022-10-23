import React from 'react';
import { useState, useEffect } from 'react';
import {Text, View, StyleSheet, Image } from '@react-pdf/renderer';
// import TableHeader from './table/table-header'

import TopTable from './table/top-table'
import MainTable from './table/main-table'

// import TableBody from './table/table-body'

const styles = StyleSheet.create({
   
    headerContainer:{
        // flexDirection: 'row',
        // marginTop: 20,
    },
    documentTitle:{
        marginTop: 20,
        color: 'black',
        textTransform: 'uppercase',
        textAlign: 'center',
        fontSize: 20,
        fontFamily: 'Helvetica-Bold',

    },
    
  });


const ItemsTable = ({receipt}) => {

    
    
    return(
    <View style={styles.headerContainer}>
        <TopTable receipt={receipt} />
        <MainTable receipt={receipt} />

        
    </View>
  );

}
  
  export default ItemsTable