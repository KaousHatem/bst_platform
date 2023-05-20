import { proformaRequestProductUrl } from '../utils/networks'
import axios from "axios";



class ProformaRequestProductProvider {

    addProformaRequestProduct(data) {
        const token = localStorage.getItem('auth')

        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        return axios
            .post(proformaRequestProductUrl, data, config)
            .then(response => {
                return response;
            })
            .catch((error) => {
                throw error
            })
    }

    bulkUpdateProformaRequestProduct(data) {
        const token = localStorage.getItem('auth')

        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        return axios
            .put(proformaRequestProductUrl, data, config)
            .then(response => {
                return response;
            })
            .catch((error) => {
                throw error
            })
    }


    bulkDeleteProformaRequestProduct(ids) {
        const token = localStorage.getItem('auth')

        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: ids
        }
        return axios
            .delete(proformaRequestProductUrl, config)
            .then(response => {
                return response;
            })
            .catch((error) => {
                throw error
            })
    }


}


export default new ProformaRequestProductProvider();