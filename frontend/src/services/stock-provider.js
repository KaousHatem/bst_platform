import {stockUrl, stockUserLocationUrl} from '../utils/networks'
import axios from "axios";



class StockProvider {


    getStocks(pk=-1) {
            
        const token = localStorage.getItem('auth')
        
        const config = {
        headers: {
        Authorization: `Bearer ${token}`
        }}

        var url = stockUrl

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

    getStocksByStore(storeId) {
            
        const token = localStorage.getItem('auth')
        
        const config = {
        headers: {
        Authorization: `Bearer ${token}`
        }}
        var url = stockUrl + "?store=" + storeId
        
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


    getStocksByUserLocation(storeId) {
            
        const token = localStorage.getItem('auth')
        
        const config = {
        headers: {
        Authorization: `Bearer ${token}`
        }}
        var url = stockUserLocationUrl
        
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


    addStock(data) {
        const token = localStorage.getItem('auth')
        
        const config = {
        headers: {
        Authorization: `Bearer ${token}`
        }}
        return axios
            .post(stockUrl, data, config)
            .then(response => {
                // if (response.status < 200 || response.status >= 300) {
                //     throw new Error(response.statusText);
                // }
                return response;
            })
            .catch((error) => {
                console.log(error)
                throw error
            })
    }

    updateStock(data,pk) {
        const token = localStorage.getItem('auth')
        
        const config = {
        headers: {
        Authorization: `Bearer ${token}`
        }}
        return axios
            .put(storeUrl+pk+'/', data, config)
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

    


}


export default new StockProvider();