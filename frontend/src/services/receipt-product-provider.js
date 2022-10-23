import {receiptProductUrl} from '../utils/networks'
import axios from "axios";



class ReceiptProductProvider {


    // getPRProducts(pk=-1) {
    //     const token = localStorage.getItem('auth')
        
    //     const config = {
    //     headers: {
    //     Authorization: `Bearer ${token}`
    //     }}
         
    //     var url = prProductUrl

    //     if (pk!==-1){
    //         url = url + pk.toString()
    //     }
    //     return axios
    //         .get(url,config)
    //         .then(response => {
    //             if (response.status < 200 || response.status >= 300) {
    //                 throw new Error(response.statusText);
    //             }
    //             return response;
    //         })
    //         .catch((error) => {
    //             throw new Error('Network error')
    //         });
    // }

    addReceiptProduct(data) {
        const token = localStorage.getItem('auth')
        
        const config = {
        headers: {
        Authorization: `Bearer ${token}`
        }}
        return axios
            .post(receiptProductUrl, data, config)
            .then(response => {
                if (response.status < 200 || response.status >= 300) {
                    throw new Error(response.statusText);
                }
                return response;
            })
            .catch((error) => {
                throw new Error()
            })
    }


    bulkUpdateReceiptProduct(data) {
        const token = localStorage.getItem('auth')
        
        const config = {
        headers: {
        Authorization: `Bearer ${token}`
        }}
        return axios
            .put(receiptProductUrl, data, config)
            .then(response => {
                if (response.status < 200 || response.status >= 300) {
                    throw new Error(response.statusText);
                }
                return response;
            })
            .catch((error) => {
                console.log(error.response)
                throw new Error()
            })
    }

    // updatePRProduct(data,pk) {
    //     const token = localStorage.getItem('auth')
        
    //     const config = {
    //     headers: {
    //     Authorization: `Bearer ${token}`
    //     }}
    //     return axios
    //         .put(prProductUrl+pk+'/', data, config)
    //         .then(response => {
    //             if (response.status < 200 || response.status >= 300) {
    //                 throw new Error(response.statusText);
    //             }
    //             return response;
    //         })
    //         .catch((error) => {
    //             console.log(error.response)
    //             throw new Error()
    //         })
    // }

    // bulkUpdatePRProduct(data) {
    //     const token = localStorage.getItem('auth')
        
    //     const config = {
    //     headers: {
    //     Authorization: `Bearer ${token}`
    //     }}
    //     return axios
    //         .put(prProductUrl, data, config)
    //         .then(response => {
    //             if (response.status < 200 || response.status >= 300) {
    //                 throw new Error(response.statusText);
    //             }
    //             return response;
    //         })
    //         .catch((error) => {
    //             console.log(error.response)
    //             throw new Error()
    //         })
    // }

    // deletePRProduct(pk){
    //     const token = localStorage.getItem('auth')
        
    //     const config = {
    //     headers: {
    //     Authorization: `Bearer ${token}`
    //     }}
    //     return axios
    //         .delete(prProductUrl+pk+'/',config)
    //         .then(response => {
    //             if (response.status < 200 || response.status >= 300) {
    //                 throw new Error(response.statusText);
    //             }
    //             return response;
    //         })
    //         .catch((error) => {
    //             throw new Error('Network error')
    //         });
    // }

    // bulkDeletePRProduct(ids){
    //     const token = localStorage.getItem('auth')
        
    //     const config = {
    //     headers: {
    //     Authorization: `Bearer ${token}`
    //     }}
    //     return axios
    //         .delete(prProductUrl,{data:ids},config)
    //         .then(response => {
    //             if (response.status < 200 || response.status >= 300) {
    //                 throw new Error(response.statusText);
    //             }
    //             return response;
    //         })
    //         .catch((error) => {
    //             throw new Error('Network error')
    //         });
    // }


}


export default new ReceiptProductProvider();