import { receiptDocumentUrl } from '../utils/networks'
import axios from "axios";



class ReceiptDocumentProvider {

    getReceiptDocuments(pk = -1) {

        const token = localStorage.getItem('auth')

        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        var url = receiptDocumentUrl

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

    addReceiptDocument(data) {
        const token = localStorage.getItem('auth')

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }
        return axios
            .post(receiptDocumentUrl, data, config)
            .then(response => {

                return response;
            })
            .catch((error) => {
                throw error
            })
    }

    deleteReceiptDocument(pk) {
        const token = localStorage.getItem('auth')

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }
        return axios
            .delete(receiptDocumentUrl + pk + "/", config)
            .then(response => {

                return response;
            })
            .catch((error) => {
                throw error
            })
    }





}


export default new ReceiptDocumentProvider();