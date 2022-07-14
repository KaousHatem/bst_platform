import {LoginUrl} from '../utils/networks'
import axios from "axios";



class AuthProvider {

    

    login( username, password ) {
        const data =  { username, password }
            
        //const headers = new Headers({ 'Content-Type': 'application/json',})
        

        return axios
            .post(LoginUrl,data)
            .then(response => {
                console.log(response)
                if (response.status < 200 || response.status >= 300) {
                    console.log(response)
                    throw new Error(response.statusText);
                }else{
                    localStorage.setItem('auth', response.data.access);
                    localStorage.setItem('role', response.data.role);
                    return response;
                }     
            })
            .catch((error) => {
                throw error
            });
    }


    getCurrentUser() {
        console.log(localStorage.getItem('auth'))
        return localStorage.getItem('auth');
    }
    
    logout(){
    localStorage.clear()
    // localStorage.removeItem('role')
}
}


export default new AuthProvider();