from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils import timezone
from django.db import models
from django.contrib.auth.models import UserManager


class CustomUserManager(UserManager):
    def _create_user(self, Matricule, first_name, last_name, password, **extra_fields):
        if not Matricule:
            raise ValueError("You must provide a Matricule")
        user = self.model(Matricule=Matricule, first_name=first_name, last_name=last_name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, Matricule=None, first_name=None, last_name=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(Matricule, first_name, last_name, password, **extra_fields)

    def create_superuser(self, Matricule=None, first_name=None, last_name=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self._create_user(Matricule, first_name, last_name, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    Matricule = models.CharField(max_length=100, primary_key=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    password = models.CharField(max_length=128)

    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(default=timezone.now)
    last_login = models.DateTimeField(blank=True, null=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'Matricule'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def __str__(self):
        return self.Matricule

    @property
    def id(self):
        return self.Matricule

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"
