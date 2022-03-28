import {provisionUrl,provisionApproveUrl} from '../utils/networks'
import axios from "axios";



class ProvisionProvider {

    
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

    getProvisions(pk=-1) {
        const token = localStorage.getItem('auth')
        
        const config = {
        headers: {
        Authorization: `Bearer ${token}`
        }}
        var url = provisionUrl
        //const headers = new Headers({ 'Content-Type': 'application/json',})
        if(pk !== -1){
            url = provisionUrl + pk
            
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

    deleteProvision(pk){
        const token = localStorage.getItem('auth')
        
        const config = {
        headers: {
        Authorization: `Bearer ${token}`
        }}
        return axios
            .delete(provisionUrl+pk, config)
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

    addProvision(data) {
        const token = localStorage.getItem('auth')
        
        const config = {
        headers: {
        Authorization: `Bearer ${token}`
        }}
        return axios
            .post(provisionUrl, data, config)
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

    approveProvision(pk) {
    const token = localStorage.getItem('auth')
    
    const config = {
    headers: {
    Authorization: `Bearer ${token}`
    }}

    return axios
        .put(provisionUrl+pk+'/approve/',{} , config)
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

    editProvision(data,pk) {
        const token = localStorage.getItem('auth')
        
        const config = {
        headers: {
        Authorization: `Bearer ${token}`
        }}
        return axios
            .put(provisionUrl+pk+'/', data, config)
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


export default new ProvisionProvider();