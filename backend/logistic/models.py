import os
from django.db import models
from django.db.models import Q
from django.utils.translation import gettext_lazy as _
import datetime

from project.models import Location
from user_control.models import CustomUser


class Category(models.Model):
    ref = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=220)

    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE)

    def __str__(self):
        return self.ref

    def save(self, *args, **kwargs):
        if self.ref == "" or self.ref == None:
            self.ref = self.name[:3]
        super(Category, self).save(*args, **kwargs)


class Unit(models.Model):
    ref = models.CharField(max_length=20, unique=True, null=True)
    name = models.CharField(max_length=220)

    def __str__(self):
        return self.ref


class Product(models.Model):
    sku = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=220)
    description = models.CharField(max_length=220, null=True, blank=True,)
    status = models.BooleanField(default=True)
    base_unit = models.ForeignKey(
        Unit, on_delete=models.CASCADE, null=True, blank=True,)
    category = models.ForeignKey(Category, on_delete=models.DO_NOTHING)
    created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.sku

    class Meta:
        ordering = ('id',)

    def get_category_ref(self):
        return self.category.ref

    def save(self, *args, **kwargs):
        if self.sku == "" or self.sku == None:
            if Product.objects.all():
                self.id = Product.objects.all().last().id + 1
                self.sku = self.get_category_ref() + str(Product.objects.all().last().id + 1).zfill(7)
            else:
                self.sku = self.get_category_ref() + str(1).zfill(7)
        super(Product, self).save(*args, **kwargs)


class UnitConversion(models.Model):
    product = models.ForeignKey(
        Product, related_name='unit_conversions', on_delete=models.CASCADE)
    base_unit = models.ForeignKey(
        Unit, on_delete=models.CASCADE, related_name='unit_conversion_base_unit')
    to_unit = models.ForeignKey(
        Unit, on_delete=models.CASCADE, related_name='unit_conversion_to_unit')
    multiplier = models.FloatField()


class Store(models.Model):
    location = models.ForeignKey(
        Location, on_delete=models.DO_NOTHING, related_name="store")
    name = models.CharField(max_length=225)
    store_manager = models.ForeignKey(
        CustomUser, on_delete=models.DO_NOTHING, related_name="store", null=True)
    _open = models.BooleanField(default=True)
    created_by = models.ForeignKey(
        CustomUser, on_delete=models.DO_NOTHING, related_name="created_by")
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)


class Transfer(models.Model):
    STATUS = (
        ('1', _("NEW")),
        ('999', _("COMPLETED")),
    )
    ref = models.CharField(max_length=20, unique=True, null=True)
    source = models.ForeignKey(
        Store, on_delete=models.DO_NOTHING, related_name="source")
    target = models.ForeignKey(
        Store, on_delete=models.DO_NOTHING, related_name="target")
    status = models.CharField(
        _("status"), max_length=220, default="1", choices=STATUS)

    created_by = models.ForeignKey(
        CustomUser, on_delete=models.DO_NOTHING, related_name='transfer_created_by')
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)
    received_by = models.ForeignKey(
        CustomUser, on_delete=models.DO_NOTHING, related_name='transfer_received_by', null=True)
    received_on = models.DateTimeField(null=True)

    def save(self, *args, **kwargs):
        today = datetime.datetime.now()
        if Transfer.objects.filter(~Q(ref=None)):
            last_ref = Transfer.objects.filter(
                ~Q(ref=None)).order_by('ref').last().ref.split('/')[0]
            last_ref_int = int(last_ref)
            self.ref = str(last_ref_int+1).zfill(4) + '/' + str(today.year)
        else:
            self.ref = str(1).zfill(4) + '/' + str(today.year)
        super(Transfer, self).save(*args, **kwargs)


class TransferProductRel(models.Model):
    transfer = models.ForeignKey(
        Transfer, related_name='products', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.DO_NOTHING)
    quantity = models.FloatField()
    price = models.FloatField(null=True)
    unit = models.ForeignKey(
        Unit, on_delete=models.CASCADE, null=True, blank=True,)


def _upload_to(instance, filename):
    name, extension = os.path.splitext(filename)
    file = "{}_{}".format(name, extension)
    return "documents/{}/{}".format(instance.__class__.__name__, file)


# def transfer_directory_path(instance, filename):
#     # file will be uploaded to MEDIA_ROOT/user_<id>/<filename>
#     return 'documents/transfer/{1}'.format(filename)


class TransferDocument(models.Model):
    transfer = models.OneToOneField(
        Transfer, related_name='document', on_delete=models.CASCADE)
    file = models.FileField(
        upload_to=_upload_to, blank=True, null=True)
    created_on = models.DateTimeField(auto_now_add=True)

    def delete(self, *args, **kwargs):
        self.file.delete()
        super(TransferDocument, self).delete(*args, **kwargs)


class Stock(models.Model):
    store = models.ForeignKey(
        Store, on_delete=models.DO_NOTHING, related_name="products")
    product = models.ForeignKey(Product, on_delete=models.DO_NOTHING)
    quantity = models.FloatField(default=0)
    price = models.FloatField(null=True, default=0.0)
    updated_by = models.ForeignKey(
        CustomUser, on_delete=models.DO_NOTHING, null=True)
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)


# check ref https://medium.com/@yedjoe/celery-4-periodic-task-in-django-9f6b5a8c21c7
# class StockSnapshot(models.Model):
# 	stock = models.ForeignKey(Stock, on_delete=models.DO_NOTHING, related_name="snapshots")
# 	quantity = models.IntegerField()
# 	created_on = models.DateTimeField(auto_now_add=True)

class StockMovement(models.Model):
    MOVEMENT = (
        ('0', _("in")),
        ('1', _("out")),
        ('2', _("init")),
    )
    stock = models.ForeignKey(
        Stock, on_delete=models.DO_NOTHING, related_name="stock_movement", null=True)
    movement_type = models.CharField(
        _("movement_type"), max_length=22, choices=MOVEMENT)
    movement_id = models.IntegerField(null=True, blank=True)
    created_on = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('-created_on',)
        unique_together = [
            ("movement_type", "movement_id"),
        ]


class StockInit(models.Model):
    ref = models.CharField(max_length=20, unique=True, null=True)
    stock = models.ForeignKey(
        Stock, on_delete=models.DO_NOTHING, related_name="stock_init")
    quantity = models.FloatField()
    old_quantity = models.FloatField(null=True)
    price = models.FloatField(null=True)
    old_price = models.FloatField(null=True)
    note = models.CharField(max_length=500, null=True, blank=True)
    created_by = models.ForeignKey(CustomUser, on_delete=models.DO_NOTHING)
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ('created_on',)

    def save(self, *args, **kwargs):
        today = datetime.datetime.now()
        if StockInit.objects.filter(~Q(ref=None)):
            last_ref = StockInit.objects.filter(
                ~Q(ref=None)).order_by('ref').last().ref.split('/')[0]
            last_ref_int = int(last_ref)
            self.ref = str(last_ref_int+1).zfill(4) + '/' + str(today.year)
        else:
            self.ref = str(1).zfill(4) + '/' + str(today.year)

        if not self.pk:
            stock = self.stock
            self.old_quantity = stock.quantity
            self.old_price = stock.price
            stock.quantity = self.quantity
            stock.price = self.price
            stock.save()
        super(StockInit, self).save(*args, **kwargs)

        stockInit = StockMovement.objects.create(
            movement_type='2', movement_id=int(self.pk), stock=self.stock)
        stockInit.save()

    # def delete(self, *args, **kwargs):
    # 	stock = self.stock
    # 	stock.quantity = stock.quantity - self.quantity
    # 	stock.save()
    # 	super(StockIn, self).delete(*args, **kwargs)


def _upload_to_stock_in(instance, filename):
    name, extension = os.path.splitext(filename)
    file = "{}_{}".format(name, extension)
    return "documents/{}/{}".format(instance.__class__.__name__, file)


class StockInDocument(models.Model):
    SOURCE = (
        ('0', _("PURCHASE")),
        ('1', _("CASH_PURCHASE")),
        ('2', _("TRANSFER")),
        ('3', _("OTHER")),
    )

    STATUS = (
        ('1', _("NEW")),
        ('999', _("COMPLETED")),
    )
    ref = models.CharField(max_length=20, null=True)
    source = models.CharField(_("source"), max_length=22, choices=SOURCE)
    source_id = models.CharField(max_length=50, null=True)
    created_by = models.ForeignKey(CustomUser, on_delete=models.DO_NOTHING)
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)
    store = models.ForeignKey(
        Store, on_delete=models.DO_NOTHING, related_name="stock_in_documents", null=True)
    note = models.CharField(max_length=500, null=True, blank=True)
    status = models.CharField(
        _("status"), max_length=220, default="new", choices=STATUS)

    def save(self, *args, **kwargs):
        today = datetime.datetime.now()

        if not self.pk:
            stockInDocumentsByStore = StockInDocument.objects.filter(
                store=self.store.id)

            if stockInDocumentsByStore:
                if stockInDocumentsByStore.filter(~Q(ref=None)):

                    last_ref = stockInDocumentsByStore.filter(~Q(ref=None)).order_by(
                        'ref').last().ref.split('/')[0]
                    last_ref_int = int(last_ref)
                    self.ref = str(last_ref_int+1).zfill(4) + \
                        '/' + str(today.year)
            else:

                self.ref = str(1).zfill(4) + '/' + str(today.year)

        super(StockInDocument, self).save(*args, **kwargs)


class StockInDocumentProductRel(models.Model):
    stock_in_document = models.ForeignKey(
        StockInDocument, related_name="products", on_delete=models.CASCADE)
    product = models.ForeignKey(
        Product, on_delete=models.DO_NOTHING, null=True)
    quantity = models.FloatField(null=True)
    price = models.FloatField(null=True)
    unit = models.ForeignKey(Unit, on_delete=models.DO_NOTHING, null=True)


class StockInDocumentSourceFile(models.Model):
    stock_in_document = models.ForeignKey(
        StockInDocument, related_name="source_file", on_delete=models.CASCADE)
    file = models.FileField(
        upload_to=_upload_to_stock_in)
    created_on = models.DateTimeField(auto_now_add=True)


class StockInDocumentFile(models.Model):
    stock_in_document = models.ForeignKey(
        StockInDocument, related_name="file", on_delete=models.CASCADE)
    file = models.FileField(
        upload_to=_upload_to_stock_in)
    created_on = models.DateTimeField(auto_now_add=True)


class StockIn(models.Model):

    SOURCE = (
        ('0', _("PURCHASE")),
        ('1', _("CASH_PURCHASE")),
        ('2', _("TRANSFER")),
        ('3', _("OTHER")),
    )
    ref = models.CharField(max_length=20, unique=True, null=True)
    stock = models.ForeignKey(
        Stock, on_delete=models.DO_NOTHING, related_name="stock_in")
    quantity = models.FloatField()
    price = models.FloatField(null=True)
    source = models.CharField(_("source"), max_length=22, choices=SOURCE)
    source_id = models.IntegerField(null=True, blank=True)
    created_by = models.ForeignKey(CustomUser, on_delete=models.DO_NOTHING)
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)
    note = models.CharField(max_length=500, null=True, blank=True)

    class Meta:
        ordering = ('created_on',)

    def save(self, *args, **kwargs):
        today = datetime.datetime.now()
        if StockIn.objects.filter(~Q(ref=None)):
            last_ref = StockIn.objects.filter(~Q(ref=None)).order_by(
                'ref').last().ref.split('/')[0]
            last_ref_int = int(last_ref)
            self.ref = str(last_ref_int+1).zfill(4) + '/' + str(today.year)
        else:
            self.ref = str(1).zfill(4) + '/' + str(today.year)

        if not self.pk:
            stock = self.stock
            if self.price:

                stock.price = round((stock.price * stock.quantity + self.price *
                                    self.quantity)/(stock.quantity+self.quantity), 2)

            stock.quantity = stock.quantity + self.quantity
            stock.save()

            super(StockIn, self).save(*args, **kwargs)

            stockIn = StockMovement.objects.create(
                movement_type='0', movement_id=int(self.pk), stock=self.stock)
            stockIn.save()
        else:
            if self.price:
                stock = self.stock
                if stock.quantity == 0:
                    stock.price = self.price
                else:
                    stock.price = round((stock.price * (stock.quantity-self.quantity) +
                                         self.price * self.quantity)/(stock.quantity), 2)
                stock.save()
            super(StockIn, self).save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        stock = self.stock
        stock.quantity = stock.quantity - self.quantity
        stock.save()
        super(StockIn, self).delete(*args, **kwargs)


def _upload_to_stock_out(instance, filename):
    name, extension = os.path.splitext(filename)
    file = "{}_{}".format(name, extension)
    return "documents/{}/{}".format(instance.__class__.__name__, file)


class StockOutDocument(models.Model):
    TARGET = (
        ('3', _("TO_PROJECT")),
        ('4', _("OTHER")),
    )

    STATUS = (
        ('1', _("NEW")),
        ('999', _("COMPLETED")),
    )
    ref = models.CharField(max_length=20, unique=True, null=True)
    target = models.CharField(_("TARGET"), max_length=22, choices=TARGET)
    target_detail = models.CharField(max_length=220, null=True, blank=True)
    created_by = models.ForeignKey(CustomUser, on_delete=models.DO_NOTHING)
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)
    store = models.ForeignKey(
        Store, on_delete=models.DO_NOTHING, related_name="stock_out_documents", null=True)
    note = models.CharField(max_length=500, null=True, blank=True)
    status = models.CharField(
        _("status"), max_length=220, default="new", choices=STATUS)

    def save(self, *args, **kwargs):
        today = datetime.datetime.now()

        if not self.pk:
            if StockOutDocument.objects.filter(~Q(ref=None)):
                last_ref = StockOutDocument.objects.filter(~Q(ref=None)).order_by(
                    'ref').last().ref.split('/')[0]
                last_ref_int = int(last_ref)
                self.ref = str(last_ref_int+1).zfill(4) + '/' + str(today.year)
            else:
                self.ref = str(1).zfill(4) + '/' + str(today.year)

        super(StockOutDocument, self).save(*args, **kwargs)


class StockOutDocumentProductRel(models.Model):
    stock_out_document = models.ForeignKey(
        StockOutDocument, related_name="products", on_delete=models.CASCADE)
    product = models.ForeignKey(
        Product, on_delete=models.DO_NOTHING, null=True)
    quantity = models.FloatField(null=True)
    price = models.FloatField(null=True)
    unit = models.ForeignKey(Unit, on_delete=models.DO_NOTHING, null=True)


# class StockOutDocumentTargetFile(models.Model):
#     stock_out_document = models.ForeignKey(
#         StockOutDocument, related_name="target_file", on_delete=models.DO_NOTHING)
#     file = models.FileField(
#         upload_to=_upload_to_stock_out)
#     created_on = models.DateTimeField(auto_now_add=True)


class StockOutDocumentFile(models.Model):
    stock_out_document = models.ForeignKey(
        StockOutDocument, related_name="file", on_delete=models.CASCADE)
    file = models.FileField(
        upload_to=_upload_to_stock_out)
    created_on = models.DateTimeField(auto_now_add=True)


class StockOut(models.Model):

    TARGET = (
        ('2', _("TRANSFER")),
        ('3', _("TO_PROJECT")),
        ('4', _("OTHER")),
    )
    ref = models.CharField(max_length=20, unique=True, null=True)
    stock = models.ForeignKey(
        Stock, on_delete=models.DO_NOTHING, related_name="stock_out")
    quantity = models.FloatField()
    price = models.FloatField(null=True)
    target = models.CharField(_("target"), max_length=22, choices=TARGET)
    target_detail = models.CharField(max_length=220, null=True, blank=True)
    transfer = models.ForeignKey(
        Transfer, on_delete=models.DO_NOTHING, null=True)
    stockOutDocument = models.ForeignKey(
        StockOutDocument, on_delete=models.CASCADE, null=True)
    created_by = models.ForeignKey(CustomUser, on_delete=models.DO_NOTHING)
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)
    note = models.CharField(max_length=500, null=True, blank=True)

    class Meta:
        ordering = ('created_on',)

    def save(self, *args, **kwargs):
        today = datetime.datetime.now()
        if not self.pk:
            if StockOut.objects.filter(~Q(ref=None)):
                last_ref = StockOut.objects.filter(
                    ~Q(ref=None)).order_by('ref').last().ref.split('/')[0]
                last_ref_int = int(last_ref)
                self.ref = str(last_ref_int+1).zfill(4) + '/' + str(today.year)
            else:
                self.ref = str(1).zfill(4) + '/' + str(today.year)
        if not self.pk:
            stock = self.stock
            stock.quantity = stock.quantity - self.quantity
            stock.save()
            super(StockOut, self).save(*args, **kwargs)
            stockOut = StockMovement.objects.create(
                movement_type='1', movement_id=int(self.pk), stock=self.stock)
            stockOut.save()
        else:
            super(StockOut, self).save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        stock = self.stock
        print(stock)
        stock.quantity = stock.quantity + self.quantity
        stock.save()
        super(StockOut, self).delete(*args, **kwargs)


class Provision(models.Model):
    STATUS = (
        ('0', _("DRAFT")),
        ('1', _("NEW")),
        ('4', _("DROP")),
        ('9', _("APPROVED")),
        ('99', _("ON DELIVERY")),
        ('999', _("COMPLETED")),
    )
    ref = models.CharField(max_length=20, unique=True, null=True)
    destination = models.ForeignKey(Location, on_delete=models.CASCADE)
    created_by = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name='provision_created_by',)
    approved_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE,
                                    related_name='provision_approved_by', null=True, blank=True, default=None)
    status = models.CharField(
        _("status"), max_length=220, default="new", choices=STATUS)
    delay = models.DateField()
    created_on = models.DateTimeField(auto_now_add=True, editable=True)
    updated_on = models.DateTimeField(auto_now=True)
    approved_on = models.DateTimeField(null=True, blank=True)

    dropped_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE,
                                   related_name='provision_dropped_by', null=True, blank=True, default=None)
    dropped_on = models.DateTimeField(null=True, blank=True)
    note = models.TextField(null=True, blank=True)

    __original_status = None
    __ref = None

    class Meta:
        ordering = ('id',)
        permissions = (
            ("approve_provision", "Can approve provision"),
        )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # self.__original_status = self.status
        # self.__ref = self.ref

    @classmethod
    def from_db(cls, db, field_names, values):
        instance = super().from_db(db, field_names, values)
        instance.__original_status = instance.status
        instance.__ref = instance.ref
        return instance

    def save(self, *args, **kwargs):
        if self.status == '9' and self.__original_status == '1':
            self.approved_on = datetime.datetime.now()

        if (self.status != '0') or (self.__original_status == '0' and self.__original_status != self.status):
            today = datetime.datetime.now()
            if self.__ref == "" or self.__ref == None:
                self.created_on = self.updated_on
                if Provision.objects.filter(~Q(ref=None)):
                    # self.id = Provision.objects.all().last().id + 1
                    last_ref = Provision.objects.filter(
                        ~Q(ref=None)).order_by('ref').last().ref.split('/')[0]
                    last_ref_int = int(last_ref)
                    self.ref = str(last_ref_int+1).zfill(4) + \
                        '/' + str(today.year)
                else:
                    self.ref = str(1).zfill(4) + '/' + str(today.year)

            else:
                self.ref = self.__ref
        super(Provision, self).save(*args, **kwargs)
        self.__original_status = self.status


class ProvisionProductRel(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    provision = models.ForeignKey(
        Provision, related_name='provisionProducts', on_delete=models.CASCADE)

    # change unit from charField for ForeignKey
    unit = models.ForeignKey(
        Unit, on_delete=models.CASCADE, null=True, blank=True,)
    quantity = models.FloatField()


class PurchaseRequest(models.Model):
    STATUS = (
        ('0', _("DRAFT")),
        ('1', _("NEW")),
        ('4', _("DROP")),
        ('9', _("APPROVED")),
        ('999', _("COMPLETED")),
    )
    ref = models.CharField(max_length=20, unique=True, null=True)
    status = models.CharField(
        _("status"), max_length=220, default="new", choices=STATUS)
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)
    provision = models.ForeignKey(
        Provision, related_name='purchase_request', on_delete=models.CASCADE)
    is_approved = models.BooleanField(default=False)
    created_by = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name='purchase_created_by',)
    approved_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE,
                                    related_name='purchase_approved_by', null=True, blank=True, default=None)
    approved_on = models.DateTimeField(null=True, blank=True)

    __ref = None
    __original_status = None

    class Meta:
        ordering = ('id',)
        permissions = (
            ("approve_purchaserequest", "Can approve purchase request"),
        )

    @classmethod
    def from_db(cls, db, field_names, values):
        instance = super().from_db(db, field_names, values)
        instance.__original_status = instance.status
        instance.__ref = instance.ref
        return instance

    def save(self, *args, **kwargs):
        new = False
        if self.status == '9' and self.__original_status == '1':
            self.approved_on = datetime.datetime.now()
        if (self.status != '0') or (self.__original_status == '0' and self.__original_status != self.status):
            today = datetime.datetime.now()
            if self.__ref == "" or self.__ref == None:
                new = True
                if PurchaseRequest.objects.filter(~Q(ref=None)):
                    # self.id = Provision.objects.all().last().id + 1
                    last_ref = PurchaseRequest.objects.filter(
                        ~Q(ref=None)).order_by('ref').last().ref.split('/')[0]
                    last_ref_int = int(last_ref)
                    self.ref = str(last_ref_int+1).zfill(4) + \
                        '/' + str(today.year)
                else:
                    self.ref = str(1).zfill(4) + '/' + str(today.year)

            else:
                self.ref = self.__ref
        super(PurchaseRequest, self).save(*args, **kwargs)
        self.__original_status = self.status
        if new:
            self.created_on = self.updated_on
            try:
                super(PurchaseRequest, self).save(*args, **kwargs)
            except:
                pass


class PurchaseReqProductRel(models.Model):
    provisionProduct = models.ForeignKey(
        ProvisionProductRel, on_delete=models.CASCADE, default=0)
    purchaseRequest = models.ForeignKey(
        PurchaseRequest, related_name='purchaseReqProducts', on_delete=models.CASCADE)
    unit = models.ForeignKey(
        Unit, on_delete=models.CASCADE, null=True, blank=True)
    quantity = models.FloatField(null=True, blank=True)


class Supplier(models.Model):
    name = models.CharField(max_length=220)
    number = models.CharField(max_length=220, null=True)
    email = models.EmailField(null=True)
    register_number = models.CharField(max_length=220, null=True)
    address = models.CharField(max_length=220, null=True)
    city = models.CharField(max_length=20, null=True)
    state = models.CharField(max_length=20, null=True)
    code_postal = models.CharField(max_length=20, null=True)
    created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class PurchaseOrder(models.Model):
    STATUS = (
        ('1', _("NEW")),
        ('999', _("DELIVERED")),
    )
    ref = models.CharField(max_length=20, unique=True, null=True)
    status = models.CharField(
        _("status"), max_length=220, default="1", choices=STATUS)
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)
    purchaseRequest = models.ForeignKey(
        PurchaseRequest, on_delete=models.DO_NOTHING)
    supplier = models.ForeignKey(Supplier, on_delete=models.DO_NOTHING)
    created_by = models.ForeignKey(CustomUser, on_delete=models.DO_NOTHING)

    # def __str__(self):
    #     return self.ref

    def save(self, *args, **kwargs):
        today = datetime.datetime.now()
        if not self.pk:
            if PurchaseOrder.objects.filter(~Q(ref=None)):
                last_ref = PurchaseOrder.objects.filter(
                    ~Q(ref=None)).order_by('ref').last().ref.split('/')[0]
                last_ref_int = int(last_ref)
                self.ref = str(last_ref_int+1).zfill(4) + '/' + str(today.year)
            else:
                self.ref = str(1).zfill(4) + '/' + str(today.year)
        super(PurchaseOrder, self).save(*args, **kwargs)


class PurchaseOrderProductRel(models.Model):
    purchaseOrder = models.ForeignKey(
        PurchaseOrder, related_name='purchaseOrderProducts', on_delete=models.CASCADE)
    purchaseProduct = models.ForeignKey(
        PurchaseReqProductRel, on_delete=models.CASCADE, default=0)
    unitPrice = models.FloatField(null=True, blank=True)


class Receipt(models.Model):
    created_on = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    ref = models.CharField(max_length=20, unique=True, null=True)
    do = models.CharField(max_length=50, null=True, blank=True)
    invoice = models.CharField(max_length=50, null=True, blank=True)
    purchaseOrder = models.ForeignKey(
        PurchaseOrder, related_name='receipt', on_delete=models.CASCADE)

    class Meta:
        ordering = ('-created_on',)

    def save(self, *args, **kwargs):
        today = datetime.datetime.now()
        if not self.pk:
            if Receipt.objects.filter(~Q(ref=None)):
                last_ref = Receipt.objects.filter(~Q(ref=None)).order_by(
                    'ref').last().ref.split('/')[0]
                last_ref_int = int(last_ref)
                self.ref = str(last_ref_int+1).zfill(4) + '/' + str(today.year)
            else:
                self.ref = str(1).zfill(4) + '/' + str(today.year)
        super(Receipt, self).save(*args, **kwargs)


class ReceiptProductRel(models.Model):
    receipt = models.ForeignKey(
        Receipt, related_name='receiptProducts', on_delete=models.CASCADE)
    purchaseOrderProduct = models.ForeignKey(
        PurchaseOrderProductRel, related_name='received', on_delete=models.CASCADE, default=0)
    quantity_receipt = models.FloatField(null=True, blank=True)
    quantity_accepted = models.FloatField(null=True, blank=True)
    conformity = models.BooleanField(default=True, null=True, blank=True)
    note = models.TextField(null=True, blank=True)


def _upload_receipt_to(instance, filename):
    name, extension = os.path.splitext(filename)
    file = "{}_{}_{}".format(instance.receipt.ref.replace('/', '_'),
                             instance.created_on, extension)
    return "documents/{}/{}".format(instance.__class__.__name__, file)


class ReceiptDocument(models.Model):
    receipt = models.OneToOneField(
        Receipt, related_name='document', on_delete=models.CASCADE)
    created_on = models.DateTimeField(auto_now_add=True)
    file = models.FileField(
        upload_to=_upload_receipt_to)

    def delete(self, *args, **kwargs):
        self.file.delete()
        super(ReceiptDocument, self).delete(*args, **kwargs)


class ProformaInvoiceRequest(models.Model):
    STATUS = (
        ('1', _("NEW")),
        ('999', _("RECEIVED")),
    )

    ref = models.CharField(max_length=20, unique=True, null=True)
    status = models.CharField(
        _("status"), max_length=220, default="1", choices=STATUS)

    created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):

        if self.ref == None:
            today = datetime.datetime.now()
            if ProformaInvoiceRequest.objects.filter(~Q(ref=None)):
                last_ref = ProformaInvoiceRequest.objects.filter(
                    ~Q(ref=None)).order_by('ref').last().ref.split('/')[0]
                last_ref_int = int(last_ref)
                self.ref = str(last_ref_int+1).zfill(4) + '/' + str(today.year)
            else:
                self.ref = str(1).zfill(4) + '/' + str(today.year)

        super(ProformaInvoiceRequest, self).save(*args, **kwargs)


class ProformaInvoiceRequestProductRel(models.Model):
    proformaInvoiceRequest = models.ForeignKey(
        ProformaInvoiceRequest, related_name='products', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.FloatField()
    unit = models.ForeignKey(
        Unit, on_delete=models.CASCADE, null=True, blank=True,)


def user_directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/user_<id>/<filename>
    return 'documents/proforma_invoice/{0}'.format(filename)


class ProformaInvoice(models.Model):
    ref = models.CharField(max_length=20, unique=True, null=True)
    proformaRequest = models.ForeignKey(
        ProformaInvoiceRequest, related_name='proformaInvoice', on_delete=models.CASCADE)
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE)
    tax_including = models.BooleanField(default=True)
    tax_rate = models.FloatField(null=True)

    created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):

        if self.ref == None:
            today = datetime.datetime.now()
            if ProformaInvoice.objects.filter(~Q(ref=None)):
                last_ref = ProformaInvoice.objects.filter(
                    ~Q(ref=None)).order_by('ref').last().ref.split('/')[0]
                last_ref_int = int(last_ref)
                self.ref = str(last_ref_int+1).zfill(4) + '/' + str(today.year)
            else:
                self.ref = str(1).zfill(4) + '/' + str(today.year)

        super(ProformaInvoice, self).save(*args, **kwargs)


class ProformaInvoiceDocument(models.Model):
    proformaInvoice = models.OneToOneField(
        ProformaInvoice, related_name='document', on_delete=models.CASCADE)
    file = models.FileField(
        upload_to=user_directory_path, blank=True, null=True)

    def delete(self, *args, **kwargs):
        self.file.delete()
        super(ProformaInvoiceDocument, self).delete(*args, **kwargs)


class ProformaInvoiceProductRel(models.Model):
    proformaInvoice = models.ForeignKey(
        ProformaInvoice, related_name='products', on_delete=models.CASCADE)
    proformaInvoiceRequestProduct = models.ForeignKey(
        ProformaInvoiceRequestProductRel, on_delete=models.CASCADE)
    price = models.FloatField()
