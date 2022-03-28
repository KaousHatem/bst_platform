import {ports} from './ports';
import axios from "axios";

function getCookie(name) {
        let cookieValue = null;
        console.log(document.headers)
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
export class ProductService{
	
	constructor(){

	}

	getProductList2(){

		return fetch("http://127.0.0.1:8000/logistic/product", {method: 'GET',
            headers: new Headers({'Content-type': 'application/json'}),
            credentials: 'include'})
				.then(response => response.json())
				.catch(error => console.log(error))
	}
	

    getProductList() {
    	const csrftoken = getCookie('csrftoken');
    	const contextUrl = "http://127.0.0.1:8000/logistic" + "/product";
    	let headers = {'X-Requested-With': 'XMLHttpRequest',
    	"Content-Type": "application/json",
    	"X-CSRFToken":csrftoken}
    	
    	console.log(contextUrl)
    return axios.get("http://127.0.0.1:8000/logistic/product",{headers:headers})
      .then(response => response.data)
      .catch(error => {
        console.log(error.headers)
      });


  }
}