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


class Product(models.Model):
	sku = models.CharField(max_length=20, unique=True)
	name = models.CharField(max_length=220)
	description = models.CharField(max_length=220, null=True, blank=True,)
	status = models.BooleanField(default=True)
	base_unit = models.ForeignKey(Unit, on_delete=models.CASCADE,null=True, blank=True,)
	category = models.ForeignKey(Category, on_delete=models.CASCADE)
	created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
	created_on = models.DateTimeField(auto_now_add=True)
	updated_on = models.DateTimeField(auto_now=True)

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
	product = models.ForeignKey(Product, related_name='unit_conversions', on_delete=models.CASCADE)
	base_unit = models.ForeignKey(Unit, on_delete=models.CASCADE,related_name='unit_conversion_base_unit')
	to_unit = models.ForeignKey(Unit, on_delete=models.CASCADE,related_name='unit_conversion_to_unit')
	multiplier = models.FloatField()




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
	created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE,related_name='provision_created_by',)
	approved_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE,related_name='provision_approved_by', null=True, blank=True, default=None)
	status = models.CharField(_("status"),max_length=220, default="new",choices=STATUS)
	delay = models.DateField()
	created_on = models.DateTimeField(auto_now_add=True)
	updated_on = models.DateTimeField(auto_now=True)
	approved_on = models.DateTimeField(null=True, blank=True)

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
		if self.status == '9' and self.__original_status=='1':
			self.approved_on=datetime.datetime.now()

		if (self.status != '0') or (self.__original_status == '0' and self.__original_status != self.status):
			today = datetime.datetime.now()
			if self.__ref == "" or self.__ref == None:
				self.created_on = self.updated_on
				if Provision.objects.filter(~Q(ref=None)):
					# self.id = Provision.objects.all().last().id + 1
					last_ref = Provision.objects.filter(~Q(ref=None)).order_by('ref').last().ref.split('/')[0]
					last_ref_int = int(last_ref)
					self.ref = str(last_ref_int+1).zfill(4) + '/' + str(today.year)
				else:
					self.ref = str(1).zfill(4) + '/' + str(today.year)
				
			else:
				self.ref = self.__ref
		super(Provision, self).save(*args, **kwargs)
		self.__original_status = self.status


	


class ProvisionProductRel(models.Model):
	product = models.ForeignKey(Product, on_delete=models.CASCADE)
	provision = models.ForeignKey(Provision, related_name='provisionProducts' , on_delete=models.CASCADE)
	
	# change unit from charField for ForeignKey
	unit = models.ForeignKey(Unit, on_delete=models.CASCADE,null=True, blank=True,)
	quantity = models.IntegerField()


class PurchaseRequest(models.Model):
	STATUS = (
		('0', _("DRAFT")),
		('1', _("NEW")),
		('4', _("DROP")),
		('9', _("APPROVED")),
	)
	ref = models.CharField(max_length=20, unique=True, null=True)
	status = models.CharField(_("status"),max_length=220, default="new",choices=STATUS)
	created_on = models.DateTimeField(auto_now_add=True)
	updated_on = models.DateTimeField(auto_now=True)
	provision = models.ForeignKey(Provision, on_delete=models.CASCADE)
	is_approved = models.BooleanField(default=False)
	created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE,related_name='purchase_created_by',)
	approved_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE,related_name='purchase_approved_by', null=True, blank=True, default=None)
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
		if self.status == '9' and self.__original_status=='1':
			self.approved_on=datetime.datetime.now()
		if (self.status != '0') or (self.__original_status == '0' and self.__original_status != self.status):
			today = datetime.datetime.now()
			if self.__ref == "" or self.__ref == None:
				new = True
				if PurchaseRequest.objects.filter(~Q(ref=None)):
					# self.id = Provision.objects.all().last().id + 1
					last_ref = PurchaseRequest.objects.filter(~Q(ref=None)).order_by('ref').last().ref.split('/')[0]
					last_ref_int = int(last_ref)
					self.ref = str(last_ref_int+1).zfill(4) + '/' + str(today.year)
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
	provisionProduct = models.ForeignKey(ProvisionProductRel, on_delete=models.CASCADE, default=0)
	purchaseRequest = models.ForeignKey(PurchaseRequest,related_name='purchaseReqProducts' , on_delete=models.CASCADE)
	unit = models.ForeignKey(Unit, on_delete=models.CASCADE,null=True, blank=True)
	quantity = models.IntegerField(null=True, blank=True)



class Supplier(models.Model):
	name = models.CharField(max_length=220)
	number = models.CharField(max_length=220,null=True)
	email = models.EmailField(null=True)
	register_number = models.CharField(max_length=220, null=True)
	address = models.CharField(max_length=220, null=True)
	city = models.CharField(max_length=20, null=True)
	state = models.CharField(max_length=20, null=True)
	code_postal = models.CharField(max_length=20, null=True)
	created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE)


class PurchaseOrder(models.Model):
	STATUS = (
		('1', _("NEW")),
		('999', _("DELIVERED")),
	)
	ref = models.CharField(max_length=20, unique=True, null=True)
	status = models.CharField(_("status"),max_length=220, default="1",choices=STATUS)
	created_on = models.DateTimeField(auto_now_add=True)
	updated_on = models.DateTimeField(auto_now=True)
	purchaseRequest = models.ForeignKey(PurchaseRequest, on_delete=models.CASCADE)
	supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE)
	created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE)

	def save(self, *args, **kwargs):
		today = datetime.datetime.now()
		if PurchaseOrder.objects.filter(~Q(ref=None)):
			last_ref = PurchaseOrder.objects.filter(~Q(ref=None)).order_by('ref').last().ref.split('/')[0]
			last_ref_int = int(last_ref)
			self.ref = str(last_ref_int+1).zfill(4) + '/' + str(today.year)
		else:
			self.ref = str(1).zfill(4) + '/' + str(today.year)
		super(PurchaseOrder, self).save(*args, **kwargs)
		

class PurchaseOrderProductRel(models.Model):
	purchaseOrder = models.ForeignKey(PurchaseOrder,related_name='purchaseOrderProducts' , on_delete=models.CASCADE)
	purchaseProduct = models.ForeignKey(PurchaseReqProductRel, on_delete=models.CASCADE, default=0)
	unitPrice = models.FloatField(null=True, blank=True)


class Receipt(models.Model):
	created_on = models.DateTimeField(auto_now_add=True)
	created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
	purchaseOrder = models.ForeignKey(PurchaseOrder, related_name='receipt' ,on_delete=models.CASCADE)


