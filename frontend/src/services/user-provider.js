import { CreateUserUrl, UserListUrl, ActivateUrl, UserMeUrl, UserSignatureUrl, UserListShortUrl } from '../utils/networks'
import axios from "axios";



class UserProvider {

    
   

    deleteUser(pk){
        const token = localStorage.getItem('auth')
        
        const config = {
        headers: {
        Authorization: `Bearer ${token}`
        }}
        return axios
            .delete(UserListUrl+'/'+pk,config)
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

    updateUser(data,pk) {
        const token = localStorage.getItem('auth')
        
        const config = {
        headers: {
        Authorization: `Bearer ${token}`
        }}
        return axios
            .put(CreateUserUrl+pk+"/", data, config)
            .then(response => {
                if (response.status < 200 || response.status >= 300) {
                    throw new Error(response.statusText);
                }
                return response;
            })
            .catch((error) => {
                throw new Error(error.response.data.message,{cause:error.response})
            })
    }

    activateUser(data, pk) {
        const token = localStorage.getItem('auth')
        
        const config = {
        headers: {
        Authorization: `Bearer ${token}`
        }}
        return axios
            .put(ActivateUrl+'/'+pk+'/', data, config)
            .then(response => {
                if (response.status < 200 || response.status >= 300) {
                    throw new Error(response.statusText);
                }
                return response;
            })
            .catch((error) => {
                throw new Error()
            })
    }

    addUser(data) {
        const token = localStorage.getItem('auth')
        
        const config = {
        headers: {
        Authorization: `Bearer ${token}`
        }}
        return axios
            .post(CreateUserUrl, data, config)
            .then(response => {
                console.log(response)
                if (response.status < 200 || response.status >= 300) {

                    throw new Error(response);
                }
                return response;
            })
            .catch((error) => {
                throw new Error(error.response.data.message,{cause:error.response})
            })
    }

    getUsers(pk=-1) {
        const token = localStorage.getItem('auth')
        
        const config = {
        headers: {
        Authorization: `Bearer ${token}`
        }}
        var url = UserListUrl
        //const headers = new Headers({ 'Content-Type': 'application/json',})
        if (pk!==-1){
            url = url + '/' + pk.toString()
        }
        return axios
            .get(url,config)
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

    getUsersShort(pk=-1) {
        const token = localStorage.getItem('auth')
        
        const config = {
        headers: {
        Authorization: `Bearer ${token}`
        }}
        var url = UserListShortUrl
        //const headers = new Headers({ 'Content-Type': 'application/json',})
        if (pk!==-1){
            url = url + '/' + pk.toString()
        }
        return axios
            .get(url,config)
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

    getMeUser() {
        const token = localStorage.getItem('auth')
        
        const config = {
        headers: {
        Authorization: `Bearer ${token}`
        }}
        
        return axios
            .get(UserMeUrl,config)
            .then(response => {
                if (response.status < 200 || response.status >= 300) {
                    throw new Error(response.statusText);
                }
                console.log(response.data)
                return response;
            })
            .catch((error) => {
                // throw new Error('Network error')
                return false
            });
    }

    getUserSignature(pk=-1){
        const token = localStorage.getItem('auth')
        
        const config = {
        headers: {
        Authorization: `Bearer ${token}`
        }}
        
        return axios
            .get(UserListUrl+'/'+pk+'/signature',config)
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


export default new UserProvider();