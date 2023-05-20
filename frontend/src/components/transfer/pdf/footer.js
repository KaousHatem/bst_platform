import React from 'react';
import { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image } from '@react-pdf/renderer';

import { format } from 'date-fns'


const styles = StyleSheet.create({

    footerContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: "space-between",
        // marginTop: 'auto',
        // paddingBottom: '60px',
        // backgroundColor:'green',
        marginBottom: "60px",
    },
    text: {
        color: 'black',
        letterSpacing: 0.5,
        fontFamily: 'Helvetica-Bold',
        fontSize: 11,
        marginTop: 15,
    },

    visaDemand: {
        display: 'flex',
        // width: '40%',

    },
    VisaLogistic: {
        marginLeft: 'auto',
        // width: '30%',
    },




});


const Footer = ({ }) => {



    return (
        <View style={styles.footerContainer}>
            <View style={styles.visaDemand}>
                <Text style={styles.text}>Transporteur: </Text>
                <Text style={styles.text}>Immatricule: </Text>
                <Text style={styles.text}>Signature: </Text>

            </View>
            <View style={styles.VisaLogistic}>
                <Text style={styles.text}>Magasin:</Text>
                <Text style={styles.text}>Date:</Text>
                <Text style={styles.text}>Signature:</Text>
            </View>
            <View style={styles.VisaLogistic}>
                <Text style={styles.text}>Accué de reception:</Text>
                <Text style={styles.text}>Date:</Text>
                <Text style={styles.text}>Signature:</Text>
            </View>
        </View>
    );

}

export default Footer