import { proformaInvoiceUrl } from '../utils/networks'
import axios from "axios";



class ProformaInvoiceProvider {


    getProformaInvoices(pk = -1) {

        const token = localStorage.getItem('auth')

        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        var url = proformaInvoiceUrl

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


    addProformaInvoice(data) {
        const token = localStorage.getItem('auth')

        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        return axios
            .post(proformaInvoiceUrl, data, config)
            .then(response => {

                return response;
            })
            .catch((error) => {
                throw error
            })
    }

    updateProformaInvoice(data, pk) {
        const token = localStorage.getItem('auth')

        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        return axios
            .put(proformaInvoiceUrl + pk + '/', data, config)
            .then(response => {

                return response;
            })
            .catch((error) => {
                throw error
            })
    }

    updatePartialProformaInvoice(data, pk) {
        const token = localStorage.getItem('auth')

        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        return axios
            .patch(proformaInvoiceUrl + pk + '/', data, config)
            .then(response => {

                return response;
            })
            .catch((error) => {
                throw error
            })
    }

    deleteProformaInvoice(pk) {
        const token = localStorage.getItem('auth')

        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        return axios
            .delete(proformaInvoiceUrl + pk + '/', config)
            .then(response => {

                return response;
            })
            .catch((error) => {
                throw error
            })
    }


}


export default new ProformaInvoiceProvider();