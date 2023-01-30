import React from 'react';
import { useState, useEffect } from 'react';
import {Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import ItemsTable from './items-table'

const styles = StyleSheet.create({
   
    headerContainer:{
        // flexDirection: 'row',
        marginBottom: 'auto',
    },
    
    
  });


const BodyProvision = ({provision, page, length}) => {
    
    return(
    <View style={styles.headerContainer}>
        <ItemsTable provision={provision} 
        length={length}
        page={page}/>
    </View>
  );

}
  
  export default BodyProvision