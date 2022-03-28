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



class Product(models.Model):
	sku = models.CharField(max_length=20, unique=True)
	name = models.CharField(max_length=220)
	description = models.CharField(max_length=220, null=True, blank=True,)
	status = models.BooleanField(default=True)
	unit = models.CharField(max_length=50)
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
	created_on = models.DateField(auto_now_add=True)
	updated_on = models.DateField(auto_now=True)
	approved_on = models.DateField(auto_now_add=True)

	__original_status = None
	__ref = None

	class Meta:
		ordering = ('id',)

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
			print('save',self.__ref)
			print('save',self.ref)
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
	unit = models.CharField(max_length=50)
	quantity = models.IntegerField()


class PurchaseRequest(models.Model):
	status = models.CharField(max_length=220)
	created_on = models.DateTimeField(auto_now_add=True)
	updated_on = models.DateTimeField(auto_now=True)
	provision = models.ForeignKey(Provision, on_delete=models.CASCADE)
	is_approved = models.BooleanField(default=False)
	created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE,related_name='purchase_created_by',)
	approved_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE,related_name='purchase_approved_by', null=True, blank=True, default=None)

class PurchaseReqProductRel(models.Model):
	product = models.ForeignKey(Product, on_delete=models.CASCADE)
	purchaseRequest = models.ForeignKey(PurchaseRequest, on_delete=models.CASCADE)
	unit = models.CharField(max_length=50)
	quantity = models.IntegerField()

class Supplier(models.Model):
	name = models.CharField(max_length=220)
	number = models.CharField(max_length=220,null=True)
	email = models.EmailField(null=True)
	created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE)


class PurchaseOrder(models.Model):
	status = models.CharField(max_length=220)
	created_on = models.DateTimeField(auto_now_add=True)
	updated_on = models.DateTimeField(auto_now=True)
	purchaseRequest = models.ForeignKey(PurchaseRequest, on_delete=models.CASCADE)
	supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE)
	created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE)


class Receipt(models.Model):
	created_on = models.DateTimeField(auto_now_add=True)
	created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
	purchaseOrder = models.ForeignKey(PurchaseOrder, on_delete=models.CASCADE)


