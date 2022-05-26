import {provisionProductUrl} from '../utils/networks'
import axios from "axios";



class ProvisionProductProvider {

    
   

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

    bulkDeleteProvisionProduct(ids){
        const token = localStorage.getItem('auth')
        
        const config = {
        headers: {
            Authorization: `Bearer ${token}`
            },
        data:ids
        }
        return axios
            .delete(provisionProductUrl,config)
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


    bulkUpdateProvisionProduct(data) {
        const token = localStorage.getItem('auth')
        
        const config = {
        headers: {
        Authorization: `Bearer ${token}`
        }}
        return axios
            .put(provisionProductUrl, data,config)
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


export default new ProvisionProductProvider();