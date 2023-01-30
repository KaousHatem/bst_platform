import React from 'react';
import { useState, useEffect } from 'react';
import {Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import header from '../../../header.png'

const styles = StyleSheet.create({
   
    headerContainer:{
        display:'flex',
        flexDirection: 'column',
        // marginTop: 0,
        marginBottom:20,
    },
    headerHorizontal:{
        display:'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    headerPage:{
        border:'1 solid black',
        padding: '5 15',
        display:'flex',
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf:'center',
        justifyContent: "center",
        lineHeight:'100%',
    },
    page:{
        marginLeft: '10',
        height:'100%',
        display: 'flex',
        justifyContent: "center",
        textAlign: 'center',
    },
    refrence:{
        marginTop: 1,
        color: 'black',
        letterSpacing: 1,
    },
    directionTitle: {
        color: 'black',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
        fontSize: 14,
        fontFamily: 'Helvetica-Bold',
        // marginTop:5,
        // textAlign: 'center',
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
        // marginTop:15,
    },
    projectText: {
        marginTop: 1,
        marginLeft: 10,
    },
    logo: {
        height: 66,
        marginBottom: 5,
    },
    documentTitle:{
        marginTop: 10,
        marginBottom: 20,
        color: 'black',
        textTransform: 'uppercase',
        textAlign: 'center',
        fontSize: 16,
        fontFamily: 'Helvetica-Bold',

    },

  });


const HeaderProvision = ({provision, page, pages}) => {
    
    return(
    <View style={styles.headerContainer}>
        <Image width={window && window.innerWidth} 
        style={styles.logo} 
        src={header.src} />
        <Text style={styles.documentTitle}>Demande d&apos;approvisionnement</Text>
        <View style={styles.headerHorizontal}>
            <View >
                <Text style={styles.directionTitle}>direction logistique</Text>
                <Text style={styles.refrence}>Ref: BST/LOG/n° {provision.ref}</Text>
            </View>
            <View style={styles.headerPage}> 
                <Text>Page:</Text>  

                <View style={styles.page}>
                    <Text>
                        {page} sur {pages}
                    </Text>
                </View>
            </View>
        </View>
        <View style={styles.projectContainer}>
            <Text style={styles.projectTitle}>Projets:</Text>
            <Text style={styles.projectText}>{provision.destination}</Text>
        </View>      
    </View>
  );

}
  
  export default HeaderProvision