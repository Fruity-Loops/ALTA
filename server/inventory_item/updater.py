from apscheduler.schedulers.background import BackgroundScheduler
from django_server.load_csv_to_db import main

# This will get you a BackgroundScheduler with a MemoryJobStore named “default”
# and a ThreadPoolExecutor named “default” with a default maximum thread count of 10.
scheduler = BackgroundScheduler()


def start():
    scheduler.start()
    print_all_job()


def start_new_job(job_id, time):
    scheduler.add_job(main, 'interval', minutes=time, id=job_id, args=(job_id,))
    print_all_job()
    get_specific_job(job_id)


def print_all_job():
    print("#############")
    scheduler.print_jobs()
    print("#############")


def get_specific_job(id):
    job = scheduler.get_job(id)
    print("#############")
    print("###" + str(id) + "### " + str(job))
    print("#############")
