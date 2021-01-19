from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.jobstores.mongodb import MongoDBJobStore
from apscheduler.events import EVENT_JOB_EXECUTED, EVENT_JOB_ERROR
import pymongo as pym
from django_server.load_csv_to_db import main
from audit.utils import create_audit
from audit_template.models import AuditTemplate


class Singleton(type):
    """
    A metaclass that ensures the singleton restriction
    """
    _instances = {}

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super(Singleton, cls).__call__(*args, **kwargs)
        return cls._instances[cls]


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
        self.scheduler.add_listener(self.scheduler_listener, EVENT_JOB_EXECUTED | EVENT_JOB_ERROR)

    def scheduler_listener(self, event):
        """
        :paramScheduler events
        are fired on certain occasions, and may carry additional information
        in them concerning the details of that particular event. It is possible
        to listen to only particular types of events by giving the appropriate mask argument
        to add_listener(), OR’ing the different constants together. The listener callable is
        called with one argument, the event object.
        """
        if event.exception:
            print('The job crashed :(')
        else:
            print('The job worked :)')


scheduler = Scheduler().scheduler


def start():
    """
    starts the scheduler
    all the jobs that are stored in the jobs
    collection will be retrieved
    """
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
    scheduler.add_job(create_audit, 'cron', start_date=date,
                      timezone=time_zone, **kwargs, hour=7,
                      id=job_id, args=(template_id,), replace_existing=True)
    print_all_job()
    get_specific_job(job_id)


def start_new_job_once_at_specific_date(template_id, date, time_zone):
    job_id = "template_" + str(template_id)
    scheduler.add_job(create_audit, 'date', run_date=date,
                      timezone=time_zone, id=job_id,
                      args=(template_id,), replace_existing=True)
    print_all_job()
    get_specific_job(job_id)


def print_all_job():
    print("######ALL JOBS#######")
    scheduler.print_jobs()
    print("#####################")


def get_specific_job(job_id):
    job = scheduler.get_job(job_id)
    print("#############")
    print("###" + str(job_id) + "### " + str(job))
    print("#############")


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
    for m in months:
        month_query += m + ','

    kwargs = {}
    if repetition == 'all':
        kwargs['day_of_week'] = week_query[:-1]
    else:
        kwargs['day'] = week_query[:-1]

    kwargs['month'] = month_query[:-1]

    return kwargs
