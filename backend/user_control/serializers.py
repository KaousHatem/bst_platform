from rest_framework import serializers
from .models import CustomUser, ROLE_CHOICES, UserActivities
from project.models import Location
from django.contrib.auth.models import Group


class GroupSerializer(serializers.ModelSerializer):    
    class Meta:
        model = Group
        fields = ('name','permissions',)

class ActivateSerializer(serializers.Serializer):
	is_active = serializers.BooleanField()
	
class CreateUserSerializer(serializers.Serializer):
	username = serializers.CharField()
	fullname = serializers.CharField()
	password = serializers.CharField(required=False, allow_blank=True)
	location = serializers.IntegerField()
	role = serializers.ChoiceField(ROLE_CHOICES)

class LoginSerializer(serializers.Serializer):
	username = serializers.CharField()
	password = serializers.CharField(required=False)
	is_new_user = serializers.BooleanField(default=False, required=False)

class UpdatePasswordSerializer(serializers.Serializer):
	user_id = serializers.CharField()
	password = serializers.CharField()

class CustomUserListSerializer(serializers.ModelSerializer):
	class Meta:
		model = CustomUser
		fields = [
				'fullname',
				'username'
				]

class CustomUserSerializer(serializers.ModelSerializer):
	groups = GroupSerializer(many=True)
	location = serializers.SlugRelatedField(queryset = Location.objects.all() ,slug_field='name')
	class Meta:
		model = CustomUser
		exclude = ("password", )

class UserActivitiesSerializer(serializers.ModelSerializer):

	class Meta:
		model = UserActivities
		fields = ("__all__")