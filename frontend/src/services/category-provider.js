import {categoryUrl} from '../utils/networks'
import axios from "axios";



class CategoryProvider {


    getCategories() {
        const token = localStorage.getItem('auth')
        
        const config = {
        headers: {
        Authorization: `Bearer ${token}`
        }}
            
        //const headers = new Headers({ 'Content-Type': 'application/json',})
        
        return axios
            .get(categoryUrl,config)
            .then(response => {
                if (response.status < 200 || response.status >= 300) {
                    throw new Error(response.statusText);
                }
                return response;
            })
            .catch((error) => {
                throw new Error('Network error')
            });
    }


}


export default new CategoryProvider();