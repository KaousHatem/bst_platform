import React from 'react';
import { useState, useEffect } from 'react';
import {Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import header from '../../../header.png'
import { format } from 'date-fns'

const styles = StyleSheet.create({
   
    headerContainer:{
        // flexDirection: 'row',
        // marginTop: 20,
    },

    headerPO:{
        marginTop:20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        // backgroundColor:'red'
    },

    headerCompany:{

    },

    headerCompanyName:{
        fontSize:14,
        paddingVertical:6,
        // marginBottom:5,
        fontFamily: 'Helvetica-Bold',
        // backgroundColor:'blue'
        
    },

    headerPurchaseOrder:{
        textAlign:'right',
        width:"50%"
    },

    headerPurchaseOrderName:{
        fontSize:22,
        fontFamily: 'Helvetica-Bold',
        textAlign:'right',
        color:'#26356B',
    },


    headerInfo: {
        display:'flex',
        justifyContent:'flex-end',
        flexDirection:'row',
        alignContent:'right',
        height:'20',
        alignItems: 'center',
        lineHeight:'100%',
        fontSize:12,
    },

    headerRef: {
        border:'1 solid gray',
    },

    headerText: {
        
        width:'80',
        height:'100%',
        lineHeight:'100%',
        display: 'flex',
        justifyContent: "center",
        textAlign: 'center',
        marginLeft:5,
        fontSize:11,
 

    },

    headerDate:{
        borderBottom:'1 solid gray',
        borderLeft:'1 solid gray',
        borderRight:'1 solid gray',
    },

    

    subHeader: {
        marginTop:25,
        flexDirection: 'row',
        // justifyContent: 'space-between',
    },

    subHeaderItem: {
        width:'40%',
    },

    subHeaderDestination: {
        marginLeft:'20%',
    },



    subHeaderName:{
        backgroundColor:'#26356B',
        color:'white',
        fontFamily:'Helvetica-Bold',
        paddingLeft:13,
        height:22,
        fontSize:12,
        lineHeight:'100%',
        flexDirection:'column',
        justifyContent: 'center',
    },


    subHeaderContent:{
        marginTop:4,
        paddingLeft:5,
    },

    
  });


const Header = ({purchaseOrder}) => {
    
    return(
    <View style={styles.headerContainer}>
        <Image width={window && window.innerWidth} 
        style={styles.logo} 
        src={header.src} />
        <View style={styles.headerPO}>

            <View style={styles.headerCompany}>
                <Text style={styles.headerCompanyName}>Eurl BST</Text>
                <Text>Direction Logistique</Text>
                <Text>Address: Oran</Text>
                <Text>Tel: 000 00 00 00</Text>
                <Text>Email: hichem@eurlbst.com</Text>
            </View>
            <View style={styles.headerPurchaseOrder}>
                <Text style={styles.headerPurchaseOrderName}>BON DE COMMANDE</Text>
                <View>
                    <View style={styles.headerInfo}> 
                        <Text>BC #  </Text>  

                        <View style={[styles.headerText, styles.headerRef]}>
                            <Text>
                                {purchaseOrder.ref}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.headerInfo}> 
                        <Text >DATE </Text> 
                        <View style={[styles.headerText, styles.headerDate]}>
                            <Text>
                                {format(new Date(purchaseOrder.created_on),'dd/MM/yyyy')}
                            </Text>
                        </View>  
                    </View>
                </View>
            </View>

        </View>

        <View style={styles.subHeader}>
            <View style={styles.subHeaderItem} >
                <View style={styles.subHeaderName} >
                    <Text>
                        Fournisseur
                    </Text>
                </View>
                <View style={styles.subHeaderContent}>
                    <Text>{purchaseOrder.supplier.name}</Text>
                    <Text>{purchaseOrder.supplier.register_number}</Text>
                    <Text>{purchaseOrder.supplier.address}</Text>
                    <Text>{purchaseOrder.supplier.city}</Text>
                    <Text>{purchaseOrder.supplier.number}</Text>
                    <Text>{purchaseOrder.supplier.email}</Text>
                </View>
                
            </View>
            <View style={[styles.subHeaderItem,styles.subHeaderDestination]}>
                <View style={styles.subHeaderName} >
                    <Text>
                        Destination
                    </Text>
                </View>
                <View  style={styles.subHeaderContent} >
                    <Text>Project Unité A</Text>
                    <Text>33 Rue Didouche Mourad,</Text>
                    <Text>Alger 16000</Text>
                    <Text>0556 75 34 93</Text>
                </View>
            </View>
        </View>
        
    </View>
  );

}
  
  export default Header