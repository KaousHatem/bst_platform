import { stockInDocumentProductUrl } from '../utils/networks'
import axios from "axios";



class stockInDocumentProductProvider {

    addStockInDocumentProduct(data) {
        const token = localStorage.getItem('auth')

        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        return axios
            .post(stockInDocumentProductUrl, data, config)
            .then(response => {
                return response;
            })
            .catch((error) => {
                throw error
            })
    }

    bulkUpdateStockInDocumentProduct(data) {
        const token = localStorage.getItem('auth')

        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        return axios
            .put(stockInDocumentProductUrl, data, config)
            .then(response => {
                return response;
            })
            .catch((error) => {
                throw error
            })
    }


    bulkDeleteStockInDocumentProduct(ids) {
        const token = localStorage.getItem('auth')

        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: ids
        }
        return axios
            .delete(stockInDocumentProductUrl, config)
            .then(response => {
                return response;
            })
            .catch((error) => {
                throw error
            })
    }


}


export default new stockInDocumentProductProvider();