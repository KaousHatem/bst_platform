import { TransferUrl } from '../utils/networks'
import axios from "axios";



class TransferProvider {


    getTransfers(pk = -1) {

        const token = localStorage.getItem('auth')

        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        var url = TransferUrl

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


    addTransfer(data) {
        const token = localStorage.getItem('auth')

        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        return axios
            .post(TransferUrl, data, config)
            .then(response => {

                return response;
            })
            .catch((error) => {
                throw error
            })
    }

    updateTransfer(data, pk) {
        const token = localStorage.getItem('auth')

        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        return axios
            .put(TransferUrl + pk + '/', data, config)
            .then(response => {

                return response;
            })
            .catch((error) => {
                throw error
            })
    }

    updatePartialTransfer(data, pk) {
        const token = localStorage.getItem('auth')

        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        return axios
            .patch(TransferUrl + pk + '/', data, config)
            .then(response => {

                return response;
            })
            .catch((error) => {
                throw error
            })
    }

    deleteTransfer(pk) {
        const token = localStorage.getItem('auth')

        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        return axios
            .delete(TransferUrl + pk + '/', config)
            .then(response => {

                return response;
            })
            .catch((error) => {
                throw error
            })
    }


}


export default new TransferProvider();