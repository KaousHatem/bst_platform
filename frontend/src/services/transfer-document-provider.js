import { transferDocumentUrl } from '../utils/networks'
import axios from "axios";



class TransferDocumentProvider {


    getTransferDocuments(pk = -1) {

        const token = localStorage.getItem('auth')

        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        var url = transferDocumentUrl

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


    addTransferDocument(data) {
        const token = localStorage.getItem('auth')

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            }
        }
        return axios
            .post(transferDocumentUrl, data, config)
            .then(response => {

                return response;
            })
            .catch((error) => {
                throw error
            })
    }

    updateTransferDocument(data, pk) {
        const token = localStorage.getItem('auth')

        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        return axios
            .put(transferDocumentUrl + pk + '/', data, config)
            .then(response => {

                return response;
            })
            .catch((error) => {
                throw error
            })
    }



    deleteTransferDocument(pk) {
        const token = localStorage.getItem('auth')

        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        return axios
            .delete(transferDocumentUrl + pk + '/', config)
            .then(response => {

                return response;
            })
            .catch((error) => {
                throw error
            })
    }


}


export default new TransferDocumentProvider();