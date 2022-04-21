import React from 'react';
import { useState, useEffect } from 'react';
import {Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import header from '../../../header.png'

const styles = StyleSheet.create({
   
    headerContainer:{
        // flexDirection: 'row',
        // marginTop: 20,
    },
    refrence:{
        marginTop: 20,
        color: 'black',
        letterSpacing: 1,
    },
    directionTitle: {
        color: 'black',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
        fontFamily: 'Helvetica-Bold',
        marginTop:5,
    },
    projectContainer: {
        marginTop: 5,
        paddingLeft: 15,
        paddingRight: 15,
    },
    projectTitle: {
        color: 'black',
        letterSpacing: 0.5,
        fontFamily: 'Helvetica-Bold',
        fontSize:11,
        marginTop:15,
    },
    projectText: {
        marginTop: 2
    },
    logo: {
        height: 66,
        marginBottom: 5,
        // marginLeft: 'auto',
        // marginRight: 'auto'
    },
  });


const Header = ({purchaseRequest}) => {
    
    return(
    <View style={styles.headerContainer}>
        <Image width={window && window.innerWidth} 
        style={styles.logo} 
        src={header.src} />
        <Text style={styles.refrence}>Ref: BST/LOG/n° {purchaseRequest.ref}</Text>
        <Text style={styles.directionTitle}>direction logistique:</Text>
        <View style={styles.projectContainer}>
            <Text style={styles.projectTitle}>Projets:</Text>
            <Text style={styles.projectText}>Réalisation de la zone de stockage du dépot central de réserve de carburant / MOSBAH</Text>
        </View>      
    </View>
  );

}
  
  export default Header