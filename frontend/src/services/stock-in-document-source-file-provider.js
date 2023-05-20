import { stockInDocumentSourceFileUrl } from '../utils/networks'
import axios from "axios";



class StockInDocumentSourceFileProvider {


    addStockInDocumentSourceFile(data) {
        const token = localStorage.getItem('auth')

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            }
        }
        return axios
            .post(stockInDocumentSourceFileUrl, data, config)
            .then(response => {

                return response;
            })
            .catch((error) => {
                throw error
            })
    }





}


export default new StockInDocumentSourceFileProvider();