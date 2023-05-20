import React from 'react';
import { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import ItemsTable from './items-table'
import bstLogo from '../../../../public/static/bst-logo.jpg'
import { format } from 'date-fns'


const styles = StyleSheet.create({

    footerContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: "space-between",
        marginTop: 'auto',
        marginBottom: 40,

    },
    text: {
        color: 'black',
        letterSpacing: 0.5,
        fontFamily: 'Helvetica-Bold',
        fontSize: 11,
        marginTop: 5,
        textDecoration: 'underline',
    },

    sideInfo: {
        display: 'flex',
        width: '70%',
        fontSize: 8,
        paddingLeft: 10


    },
    VisaLogistic: {
        marginLeft: 'auto',
        // width: '30%',
    },
    topText: {
        marginLeft: 5,
        textDecoration: 'underline',
        fontFamily: 'Helvetica-Bold',
        marginBottom: 5,
    },



});


const Footer = () => {

    const getDate = (date) => {
        // const [year, month, day] = date.split('-')
        // console.log(day+'/'+month+'/'+year)
        return format(new Date(date), 'dd/MM/yyyy')
    }



    return (
        <View style={styles.footerContainer}>
            <View style={styles.sideInfo}>
                <Text style={styles.topText}>Merci de nous confirmer:</Text>
                <Text>- La disponibilité</Text>
                <Text>- La Fiche technique</Text>
                <Text>- Le délai de livraison</Text>
                <Text>- Le payement</Text>

            </View>
            <View style={styles.VisaLogistic}>
                <Text style={styles.text}>L'ENTREPRISE</Text>
            </View>
        </View>
    );

}

export default Footer