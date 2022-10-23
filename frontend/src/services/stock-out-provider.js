import {stockOutUrl} from '../utils/networks'
import axios from "axios";



class StockOutProvider {


    addStockOut(data) {
        const token = localStorage.getItem('auth')
        
        const config = {
        headers: {
        Authorization: `Bearer ${token}`
        }}
        return axios
            .post(stockOutUrl, data, config)
            .then(response => {
                
                return response;
            })
            .catch((error) => {
                throw error
            })
    }

    
    


}


export default new StockOutProvider();