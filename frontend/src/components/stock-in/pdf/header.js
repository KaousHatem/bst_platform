import React from 'react';
import { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import header from '../../../header.png'

const styles = StyleSheet.create({

    headerContainer: {
        display: 'flex',
        flexDirection: 'column',
        marginBottom: 20,
        marginHorizontal: 20,
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

    subHeader: {
        marginTop: 25,
        flexDirection: 'row',
        // justifyContent: 'space-between',
    },

    subHeaderItem: {
        width: '40%',
    },

    subHeaderDestination: {
        marginLeft: '20%',
    },



    subHeaderName: {
        backgroundColor: '#26356B',
        color: 'white',
        fontFamily: 'Helvetica-Bold',
        paddingLeft: 13,
        height: 22,
        fontSize: 12,
        lineHeight: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
    },


    subHeaderContent: {
        marginTop: 4,
        paddingLeft: 5,
    },
});


const Header = ({ stockInDocument, page, pages }) => {

    const source_text = {
        1: "Achat sans dossier",
        3: "Autre"
    }

    return (
        <View style={styles.headerContainer}>
            <Image width={window && window.innerWidth}
                style={styles.logo}
                src={header.src} />
            <Text style={styles.documentTitle}>BON D&apos;ENTRE</Text>
            <View style={styles.headerHorizontal}>
                <View>
                    <Text style={styles.directionTitle}>direction logistique</Text>
                    <Text style={styles.refrence}>Ref: BST/LOG/n° {stockInDocument.ref}</Text>
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
            <View style={styles.subHeader}>
                <View style={styles.subHeaderItem} >
                    <View style={styles.subHeaderName} >
                        <Text>
                            Magasin
                        </Text>
                    </View>
                    <View style={styles.subHeaderContent}>
                        <Text>{stockInDocument.store.name}</Text>
                        {/* <Text style={{ fontFamily: 'Helvetica-Bold' }}>{purchaseOrder.supplier.name}</Text>
                        <Text>{purchaseOrder.supplier.register_number}</Text>
                        <Text>{purchaseOrder.supplier.address}</Text>
                        <Text>{purchaseOrder.supplier.city}</Text>
                        <Text>{purchaseOrder.supplier.number}</Text>
                        <Text>{purchaseOrder.supplier.email}</Text> */}
                    </View>

                </View>
                <View style={[styles.subHeaderItem, styles.subHeaderDestination]}>
                    <View style={styles.subHeaderName} >
                        <Text>
                            La source d&apos;entré
                        </Text>
                    </View>
                    <View style={styles.subHeaderContent} >
                        <Text>{source_text[stockInDocument.source]}</Text>
                        <Text>{stockInDocument.note}</Text>
                        {/* <Text>{purchaseOrder.purchaseRequest.provision.destination.name}</Text>
                        <Text>{purchaseOrder.purchaseRequest.provision.destination.address}</Text>
                        <Text>{purchaseOrder.purchaseRequest.provision.destination.city} {purchaseOrder.purchaseRequest.provision.destination.codePostal}</Text> */}
                        {/*<Text>0556 75 34 93</Text>*/}
                    </View>
                </View>
            </View>



        </View>

    );

}

export default Header