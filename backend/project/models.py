from django.db import models

# Create your models here.


class Location(models.Model):
	name = models.CharField(max_length=225)
	city = models.CharField(max_length=20)
	state = models.CharField(max_length=20)
	codePostal = models.CharField(max_length=20)

	def __str__(self):
		return self.name