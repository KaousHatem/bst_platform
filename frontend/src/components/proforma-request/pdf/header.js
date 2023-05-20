import React from 'react';
import { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import header from '../../../header.png'

const styles = StyleSheet.create({

    headerContainer: {
        display: 'flex',
        flexDirection: 'column',
        marginBottom: 20,
    },
    headerHorizontal: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    headerPage: {
        border: '1 solid black',
        padding: '5 15',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: "center",
        lineHeight: '100%',
    },
    page: {
        marginLeft: '10',
        height: '100%',
        display: 'flex',
        justifyContent: "center",
        textAlign: 'center',
    },
    refrence: {
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
        fontSize: 11,
        // marginTop:5,
    },
    projectText: {
        marginTop: 1,
        marginLeft: 10,
    },
    logo: {
        height: 66,
        marginBottom: 5,
    },
    documentTitle: {
        marginTop: 10,
        marginBottom: 20,
        color: 'black',
        textTransform: 'uppercase',
        textAlign: 'center',
        fontSize: 16,
        fontFamily: 'Helvetica-Bold',

    },
    companyInfo: {
        marginTop: 5,
        marginLeft: 10,
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
    },
    title: {
        fontFamily: 'Helvetica-Bold',
    },
});


const Header = ({ proformaRequest, page, pages }) => {

    return (
        <View style={styles.headerContainer}>
            <Image width={window && window.innerWidth}
                style={styles.logo}
                src={header.src} />
            <Text style={styles.documentTitle}>Demande de facture proforma</Text>
            <View style={styles.headerHorizontal}>
                <View>
                    <Text style={styles.directionTitle}>direction logistique</Text>
                    <Text style={styles.refrence}>Ref: BST/LOG/n° {proformaRequest.ref}</Text>
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
            <View style={styles.companyInfo}>
                <View style={styles.row}><Text style={styles.title}>NOM: </Text><Text>EURL BESTAOUI FOUAD BST</Text></View>
                <View style={styles.row}><Text style={styles.title}>RCN: </Text><Text>16B-0264982-00/ 13 Tlemcen</Text></View>
                <View style={styles.row}><Text style={styles.title}>NIF: </Text><Text>001613026498264</Text></View>
                <View style={styles.row}><Text style={styles.title}>NIS: </Text><Text>001613010005766</Text></View>
                <View style={styles.row}><Text style={styles.title}>A.1.: </Text><Text>13014528131</Text></View>
                <View style={styles.row}><Text style={styles.title}>EMAIL: </Text><Text>bst.oran.31@gmail.com</Text></View>
                <View style={styles.row}><Text style={styles.title}>TEL: </Text><Text>07.90.48.54.66/05.61.30.87.02</Text></View>
            </View>
        </View>
    );

}

export default Header