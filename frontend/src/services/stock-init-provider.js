import {stockInitUrl} from '../utils/networks'
import axios from "axios";



class StockInitProvider {


    addStockInit(data) {
        const token = localStorage.getItem('auth')
        
        const config = {
        headers: {
        Authorization: `Bearer ${token}`
        }}
        return axios
            .post(stockInitUrl, data, config)
            .then(response => {
                
                return response;
            })
            .catch((error) => {
                throw error
            })
    }

    
    


}


export default new StockInitProvider();