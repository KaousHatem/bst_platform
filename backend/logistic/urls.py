from django.urls import path, include
from .views import (
    ProductViewSet,
    UnitViewSet,
    UnitConversionViewSet,
    CategoryViewSet,
    ProductBulkViewSet,
    ProvisionViewSet,
    ProvisionProductViewSet,
    PurchaseReqViewSet,
    PurchaseReqProductViewSet,
    SupplierViewSet,
    PurchaseOrderViewSet,
    PurchaseOrderProductViewSet,
    ReceiptViewSet,
    ReceiptProductViewSet,
    StoreViewSet,
    StockViewSet,
    StockInitViewSet,
    StockOutViewSet,
    StockInViewSet
)

from .view.proforma_invoice_views import (
    ProformaInvoiceRequestViewSet,
    ProformaInvoiceProductViewSet,
    ProformaInvoiceViewSet,
    ProformaInvoiceDocumentViewSet,
    ProformaInvoiceProductViewSet,
)

from .view.transfer_views import (
    TransferDocumentViewSet,
    TransferViewSet,
    TransferProductViewSet
)

from .view.stock_in_document_views import (
    StockInDocumentViewSet,
    StockInDocumentSourceFileViewSet,
    StockInDocumentProductViewSet,
    StockInDocumentFileViewSet

)

from .view.stock_out_document_views import (
    StockOutDocumentViewSet,
    StockOutDocumentProductViewSet,
    StockOutDocumentFileViewSet

)

from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register(r'logistic/product', ProductViewSet)
router.register(r'logistic/unit', UnitViewSet)
router.register(r'logistic/unit-conversion', UnitConversionViewSet)
router.register(r'logistic/product-bulk', ProductBulkViewSet)
router.register(r'logistic/category', CategoryViewSet)
router.register(r'logistic/provision', ProvisionViewSet)
router.register(r'logistic/provision-product', ProvisionProductViewSet)
router.register(r'logistic/purchase-request', PurchaseReqViewSet)
router.register(r'logistic/purchase-request-product',
                PurchaseReqProductViewSet)
router.register(r'logistic/supplier', SupplierViewSet)
router.register(r'logistic/purchase-order', PurchaseOrderViewSet)
router.register(r'logistic/purchase-order-product',
                PurchaseOrderProductViewSet)
router.register(r'logistic/receipt', ReceiptViewSet)
router.register(r'logistic/receipt-product', ReceiptProductViewSet)
router.register(r'logistic/store', StoreViewSet)
router.register(r'logistic/stock', StockViewSet)
router.register(r'logistic/stock-init', StockInitViewSet)
router.register(r'logistic/stock-out', StockOutViewSet)
router.register(r'logistic/stock-in', StockInViewSet)

router.register(r'logistic/proforma-invoice-request',
                ProformaInvoiceRequestViewSet)
router.register(r'logistic/proforma-invoice-request-product',
                ProformaInvoiceProductViewSet)
router.register(r'logistic/proforma-invoice',
                ProformaInvoiceViewSet)
router.register(r'logistic/proforma-invoice-document',
                ProformaInvoiceDocumentViewSet)
router.register(r'logistic/proforma-invoice-product',
                ProformaInvoiceProductViewSet)

router.register(r'logistic/transfer',
                TransferViewSet)
router.register(r'logistic/transfer-product',
                TransferProductViewSet)
router.register(r'logistic/transfer-document', TransferDocumentViewSet)
router.register(r'logistic/stock-in-document', StockInDocumentViewSet)
router.register(r'logistic/stock-in-document-source-file',
                StockInDocumentSourceFileViewSet)
router.register(r'logistic/stock-in-document-file',
                StockInDocumentFileViewSet)
router.register(r'logistic/stock-in-document-product',
                StockInDocumentProductViewSet)

router.register(r'logistic/stock-out-document', StockOutDocumentViewSet)

router.register(r'logistic/stock-out-document-file',
                StockOutDocumentFileViewSet)
router.register(r'logistic/stock-out-document-product',
                StockOutDocumentProductViewSet)

urlpatterns = [
    path("logistic/", include(router.urls)),

]
