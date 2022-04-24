import jwt
from datetime import datetime, timedelta
from django.conf import settings
from user_control.models import CustomUser
from rest_framework.pagination import PageNumberPagination
import re
from django.db.models import Q


def get_access_token(payload, days):
	token = jwt.encode(
		{"exp": datetime.now() + timedelta(minutes=1), **payload} , 
		settings.SECRET_KEY,
		algorithm="HS256"
	)
	print('token=',token)
	return token

def decodeJWT(bearer):
	if not bearer:
		return None


	token = bearer[7:]

	# no need write key as parameter
	# for Pyjwt>2.00 the parameter algorithm become algorithms that require a list
	decoded = jwt.decode(
		token,
		settings.SECRET_KEY, 
		algorithms=['HS256'] 
	)

	if decoded:
		try:
			return CustomUser.objects.get(id=decoded['user_id'])
		except Exception:
			return None
