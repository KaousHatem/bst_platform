import {productUrl, lastProductUrl, bulkProductUrl} from '../utils/networks'
import axios from "axios";



class ProductProvider {

    
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



    getProducts() {
        const token = localStorage.getItem('auth')
        
        const config = {
        headers: {
        Authorization: `Bearer ${token}`
        }}
        
        return axios
            .get(productUrl, config)
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

    deleteProduct(pk){
        const token = localStorage.getItem('auth')
        
        const config = {
        headers: {
        Authorization: `Bearer ${token}`
        }}
        return axios
            .delete(productUrl+pk,config)
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

    addProduct(data) {
        const token = localStorage.getItem('auth')
        
        const config = {
        headers: {
        Authorization: `Bearer ${token}`
        }}
        return axios
            .post(productUrl, data, config)
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

    editProduct(data,pk) {
        const token = localStorage.getItem('auth')
        
        const config = {
        headers: {
        Authorization: `Bearer ${token}`
        }}
        return axios
            .put(productUrl+pk+'/', data, config)
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

    getLastProduct() {
        const token = localStorage.getItem('auth')
        
        const config = {
        headers: {
        Authorization: `Bearer ${token}`
        }}
        //const headers = new Headers({ 'Content-Type': 'application/json',})
        
        return axios
            .get(lastProductUrl, config)
            .then(response => {
                console.log(response.data)
                if (response.status < 200 || response.status >= 300) {
                    throw new Error(response.statusText);
                }
                return response;
            })
            .catch((error) => {
                throw new Error('Network error')
            });
    }

    addBulkProduct(file) {
        const headers = new Headers({ 'Content-Type': 'text/csv',})
        const token = localStorage.getItem('auth')
        
        const config = {
        headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'text/csv'
        }}
        return axios
            .post(bulkProductUrl, file, config)
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

}


export default new ProductProvider();