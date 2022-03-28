import {locationUrl} from '../utils/networks'
import axios from "axios";



class LocationProvider {


    getLocations() {
            
        //const headers = new Headers({ 'Content-Type': 'application/json',})
        const token = localStorage.getItem('auth')
        
        const config = {
        headers: {
        Authorization: `Bearer ${token}`
        }}
        return axios
            .get(locationUrl, config)
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


export default new LocationProvider();