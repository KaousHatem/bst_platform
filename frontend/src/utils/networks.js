// const BaseUrl = "http://127.0.0.1:8000/"
const BaseUrl = "http://164.92.133.247:8000/"

export const LoginUrl = BaseUrl + "user/login"
export const CreateUserUrl = BaseUrl + "user/create-user"
export const UserListUrl = BaseUrl + "user/users"
export const ActivateUrl = BaseUrl + "user/activate"
export const UserMeUrl = BaseUrl + "user/me"

export const productUrl = BaseUrl + "logistic/product/"
export const categoryUrl = BaseUrl + "logistic/category/"
export const lastProductUrl = productUrl + 'last/'
export const bulkProductUrl = BaseUrl + 'logistic/product-bulk/'

export const provisionUrl = BaseUrl + 'logistic/provision/'
export const provisionProductUrl = BaseUrl + 'logistic/provision-product/'
export const provisionApproveUrl = provisionUrl + 'approve/'

export const locationUrl = BaseUrl + 'project/locations/'





