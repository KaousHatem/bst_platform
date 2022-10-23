import React from 'react';
import { useState, useEffect } from 'react';
import {Text, View, StyleSheet, Image } from '@react-pdf/renderer';


const borderColor = '#04006e'
const textColor = 'white'
const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: "row",
        // justifyContent: "space-between",
        borderColor: borderColor,
        backgroundColor: '#697d9e',
        borderWidth: 1,
        alignItems: 'center',
        // height: 50,
        textAlign: 'center',
        // flexGrow: 1,
        fontSize:'9'

    },
    num: {
        color: textColor,
        height: '100%',
        width: '4%',
        display: 'flex',
        justifyContent: "center",
        textAlign: 'center',
        borderRightColor: borderColor,
        borderRightWidth: 1,
    },
    description: {
        color: textColor,
        display: 'flex',
        justifyContent: "center",
        textAlign: 'center',
        height: '100%',
        width: '30%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
    },

    quantity: {
        color: textColor,
        display: 'flex',
        flexDirection:'column',
        justifyContent: "center",
        textAlign: 'center',
        height: '100%',
        width: '24%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
    },
    quantityTop:{
        color: textColor,
        // height: '100%',
        width: '100%',
        display: 'flex',
        justifyContent: "center",
        textAlign: 'center',
        fontFamily: 'Helvetica-Bold',
        borderBottomColor: borderColor,
        borderBottomWidth: 1,
    },
    quantityBot:{
        color: textColor,
        // height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection:'row',
        justifyContent: "center",
        textAlign: 'center',
    },
    item:{
        width:'33%',
        fontSize:'7',
    },
    
    ordered:{
        borderRightColor: borderColor,
        borderRightWidth: 1,
    },

    received:{
        borderRightColor: borderColor,
        borderRightWidth: 1,
    },

    conformity:{
        color: textColor,
        display: 'flex',
        flexDirection:'column',
        justifyContent: "center",
        textAlign: 'center',
        height: '100%',
        width: '18%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
    },
    conformityTop:{
        color: textColor,
        // height: '100%',
        width: '100%',
        display: 'flex',
        justifyContent: "center",
        textAlign: 'center',
        fontFamily: 'Helvetica-Bold',
        borderBottomColor: borderColor,
        borderBottomWidth: 1,
    },
    conformityBot:{
        color: textColor,
        // height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection:'row',
        justifyContent: "center",
        textAlign: 'center',
    },
    conformityItem:{
        width:'50%',
        fontSize:'7',
    },
    
    conforme:{
        borderRightColor: borderColor,
        borderRightWidth: 1,
    },
    note:{
        color: textColor,
        display: 'flex',
        justifyContent: "center",
        textAlign: 'center',
        height: '100%',
        width: '24%',
    }

    
  });


const TableHeader = () => {
    
    return(
        <View style={styles.container}>
            <View style={styles.num}>
                <Text >N°</Text>
            </View>
            <View style={styles.description}>
                <Text>Designation</Text>
            </View>
            <View style={styles.quantity}>
                <View style={styles.quantityTop}>
                    <Text>Quantité</Text>
                </View>
                <View style={styles.quantityBot}>
                    <View style={[styles.item,styles.ordered]}>
                        <Text>Commandé</Text>
                    </View>
                    <View style={[styles.item,styles.received]}>
                        <Text>Reçu</Text>
                    </View>
                    <View style={[styles.item,styles.accepted]}>
                        <Text>accepté</Text>
                    </View>
                </View>
            </View>
            <View style={styles.conformity}>
                <View style={styles.conformityTop}>
                    <Text>Conformité</Text>
                </View>
                <View style={styles.conformityBot}>
                    <View style={[styles.conformityItem,styles.conforme]}>
                        <Text>Conforme</Text>
                    </View>
                    <View style={[styles.conformityItem,styles.nonConforme]}>
                        <Text>Non Conforme</Text>
                    </View>
                    
                </View>
            </View>
            <View style={styles.note}>
                <Text>Obs</Text>
            </View>
            
        </View>
  );

}
  
  export default TableHeader