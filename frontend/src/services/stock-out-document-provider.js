import { stockOutDocumentUrl } from '../utils/networks'
import axios from "axios";



class StockOutDocumentProvider {

    getStockOutDocuments(pk = -1) {

        const token = localStorage.getItem('auth')

        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        var url = stockOutDocumentUrl

        if (pk !== -1) {
            url = url + pk.toString()
        }
        return axios
            .get(url, config)
            .then(response => {

                return response;
            })
            .catch((error) => {
                throw error
            })
    }

    getStockOutDocumentsByStore(storeId = -1) {

        const token = localStorage.getItem('auth')

        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        var url = stockOutDocumentUrl + "?store=" + storeId


        return axios
            .get(url, config)
            .then(response => {

                return response;
            })
            .catch((error) => {
                throw error
            })
    }

    addStockOutDocument(data) {
        const token = localStorage.getItem('auth')

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }
        return axios
            .post(stockOutDocumentUrl, data, config)
            .then(response => {

                return response;
            })
            .catch((error) => {
                throw error
            })
    }





}


export default new StockOutDocumentProvider();