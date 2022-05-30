import {supplierUrl} from '../utils/networks'
import axios from "axios";



class SupplierProvider {


    getSuppliers(pk=-1) {
            
        //const headers = new Headers({ 'Content-Type': 'application/json',})
        const token = localStorage.getItem('auth')
        
        const config = {
        headers: {
        Authorization: `Bearer ${token}`
        }}

        var url = supplierUrl
        //const headers = new Headers({ 'Content-Type': 'application/json',})
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


    addSupplier(data) {
        const token = localStorage.getItem('auth')
        
        const config = {
        headers: {
        Authorization: `Bearer ${token}`
        }}
        return axios
            .post(supplierUrl, data, config)
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

    updateSupplier(data,pk) {
        const token = localStorage.getItem('auth')
        
        const config = {
        headers: {
        Authorization: `Bearer ${token}`
        }}
        return axios
            .put(supplierUrl+pk+'/', data, config)
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

    deleteSupplier(pk){
        const token = localStorage.getItem('auth')
        
        const config = {
        headers: {
        Authorization: `Bearer ${token}`
        }}
        return axios
            .delete(supplierUrl+pk+'/',config)
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


}


export default new SupplierProvider();