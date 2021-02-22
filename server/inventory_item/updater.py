import datetime
import logging
import pytz
import pymongo as pym
from apscheduler.events import EVENT_JOB_EXECUTED, EVENT_JOB_ERROR
from apscheduler.jobstores.mongodb import MongoDBJobStore
from apscheduler.schedulers.background import BackgroundScheduler
from audit.utils import create_audit
from audit_template.models import AuditTemplate
from django_server.load_csv_to_db import main
import sys

logger = logging.getLogger(__name__)

class Singleton(type):  # pylint: disable=too-few-public-methods
    """
    A metaclass that ensures the singleton restriction
    """
    _instances = {}

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super(Singleton, cls).__call__(*args, **kwargs)
        return cls._instances[cls]


def scheduler_listener(event):
    """
    :paramScheduler events
    are fired on certain occasions, and may carry additional information
    in them concerning the details of that particular event. It is possible
    to listen to only particular types of events by giving the appropriate mask argument
    to add_listener(), OR’ing the different constants together. The listener callable is
    called with one argument, the event object.
    """
    if event.exception:
        logger.error('The job crashed :(')
    else:
        logger.debug('The job worked :)')

# pylint: disable=too-few-public-methods
class Scheduler(metaclass=Singleton):
    """
    Creates an object that holds the scheduler
    """

    def __init__(self):
        db_host = "mongodb://localhost:27017/"
        db_name = "alta_development"

        # Making connection to mongoclient
        client = pym.MongoClient(db_host)

        job_stores = {
            'default': MongoDBJobStore(database=db_name,
                                       collection="jobs", client=client)
        }

        # This will get you a BackgroundScheduler with a MongoDBJobStore
        # named “default” to replace the default one  and a ThreadPoolExecutor
        # named “default” with a default maximum thread count of 10.
        self.scheduler = BackgroundScheduler(jobstores=job_stores)
        self.scheduler.add_listener(scheduler_listener, EVENT_JOB_EXECUTED | EVENT_JOB_ERROR)


scheduler = Scheduler().scheduler


def start():
    """
    starts the scheduler
    all the jobs that are stored in the jobs
    collection will be retrieved
    """
    if len(sys.argv) > 1 and sys.argv[1] != "runserver":
        return
    scheduler.start()
    print_all_job()


def start_new_job(job_id, time):
    # Each Job will trigger the function main(job_id) at specific interval
    scheduler.add_job(main, 'interval', minutes=time, id=job_id,
                      args=(job_id,), replace_existing=True)
    print_all_job()
    get_specific_job(job_id)


def start_new_cron_job(template_id, date, time_zone):
    job_id = "template_" + str(template_id)
    template = AuditTemplate.objects.get(template_id=template_id)
    kwargs = get_job_queries(template.repeat_every,
                             template.on_day, template.for_month)

    # Each Job will trigger the function create_audit(template_id) at specific interval
    scheduler.add_job(create_audit, 'cron', start_date=datetime_with_offset(date, time_zone),
                      **kwargs, hour=7, id=job_id, args=(template_id,), replace_existing=True)
    print_all_job()
    get_specific_job(job_id)


def start_new_job_once_at_specific_date(template_id, date, time_zone):
    job_id = "template_" + str(template_id)
    scheduler.add_job(create_audit, 'date', run_date=datetime_with_offset(date, time_zone),
                      id=job_id, args=(template_id,), replace_existing=True)
    print_all_job()
    get_specific_job(job_id)


def print_all_job():
    logger.debug("######ALL JOBS#######")
    logger.debug(scheduler.get_jobs())
    logger.debug("#####################")


def get_specific_job(job_id):
    job = scheduler.get_job(job_id)
    logger.debug('#############\n###%d###%s\n#############', job_id, str(job))


def get_job_queries(repetition, day_of_week, months):
    week_query = ''
    for day in day_of_week:
        if repetition == 'all':
            week_query += day + ','
        else:
            if repetition == '1':
                week_query += '1st ' + day + ','
            elif repetition == '2':
                week_query += '2nd ' + day + ','
            elif repetition == '3':
                week_query += '3rd ' + day + ','
            elif repetition == 'last':
                week_query += '4th ' + day + ','

    month_query = ''
    for month in months:
        month_query += month + ','

    kwargs = {}
    if repetition == 'all':
        kwargs['day_of_week'] = week_query[:-1]
    else:
        kwargs['day'] = week_query[:-1]

    kwargs['month'] = month_query[:-1]

    return kwargs


def datetime_with_offset(date, time_zone):
    # Using current time to grab time zone offset for utc so DST can be taken into consideration
    time_zone_offset = datetime.datetime.now(pytz.timezone(time_zone)).strftime('%z')
    date = date + time_zone_offset
    # adding colon in the offset e.g. +0500 becomes +05:00
    date = "{0}:{1}".format(
        date[:-2],
        date[-2:]
    )
    return date
