import { transferProductUrl } from '../utils/networks'
import axios from "axios";



class TransferProductProvider {

    addTransferProduct(data) {
        const token = localStorage.getItem('auth')

        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        return axios
            .post(transferProductUrl, data, config)
            .then(response => {
                return response;
            })
            .catch((error) => {
                throw error
            })
    }

    bulkUpdateTransferProduct(data) {
        const token = localStorage.getItem('auth')

        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        return axios
            .put(transferProductUrl, data, config)
            .then(response => {
                return response;
            })
            .catch((error) => {
                throw error
            })
    }


    bulkDeleteTransferProduct(ids) {
        const token = localStorage.getItem('auth')

        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: ids
        }
        return axios
            .delete(transferProductUrl, config)
            .then(response => {
                return response;
            })
            .catch((error) => {
                throw error
            })
    }


}


export default new TransferProductProvider();