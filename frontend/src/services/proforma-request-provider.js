import { proformaRequestUrl } from '../utils/networks'
import axios from "axios";



class ProformaRequestProvider {


    getProformaRequests(pk = -1) {

        const token = localStorage.getItem('auth')

        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        var url = proformaRequestUrl

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


    addProformaRequest(data) {
        const token = localStorage.getItem('auth')

        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        return axios
            .post(proformaRequestUrl, data, config)
            .then(response => {

                return response;
            })
            .catch((error) => {
                throw error
            })
    }

    updateProformaRequest(data, pk) {
        const token = localStorage.getItem('auth')

        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        return axios
            .put(proformaRequestUrl + pk + '/', data, config)
            .then(response => {

                return response;
            })
            .catch((error) => {
                throw error
            })
    }

    updatePartialProformaRequest(data, pk) {
        const token = localStorage.getItem('auth')

        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        return axios
            .patch(proformaRequestUrl + pk + '/', data, config)
            .then(response => {

                return response;
            })
            .catch((error) => {
                throw error
            })
    }

    deleteProformaRequest(pk) {
        const token = localStorage.getItem('auth')

        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        return axios
            .delete(proformaRequestUrl + pk + '/', config)
            .then(response => {

                return response;
            })
            .catch((error) => {
                throw error
            })
    }


}


export default new ProformaRequestProvider();