import { provisionUrl, provisionApproveUrl, provisionOnlyApprovedUrl } from "../utils/networks";
import axios from "axios";

class ProvisionProvider {
  getProvisions(pk = -1, params) {
    const token = localStorage.getItem("auth");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    var url = provisionUrl;
    //const headers = new Headers({ 'Content-Type': 'application/json',})
    if (pk !== -1) {
      url = provisionUrl + pk;
    }
    if (params) {
      url = url + "?" + params;
    }

    return axios
      .get(url, config)
      .then((response) => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.statusText);
        }
        console.log(response.data);
        return response;
      })
      .catch((error) => {
        throw new Error("Network error");
      });
  }

  getOnlyApprovedProvisions() {
    const token = localStorage.getItem("auth");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    return axios
      .get(provisionOnlyApprovedUrl, config)
      .then((response) => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.statusText);
        }
        return response;
      })
      .catch((error) => {
        throw new Error("Network error");
      });
  }

  getProductInPurchase(pk) {
    const token = localStorage.getItem("auth");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    return axios
      .get(provisionUrl + pk + "/get_product_in_purchase", config)
      .then((response) => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.statusText);
        }
        return response;
      })
      .catch((error) => {
        throw new Error("Network error");
      });
  }

  deleteProvision(pk) {
    const token = localStorage.getItem("auth");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return axios
      .delete(provisionUrl + pk, config)
      .then((response) => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.statusText);
        }
        return response;
      })
      .catch((error) => {
        throw new Error("Network error");
      });
  }

  addProvision(data) {
    const token = localStorage.getItem("auth");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return axios
      .post(provisionUrl, data, config)
      .then((response) => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.statusText);
        }
        return response;
      })
      .catch((error) => {
        throw new Error();
      });
  }

  approveProvision(pk) {
    const token = localStorage.getItem("auth");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    return axios
      .put(provisionUrl + pk + "/approve/", {}, config)
      .then((response) => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.statusText);
        }
        return response;
      })
      .catch((error) => {
        throw new Error();
      });
  }

  editProvision(data, pk) {
    const token = localStorage.getItem("auth");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return axios
      .put(provisionUrl + pk + "/", data, config)
      .then((response) => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.statusText);
        }
        return response;
      })
      .catch((error) => {
        throw new Error();
      });
  }

  partialEditProvision(data, pk) {
    const token = localStorage.getItem("auth");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return axios
      .patch(provisionUrl + pk + "/", data, config)
      .then((response) => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.statusText);
        }
        return response;
      })
      .catch((error) => {
        throw new Error();
      });
  }

  // getLastProduct() {

  //     //const headers = new Headers({ 'Content-Type': 'application/json',})

  //     return axios
  //         .get(lastProductUrl)
  //         .then(response => {
  //             console.log(response.data)
  //             if (response.status < 200 || response.status >= 300) {
  //                 throw new Error(response.statusText);
  //             }
  //             return response;
  //         })
  //         .catch((error) => {
  //             throw new Error('Network error')
  //         });
  // }

  // addBulkProduct(file) {
  //     const headers = new Headers({ 'Content-Type': 'text/csv',})
  //     return axios
  //         .post(bulkProductUrl, file, {'headers': headers})
  //         .then(response => {
  //             if (response.status < 200 || response.status >= 300) {
  //                 throw new Error(response.statusText);
  //             }
  //             return response;
  //         })
  //         .catch((error) => {
  //             throw new Error()
  //         })
  // }
}

export default new ProvisionProvider();
