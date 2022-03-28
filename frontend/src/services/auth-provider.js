import {LoginUrl} from '../utils/networks'
import axios from "axios";



class AuthProvider {

    
    // login2( username, password ) {
    //     const request = new Request(LoginUrl, {
    //         method: 'POST',
    //         body: JSON.stringify({ username, password }),
    //         headers: new Headers({ 'Content-Type': 'application/json',}),
    //     });
    //     return fetch(request)
    //         .then(response => {
    //             if (response.status < 200 || response.status >= 300) {
    //                 throw new Error(response.statusText);
    //             }
    //             return response.json();
    //         })
    //         .then(auth => {
    //             localStorage.setItem('auth', JSON.stringify(auth));
    //         })
    //         .catch(() => {
    //             throw new Error('Network error')
    //         });
    // }

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
                console.log(error.response)
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