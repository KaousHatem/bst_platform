import {stockInUrl} from '../utils/networks'
import axios from "axios";



class StockInProvider {


    addStockIn(data) {
        const token = localStorage.getItem('auth')
        
        const config = {
        headers: {
        Authorization: `Bearer ${token}`
        }}
        return axios
            .post(stockInUrl, data, config)
            .then(response => {
                
                return response;
            })
            .catch((error) => {
                throw error
            })
    }

    
    


}


export default new StockInProvider();