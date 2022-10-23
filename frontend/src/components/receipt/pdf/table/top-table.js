import React from 'react';
import { useState, useEffect } from 'react';
import {Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { format } from 'date-fns'


const borderColor = '#04006e'
const textColor = 'white'
const styles = StyleSheet.create({
    header: {
        display: 'flex',
        flexDirection: "row",
        justifyContent: "space-between",
        borderColor: borderColor,
        backgroundColor: '#697d9e',
        borderWidth: 1,
        alignItems: 'center',
        height: 24,
        textAlign: 'center',
        fontStyle: 'bold',
        flexGrow: 1,

    },
    titleHeader: {
        color: textColor,
        height: '100%',
        width: '100%',
        display: 'flex',
        justifyContent: "center",
        textAlign: 'center',
        fontFamily: 'Helvetica-Bold',
    },
    body:{
        // backgroundColor:'red',
        display:"flex",
        flexDirection:"row",
        marginTop:'-1',
        borderColor: 'black',
        // backgroundColor: '#697d9e',
        borderWidth: 1,
    },

    left: {
        width: '36%',
        // backgroundColor: '#697d9e',
        borderRight:'1px'
    },

    center: {
        width: '28%',
        // backgroundColor: '#697d9e',
        borderRight:'1px',
        display:'flex',
        justifyContent:'center',
        textAlign:'center'
    },

    right:{
        width: '36%',
        
    },

    item:{
        paddingLeft:'3px',
        width:"100%"
    },
    
    item1:{
        borderBottom:'1px'
    },
    item2:{
        borderBottom:'1px'
    },
    item3:{
    },
  });


const TopTable = ({receipt}) => {

    const getDate = (date) => {

        return format(new Date(date),'dd/MM/yyyy')
    }
    
    return(
        <View>
            <View style={styles.header}>
                <View style={styles.titleHeader}>
                    <Text >BON DE RECEPTION</Text>
                </View>
                
            </View>
            <View style={styles.body}>
                <View style={styles.left}>
                    <View style={[styles.item,styles.item1]}>
                        <Text >Ref: {receipt.ref}</Text>
                    </View>
                    <View style={[styles.item, styles.item2]}>
                        <Text>N° Bon de commande: {receipt.purchaseOrder.ref}</Text>
                    </View>
                    <View style={[styles.item,styles.item3]}>
                        <Text>Date de commande: {getDate(receipt.purchaseOrder.created_on)}</Text>
                    </View>
                </View>
                <View style={styles.center}>
                    <Text>Fournisseur: {receipt.purchaseOrder.supplier.name}</Text>
                </View>
                <View style={styles.right}>
                    <View style={[styles.item,styles.item1]}>
                        <Text >N° Bon de livraison: {receipt.do}</Text>
                    </View>
                    <View style={[styles.item, styles.item2]}>
                        <Text>N° Facture: {receipt.invoice}</Text>
                    </View>
                    <View style={[styles.item,styles.item3]}>
                        <Text>Date : {getDate(receipt.created_on)}</Text>
                    </View>
                    
                </View>
            </View>
            
        </View>
  );

}
  
  export default TopTable