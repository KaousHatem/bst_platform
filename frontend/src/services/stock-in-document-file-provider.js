import { stockInDocumentFileUrl } from '../utils/networks'
import axios from "axios";



class StockInDocumentFileProvider {


    addStockInDocumentFile(data) {
        const token = localStorage.getItem('auth')

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            }
        }
        return axios
            .post(stockInDocumentFileUrl, data, config)
            .then(response => {

                return response;
            })
            .catch((error) => {
                throw error
            })
    }





}


export default new StockInDocumentFileProvider();