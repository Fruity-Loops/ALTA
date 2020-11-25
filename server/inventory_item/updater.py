from apscheduler.schedulers.background import BackgroundScheduler
from django_server.load_csv_to_db import main


def start():
    scheduler = BackgroundScheduler()
    scheduler.add_job(main, 'interval', minutes=1)
    scheduler.start()
