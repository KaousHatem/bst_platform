import {purchaseOrderUrl} from '../utils/networks'
import axios from "axios";



class PurchaseOrderProvider {


    getPurchaseOrders(pk=-1) {
        const token = localStorage.getItem('auth')
        
        const config = {
        headers: {
        Authorization: `Bearer ${token}`
        }}
         
        var url = purchaseOrderUrl

        if (pk!==-1){
            url = url + pk.toString()
        }
        console.log(url)
        return axios
            .get(url,config)
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

    // addPurchaseRequest(data) {
    //     const token = localStorage.getItem('auth')
        
    //     const config = {
    //     headers: {
    //     Authorization: `Bearer ${token}`
    //     }}
    //     return axios
    //         .post(purchaseRequestUrl, data, config)
    //         .then(response => {
    //             if (response.status < 200 || response.status >= 300) {
    //                 throw new Error(response.statusText);
    //             }
    //             return response;
    //         })
    //         .catch((error) => {
    //             throw new Error()
    //         })
    // }

    // updatePurchaseRequest(data,pk) {
    //     const token = localStorage.getItem('auth')
        
    //     const config = {
    //     headers: {
    //     Authorization: `Bearer ${token}`
    //     }}
    //     return axios
    //         .put(purchaseRequestUrl+pk+'/', data, config)
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

    // deletePurchaseRequest(pk){
    //     const token = localStorage.getItem('auth')
        
    //     const config = {
    //     headers: {
    //     Authorization: `Bearer ${token}`
    //     }}
    //     return axios
    //         .delete(purchaseRequestUrl+pk+'/',config)
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

    // approvePurchaseRequest(pk) {
    // const token = localStorage.getItem('auth')
    
    // const config = {
    // headers: {
    // Authorization: `Bearer ${token}`
    // }}

    // return axios
    //     .put(purchaseRequestUrl+pk+'/approve/',{} , config)
    //     .then(response => {
    //         if (response.status < 200 || response.status >= 300) {
    //             throw new Error(response.statusText);
    //         }
    //         return response;
    //     })
    //     .catch((error) => {
    //         throw new Error()
    //     })
    // }

    // updateStatusPurchaseRequest(data,pk) {
    // const token = localStorage.getItem('auth')
    
    // const config = {
    // headers: {
    // Authorization: `Bearer ${token}`
    // }}

    // return axios
    //     .put(purchaseRequestUrl+pk+'/status_update/',data , config)
    //     .then(response => {
    //         if (response.status < 200 || response.status >= 300) {
    //             throw new Error(response.statusText);
    //         }
    //         return response;
    //     })
    //     .catch((error) => {
    //         throw new Error()
    //     })
    // }


}


export default new PurchaseOrderProvider();