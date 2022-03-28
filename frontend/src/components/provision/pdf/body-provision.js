import React from 'react';
import { useState, useEffect } from 'react';
import {Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import ItemsTable from './items-table'

const styles = StyleSheet.create({
   
    headerContainer:{
        // flexDirection: 'row',
        // marginBottom: 300,
    },
    documentTitle:{
        marginTop: 20,
        marginBottom: 20,
        color: 'black',
        textTransform: 'uppercase',
        textAlign: 'center',
        fontSize: 20,
        fontFamily: 'Helvetica-Bold',

    },
    
  });


const BodyProvision = ({provision}) => {
    
    return(
    <View style={styles.headerContainer}>
        <Text style={styles.documentTitle}>Demande d`&apos;`appro</Text>
        <ItemsTable provision={provision}/>
    </View>
  );

}
  
  export default BodyProvision