import React from 'react';
import { useState, useEffect } from 'react';
import {Text, View, StyleSheet } from '@react-pdf/renderer';



const styles = StyleSheet.create({
   
    footerContainer:{

        display:'flex',
        flexDirection: 'row',
        fontSize:6,
        marginTop: '2',
        justifyContent: "space-between",
    },

    footerCol: {
        display: 'flex',
        flexDirection: 'column',
    },

    footerCenter:{
        alignItems: 'center',
    },

    footerRight:{
        alignItems: 'flex-end',
    },
    dash: {
        width: "100%",
        marginTop: 10, 
        height: 1,
        borderTop: '1 solid gray',
    }
    
  });


const StaticFooter = ({}) => {

    return(
    <View >
        <View style={styles.dash}></View>
        <View style={styles.footerContainer}>

            <View style={[styles.footerCol]}>
                <View>
                    <Text>TLEMCEN - Siège Social</Text>
                </View>
                <View style={{marginLeft:5}}>
                    <Text>36,37 boulevard gaouar houcine - TLEMCEN</Text>
                </View>
                <View style={{marginLeft:10}}>
                    <Text>bst13000@hotmail.com</Text>
                </View>
                
                <View style={{marginLeft:15}}>
                    <Text>043 272 034 / 043 272 035</Text>
                </View>
            </View>

            <View style={[styles.footerCol, styles.footerCenter]}>
                <View>
                    <Text>ORAN - Direction Générale</Text>
                </View>
                <View >
                    <Text>03, Rue benahmed lahouari, batiment b1, 1er étage - ORAN</Text>
                </View>
                <View>
                    <Text>bst.oran@yahoo.fr</Text>
                </View>
                <View>
                    <Text>041 361 518</Text>
                </View>
                <View>
                    <Text>www.etp.com</Text>
                </View>
                
            </View>

            <View style={[styles.footerCol, styles.footerRight]}>
                <View>
                    <Text>ALGER - Antenne Centre</Text>
                </View>
                <View style={{marginRight:5}}>
                    <Text>cité 17 octobre 1961, gué de constantine, ALGER</Text>
                </View>
                
                <View style={{marginRight:10}}>
                    <Text>eurlbst.alger@gmail.com</Text>
                </View>
                <View style={{marginRight:15}}>
                    <Text>023 532 905</Text>
                </View>
            </View>
            
        </View>
    </View>
  );

}
  
  export default StaticFooter