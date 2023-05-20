import { stockOutDocumentProductUrl } from '../utils/networks'
import axios from "axios";



class StockOutDocumentProductProvider {

    addStockOutDocumentProduct(data) {
        const token = localStorage.getItem('auth')

        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        return axios
            .post(stockOutDocumentProductUrl, data, config)
            .then(response => {
                return response;
            })
            .catch((error) => {
                throw error
            })
    }

    bulkUpdateStockOutDocumentProduct(data) {
        const token = localStorage.getItem('auth')

        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        return axios
            .put(stockOutDocumentProductUrl, data, config)
            .then(response => {
                return response;
            })
            .catch((error) => {
                throw error
            })
    }


    bulkDeleteStockOutDocumentProduct(ids) {
        const token = localStorage.getItem('auth')

        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: ids
        }
        return axios
            .delete(stockOutDocumentProductUrl, config)
            .then(response => {
                return response;
            })
            .catch((error) => {
                throw error
            })
    }


}


export default new StockOutDocumentProductProvider();