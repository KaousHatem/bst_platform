// const BaseUrl = "http://127.0.0.1:8000/api/";
const BaseUrl = process.env.NEXT_PUBLIC_BASE_URL_API;

export const LoginUrl = BaseUrl + "user/login/";
export const CreateUserUrl = BaseUrl + "user/create-user/";
export const UserListUrl = BaseUrl + "user/users";
export const ActivateUrl = BaseUrl + "user/activate";
export const UserMeUrl = BaseUrl + "user/me";
export const UserListShortUrl = BaseUrl + "user/users/short/";

export const unitUrl = BaseUrl + "logistic/unit/";
export const UnitConversionUrl = BaseUrl + "logistic/unit-conversion/";
export const BulkUnitConversionUrl = BaseUrl + "logistic/unit-conversion/delete/";
export const productUrl = BaseUrl + "logistic/product/";
export const categoryUrl = BaseUrl + "logistic/category/";
export const lastProductUrl = productUrl + "last/";
export const bulkProductUrl = BaseUrl + "logistic/product-bulk/";

export const provisionUrl = BaseUrl + "logistic/provision/";
export const provisionProductUrl = BaseUrl + "logistic/provision-product/";
export const provisionApproveUrl = provisionUrl + "approve/";
export const provisionOnlyApprovedUrl = provisionUrl + "list_only_approved/";

export const locationUrl = BaseUrl + "project/locations/";

export const purchaseRequestUrl = BaseUrl + "logistic/purchase-request/";
export const prOnlyApprovedUrl = purchaseRequestUrl + "list_only_approved/";
export const prProductUrl = BaseUrl + "logistic/purchase-request-product/";

export const purchaseOrderUrl = BaseUrl + "logistic/purchase-order/";
export const poProductUrl = BaseUrl + "logistic/purchase-order-product/";

export const supplierUrl = BaseUrl + "logistic/supplier/";

export const receiptUrl = BaseUrl + "logistic/receipt/";
export const receiptProductUrl = BaseUrl + "logistic/receipt-product/";
export const receiptDocumentUrl = BaseUrl + "logistic/receipt-document/";

export const storeUrl = BaseUrl + "logistic/store/";

export const stockUrl = BaseUrl + "logistic/stock/";
export const stockUserLocationUrl = BaseUrl + "logistic/stock/user_location/";

export const stockInitUrl = BaseUrl + "logistic/stock-init/";
export const stockInUrl = BaseUrl + "logistic/stock-in/";
export const stockOutUrl = BaseUrl + "logistic/stock-out/";

export const proformaRequestUrl = BaseUrl + "logistic/proforma-invoice-request/";
export const proformaRequestProductUrl = BaseUrl + "logistic/proforma-invoice-request-product/";

export const proformaInvoiceUrl = BaseUrl + "logistic/proforma-invoice/";
export const proformaInvoiceProductUrl = BaseUrl + "logistic/proforma-invoice-product/";

export const TransferUrl = BaseUrl + "logistic/transfer/";
export const transferProductUrl = BaseUrl + "logistic/transfer-product/";

export const transferDocumentUrl = BaseUrl + "logistic/transfer-document/";

export const stockInDocumentUrl = BaseUrl + "logistic/stock-in-document/";
export const stockInDocumentSourceFileUrl = BaseUrl + "logistic/stock-in-document-source-file/";
export const stockInDocumentFileUrl = BaseUrl + "logistic/stock-in-document-file/";
export const stockInDocumentProductUrl = BaseUrl + "logistic/stock-in-document-product/";

export const stockOutDocumentUrl = BaseUrl + "logistic/stock-out-document/";
export const stockOutDocumentFileUrl = BaseUrl + "logistic/stock-out-document-file/";
export const stockOutDocumentProductUrl = BaseUrl + "logistic/stock-out-document-product/";
