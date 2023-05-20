import { stockOutDocumentFileUrl } from '../utils/networks'
import axios from "axios";



class StockOutDocumentFileProvider {


    addStockOutDocumentFile(data) {
        const token = localStorage.getItem('auth')

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            }
        }
        return axios
            .post(stockOutDocumentFileUrl, data, config)
            .then(response => {

                return response;
            })
            .catch((error) => {
                throw error
            })
    }





}


export default new StockOutDocumentFileProvider();