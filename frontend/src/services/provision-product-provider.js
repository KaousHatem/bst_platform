import {provisionProductUrl} from '../utils/networks'
import axios from "axios";



class ProvisionProductProvider {

    
    // login2( username, password ) {
    //     const request = new Request(LoginUrl, {
    //         method: 'POST',
    //         body: JSON.stringify({ username, password }),
    //         headers: new Headers({ 'Content-Type': 'application/json',}),
    //     });
    //     return fetch(request)
    //         .then(response => {
    //             if (response.status < 200 || response.status >= 300) {
    //                 throw new Error(response.statusText);
    //             }
    //             return response.json();
    //         })
    //         .then(auth => {
    //             localStorage.setItem('auth', JSON.stringify(auth));
    //         })
    //         .catch(() => {
    //             throw new Error('Network error')
    //         });
    // }

    // getProvisions() {
            
    //     //const headers = new Headers({ 'Content-Type': 'application/json',})
        
    //     return axios
    //         .get(provisionUrl)
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

    deleteProvisionProduct(pk){
        const token = localStorage.getItem('auth')
        
        const config = {
        headers: {
        Authorization: `Bearer ${token}`
        }}
        return axios
            .delete(provisionProductUrl+pk,config)
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

    addProvisionProduct(data) {
        const token = localStorage.getItem('auth')
        
        const config = {
        headers: {
        Authorization: `Bearer ${token}`
        }}
        return axios
            .post(provisionProductUrl, data,config)
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

    editProvisionProduct(data,pk) {
        const token = localStorage.getItem('auth')
        
        const config = {
        headers: {
        Authorization: `Bearer ${token}`
        }}
        return axios
            .put(provisionProductUrl+pk+'/', data,config)
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

    // getLastProduct() {
            
    //     //const headers = new Headers({ 'Content-Type': 'application/json',})
        
    //     return axios
    //         .get(lastProductUrl)
    //         .then(response => {
    //             console.log(response.data)
    //             if (response.status < 200 || response.status >= 300) {
    //                 throw new Error(response.statusText);
    //             }
    //             return response;
    //         })
    //         .catch((error) => {
    //             throw new Error('Network error')
    //         });
    // }

    // addBulkProduct(file) {
    //     const headers = new Headers({ 'Content-Type': 'text/csv',})
    //     return axios
    //         .post(bulkProductUrl, file, {'headers': headers})
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

}


export default new ProvisionProductProvider();