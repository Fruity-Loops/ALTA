import logging
import logging.config
import os
import copy
import sys
from urllib.parse import urlencode
from rest_framework import viewsets
import colorlog

messages = []


class LoggingViewset(viewsets.ModelViewSet):
    logger_is_initialized = True
    logger = None
    test_mode = False
    request = {}

    def set_request_data(self, request):
        if request.data:
            LoggingViewset.request = copy.deepcopy(request.data)
        else:
            LoggingViewset.request = {}

    def dispatch(self, request, *args, **kwargs):
        custom_logging = os.getenv('CUSTOM_LOGGING', 'False')
        if len(sys.argv) > 1 and sys.argv[1] == 'test':
            self.test_mode = True
        if custom_logging in ['True', 'TRUE', 'true'] and not self.test_mode:
            response = super().dispatch(request, *args, **kwargs)
            req = LoggingViewset.request
            method = copy.deepcopy(request.method)
            url = copy.deepcopy(request.path_info) + '' + urlencode(query=request.GET)

            status = response.status_code
            if LoggingViewset.logger_is_initialized:
                initialize_logger()
                LoggingViewset.logger_is_initialized = False
            req_and_res = {'request': req, 'response': response.data}
            logger = logging.LoggerAdapter(LoggingViewset.logger, req_and_res)
            message = str(status) + '\t  ' + method + ' ' + url
            if 200 <= status < 400:
                logger.info(message)
            if 400 <= status < 500:
                logger.warning(message)
            if status == 500:
                logger.error(message)
            return self.response
        return super().dispatch(request, *args, **kwargs)


def initialize_logger():
    LoggingViewset.logger = logging.getLogger(__name__)
    syslog = logging.StreamHandler()
    format_str = '[%(log_color)s%(asctime)s]\t  %(message)s %(reset)s' \
                 '\nrequest: %(request)s\nresponse:%(response)s'
    cformat = '%(log_color)s' + format_str
    log_colors = {
        'DEBUG': 'white',
        'INFO': 'green',
        'WARNING': 'yellow',
        'ERROR': 'red',
        'CRITICAL': 'purple'
    }
    formatter = colorlog.ColoredFormatter(cformat, log_colors=log_colors)
    formatter.datefmt = '%d/%b/%Y %H:%M:%S'
    syslog.setFormatter(formatter)
    LoggingViewset.logger.setLevel(os.getenv('CUSTOM_LOGGING_LEVEL', 'DEBUG'))
    LoggingViewset.logger.addHandler(syslog)


class OffFilter(logging.Filter):  # pylint: disable=too-few-public-methods

    def filter(self, record):
        return False
