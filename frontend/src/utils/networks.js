// const BaseUrl = "http://127.0.0.1:8000/"
const BaseUrl = "http://164.92.167.240/"

export const LoginUrl = BaseUrl + "user/logiin"
export const CreateUserUrl = BaseUrl + "user/create-user"
export const UserListUrl = BaseUrl + "user/users"
export const ActivateUrl = BaseUrl + "user/activate"
export const UserMeUrl = BaseUrl + "user/me"

export const unitUrl = BaseUrl + "logistic/unit/"
export const UnitConversionUrl = BaseUrl + "logistic/unit-conversion/"
export const BulkUnitConversionUrl = BaseUrl + "logistic/unit-conversion/delete/"
export const productUrl = BaseUrl + "logistic/product/"
export const categoryUrl = BaseUrl + "logistic/category/"
export const lastProductUrl = productUrl + 'last/'
export const bulkProductUrl = BaseUrl + 'logistic/product-bulk/'

export const provisionUrl = BaseUrl + 'logistic/provision/'
export const provisionProductUrl = BaseUrl + 'logistic/provision-product/'
export const provisionApproveUrl = provisionUrl + 'approve/'
export const provisionOnlyApprovedUrl = provisionUrl + 'list_only_approved/'

export const locationUrl = BaseUrl + 'project/locations/'

export const purchaseRequestUrl = BaseUrl + 'logistic/purchase-request/'
export const prOnlyApprovedUrl = purchaseRequestUrl + 'list_only_approved/'
export const prProductUrl = BaseUrl + 'logistic/purchase-request-product/'


export const purchaseOrderUrl = BaseUrl + 'logistic/purchase-order/'
export const poProductUrl = BaseUrl + 'logistic/purchase-order-product/'



export const supplierUrl = BaseUrl + 'logistic/supplier/'






