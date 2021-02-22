"""
This file provides functionality for all the endpoints for interacting with user accounts
"""
import os
import logging
import secrets
import string
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from django.contrib.auth.hashers import check_password
from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpRequest
from rest_framework import status, generics
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from user_account.serializers import CustomUserSerializer
from user_account.models import CustomUser
from user_account.views import CustomUserView

logger = logging.getLogger(__name__)
login_failed = {"detail": "Login Failed"}


class LoginView(generics.GenericAPIView):
    """
    Authenticate a System Admin.
    """

    def get_serializer(self, *args, **kwargs):
        serializer_class = CustomUserSerializer
        serializer_class.Meta.fields = ['email', 'password']
        return serializer_class(*args, **kwargs)

    def post(self, request):
        """
        Verify that a System Admin has valid credentials and is active.
        :param request: request.data: email, password
        :return: user_name, token
        """
        data = request.data
        email = data.get('email', '')
        password = data.get('password', '')
        org_id = ""
        org_name = ""
        response = Response(login_failed, status=status.HTTP_401_UNAUTHORIZED)

        try:
            user = CustomUser.objects.get(email=email)

            is_verified = check_password(password, user.password)
            if is_verified and user.is_active:
                has_token = Token.objects.filter(user=user).count()
                if has_token:
                    token = Token.objects.get(user=user)
                else:
                    token = Token.objects.create(user=user)
                if user.organization:
                    org_id = user.organization.org_id
                    org_name = user.organization.org_name
                data = {'user': user.user_name, 'user_id': user.id, 'role': user.role,
                        'organization_id': org_id,
                        'organization_name': org_name,
                        'token': token.key}

                response = Response(data, status=status.HTTP_200_OK)

        except ObjectDoesNotExist:
            pass

        return response


class LoginMobileEmailView(generics.GenericAPIView):
    """
    Authenticate a Mobile Log in.
    """
    serializer_class = CustomUserSerializer

    def post(self, request):
        data = request.data
        receiver_email = data.get('email', '')
        response = Response(login_failed, status=status.HTTP_401_UNAUTHORIZED)

        try:
            user = CustomUser.objects.get(email=receiver_email)
            if user.is_active:
                org_id = user.organization.org_id
                org_name = user.organization.org_name
                data = {'user': user.user_name, 'user_id': user.id, 'role': user.role,
                        'organization_id': org_id,
                        'organization_name': org_name}

                # Update the Password as the new PIN and send an email
                pin = save_new_pin(receiver_email, user)
                sender_email = os.getenv('SENDER_EMAIL', 'email@email.com')
                sender_password = os.getenv('SENDER_PASSWORD', 'pass1234')
                send_email(
                    sender_email,
                    sender_password,
                    receiver_email,
                    pin)
                response = Response(data, status=status.HTTP_200_OK)

        except ObjectDoesNotExist as exception:
            logger.error(exception)

        return response


def save_new_pin(email, user):
    first_part = ''.join(secrets.choice(string.ascii_letters + string.digits)
                         for _i in range(3)) #NOSONAR
    second_part = '-'
    third_part = ''.join(secrets.choice(string.ascii_letters + string.digits)
                         for _i in range(3)) #NOSONAR
    request = HttpRequest()
    request.data = {'password': first_part + second_part + third_part}
    request.user = email
    kwargs = {'partial': True, 'pk': user.id}
    custom_user_view = CustomUserView()
    custom_user_view.kwargs = kwargs
    custom_user_view.request = request
    custom_user_view.action = 'partial_update'
    custom_user_view.data = request.data
    custom_user_view.update(request=request, **kwargs)
    return request.data['password']


def send_email(sender, sender_password, receiver, pin):
    msg = MIMEMultipart('alternative')
    msg['Subject'] = 'ALTA Pin'
    msg['From'] = sender
    msg['To'] = receiver

    text = "Pin: " + pin
    html = """\
    <html>
      <head></head>
      <body>
        <p>Your Pin is: """ + pin + """</p>
      </body>
    </html>
    """

    # Record the MIME types of both parts - text/plain and text/html.
    part1 = MIMEText(text, 'plain')
    part2 = MIMEText(html, 'html')

    # Attach parts into message container.
    # According to RFC 2046, the last part of a multipart message, in this case
    # the HTML message, is best and preferred.
    msg.attach(part1)
    msg.attach(part2)

    # Send the message via local SMTP server.
    try:
        mailserver = smtplib.SMTP('smtp.gmail.com', 587)
        # identify ourselves to smtp gmail client
        mailserver.ehlo()
        # secure our email with tls encryption
        mailserver.starttls()
        # re-identify ourselves as an encrypted connection
        mailserver.ehlo()
        mailserver.login(sender, sender_password)
        mailserver.sendmail(sender, receiver, msg.as_string())
        mailserver.quit()
    except smtplib.SMTPException as exception:
        logger.error(exception)


class LoginMobilePinView(generics.GenericAPIView):
    """
    Authenticate a System Admin.
    """

    def get_serializer(self, *args, **kwargs):
        serializer_class = CustomUserSerializer
        serializer_class.Meta.fields = ['email', 'password']
        return serializer_class(*args, **kwargs)

    def post(self, request):
        """
        Verify that a System Admin has valid credentials and is active.
        :param request: request.data: email, password
        :return: user_name, token
        """
        data = request.data
        email = data.get('email', '')
        password = data.get('pin', '')
        response = Response(login_failed, status=status.HTTP_401_UNAUTHORIZED)

        try:
            user = CustomUser.objects.get(email=email)

            is_verified = check_password(password, user.password)
            if is_verified and user.is_active:
                has_token = Token.objects.filter(user=user).count()
                if has_token:
                    token = Token.objects.get(user=user)
                else:
                    token = Token.objects.create(user=user)
                data = {'token': token.key}

                response = Response(data, status=status.HTTP_200_OK)

        except ObjectDoesNotExist:
            return response

        return response


class LogoutView(generics.GenericAPIView):
    """
    Logout a System Admin.
    """

    def post(self, request):
        """
        :param request: request.user (token)
        """
        return self.remove_token(request)

    def remove_token(self, request):  # pylint: disable=no-self-use
        """
        Deleting user token from the database when he logout.
        :param request
        """

        Token.objects.get(user=request.user).delete()

        return Response({"success": "Successfully logged out."},
                        status=status.HTTP_200_OK)
