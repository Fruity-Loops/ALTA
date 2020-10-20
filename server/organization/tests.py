import json
from django.test import TestCase
from django.test.client import Client as HttpClient
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient