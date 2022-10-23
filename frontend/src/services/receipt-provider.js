import {receiptUrl} from '../utils/networks'
import axios from "axios";



class ReceiptProvider {


    getReceipts(pk=-1) {
            
        const token = localStorage.getItem('auth')
        
        const config = {
        headers: {
        Authorization: `Bearer ${token}`
        }}

        var url = receiptUrl

        if (pk!==-1){
            url = url + pk.toString()
        }
        return axios
            .get(url, config)
            .then(response => {
                if (response.status < 200 || response.status >= 300) {
                    throw new Error(response.statusText);
                }
                return response;
            })
            .catch((error) => {
                throw new Error('Network error')
            });
    }


    addReceipt(data) {
        const token = localStorage.getItem('auth')
        
        const config = {
        headers: {
        Authorization: `Bearer ${token}`
        }}
        return axios
            .post(receiptUrl, data, config)
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

    updateReceipt(data,pk) {
        const token = localStorage.getItem('auth')
        
        const config = {
        headers: {
        Authorization: `Bearer ${token}`
        }}
        return axios
            .put(receiptUrl+pk+'/', data, config)
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

    // deleteSupplier(pk){
    //     const token = localStorage.getItem('auth')
        
    //     const config = {
    //     headers: {
    //     Authorization: `Bearer ${token}`
    //     }}
    //     return axios
    //         .delete(supplierUrl+pk+'/',config)
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


export default new ReceiptProvider();