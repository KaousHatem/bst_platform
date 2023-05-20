from rest_framework import serializers


from ..models import (
    Store,
)

from project.models import Location
from user_control.serializers import CustomUserListSerializer


class StoreListSerializer(serializers.ModelSerializer):
    created_by = CustomUserListSerializer(read_only=True, required=False)
    store_manager = CustomUserListSerializer(read_only=True, required=False)
    location = serializers.SlugRelatedField(
        queryset=Location.objects.all(), slug_field='name')

    class Meta:
        model = Store
        fields = [
            'id',
            'name',
            'location',
            'store_manager',
            'products',
            '_open',
            'created_by',
            'created_on',
            'updated_on',
        ]

    def to_representation(self, instance):
        reps = super().to_representation(instance)
        reps['products'] = instance.products.all().count()
        return reps


class StoreSerializer(serializers.ModelSerializer):

    class Meta:
        model = Store
        fields = [
            'id',
            'name',
            'location',
            'store_manager',
            '_open',
            'created_by',
            'created_on',
            'updated_on',
        ]

        extra_kwargs = {
            '_open': {
                'required': False,
                'read_only': True,
            }
        }
