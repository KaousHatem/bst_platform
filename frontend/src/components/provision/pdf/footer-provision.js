import React from 'react';
import { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import ItemsTable from './items-table'
import bstLogo from '../../../../public/static/bst-logo.jpg'
import cancelLogo from '../../../../public/static/cancel.png'

import { format } from 'date-fns'


const styles = StyleSheet.create({

    footerContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: "space-between",
    },
    text: {
        color: 'black',
        letterSpacing: 0.5,
        fontFamily: 'Helvetica-Bold',
        fontSize: 11,
        marginTop: 5,
    },

    visaDemand: {
        display: 'flex',

    },
    VisaLogistic: {
        marginLeft: 'auto',
        display: 'flex',
        maxWidth: 200,
    },
    chop: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: 5,
        paddingTop: 5,
        border: '3 solid #04006e',
        borderRadius: 10,
    },

    qrCode: {
        height: 75,
        width: 75,
    },
    logo: {
        height: 30,
        width: 30
    },

    chopCancel: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-start',
        // height: 75,
        width: 128

    },
    noteText: {
        fontSize: 8,
    }



});


const FooterProvision = ({ value, provision, creator, approver }) => {

    const getDate = (date) => {
        const [year, month, day] = date.split('-')
        return format(new Date(date), 'dd/MM/yyyy')
    }



    return (
        <View style={styles.footerContainer}>
            <View style={styles.visaDemand}>
                <Text style={styles.text}>Demandeur: {provision.created_by.fullname}</Text>
                <Text style={styles.text}>Date: {getDate(provision.created_on)}</Text>
                <View style={styles.chop}>
                    <Image style={styles.qrCode}
                        src={document.getElementById(creator).toDataURL()} />
                    <Image style={styles.logo}
                        src={bstLogo.src} />
                </View>

            </View>
            {provision.status !== "4" ? <View style={styles.VisaLogistic}>
                <Text style={styles.text}>St. Logistique</Text>
                <Text style={styles.text}>Date: {provision.approved_on !== null && getDate(provision.approved_on)}</Text>
                {provision.approved_by !== null && <View style={styles.chop}>
                    <Image style={styles.qrCode}
                        src={document.getElementById(approver).toDataURL()} />
                    <Image style={styles.logo}
                        src={bstLogo.src} />
                </View>}
            </View> :
                <View style={styles.VisaLogistic}>
                    <Text style={styles.text}>St. Logistique</Text>
                    <Text style={styles.text}>Date: {provision.dropped_on !== null && getDate(provision.dropped_on)}</Text>
                    <View style={styles.chopCancel}>
                        <Image
                            src={cancelLogo.src} />

                    </View>
                    <Text style={[styles.text, styles.noteText]}>Motif: {provision.note}</Text>
                </View>}

        </View >
    );

}

export default FooterProvision