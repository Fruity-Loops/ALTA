from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.jobstores.mongodb import MongoDBJobStore
from apscheduler.events import EVENT_JOB_EXECUTED, EVENT_JOB_ERROR
import pymongo as pym
from django_server.load_csv_to_db import main


class Singleton(type):
    """
    A metaclass that ensures the singleton restriction
    """
    _instances = {}

    def __call__(self, *args, **kwargs):
        if self not in self._instances:
            self._instances[self] = super(Singleton, self).__call__(*args, **kwargs)
        return self._instances[self]


class Scheduler(metaclass=Singleton):
    """
    Creates an object that holds the scheduler
    """

    def __init__(self, db_host, db_name):
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


scheduler = Scheduler("mongodb://localhost:27017/", "alta_development").scheduler


def start():
    """
    starts the scheduler
    all the jobs that are stored in the jobs
    collection will be retrieved
    """
    scheduler.start()
    print_all_job()


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
        print('The job crashed :(')
    else:
        print('The job worked :)')


def start_new_job(job_id, time):
    scheduler.add_job(main, 'interval', minutes=time, id=job_id,
                      args=(job_id,), replace_existing=True)
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


scheduler.add_listener(scheduler_listener, EVENT_JOB_EXECUTED | EVENT_JOB_ERROR)

# TODO find a way to delete all the jobs created during testing phase
