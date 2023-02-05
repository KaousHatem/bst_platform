from django.db import models
from django.utils.translation import gettext_lazy as _
from user_control.models import CustomUser
# Create your models here.



class CommonInfo(models.Model):
	created_on = models.DateTimeField(auto_now_add=True)
	updated_on = models.DateTimeField(auto_now=True)
	created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE)

	class Meta:
		abstract = True

class Payment(CommonInfo):
	TARGET = (
		('0', _("SUPPLIER")),
		('1', _("CONTRACTOR")),
		('2', _("EMPLOYEE")),
	)

	TYPE = (
		('0', _("CASH")),
		('1', _("CHEQUE")),
		('2', _("WIRE")),
	)
	amount = models.FloatField(null=True)
	payment_target = models.CharField(_("target"),max_length=22,choices=TARGET)
	ref_target = models.IntegerField(null=True, blank=True)

	payment_type = models.CharField(_("type"),max_length=22,choices=TYPE)
	payment_detail = models.IntegerField(null=True, blank=True)

class Cheque(CommonInfo):
	ref = models.IntegerField(null=True, blank=True)
	bank = models.CharField(max_length=22)

