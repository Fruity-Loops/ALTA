import os
import subprocess
from psutil import process_iter
from signal import SIGTERM
import time
import sys
import webbrowser
import platform
import docker


def kill_port():
    if platform.system() == "Windows":
        for proc in process_iter():
            for conns in proc.connections(kind='inet'):
                if conns.laddr.port == 8000:
                    proc.send_signal(SIGTERM)
    elif platform.system() == "Linux":
        os.system("fuser -k 8000/tcp")


def docker_available():
    try:
        subprocess.check_output(["docker", "-v"])
        print("docker is available on this system")
        return True
    except:
        print("Docker is not available on your system! the script will check if mongo is running locally (not in a "
              "docker container)")
        try:
            subprocess.check_output(["mongo", " -version"])
            return False
        except:
            print("Mongo is not running locally!")
            exit(1)


def start_mongo_container():
    print("starting mongo container")

    # make sure there is no mongo_test container
    subprocess.Popen(f'docker container stop mongo_test', shell=True).wait()
    subprocess.Popen(f'docker container rm mongo_test', shell=True).wait()

    # create the mongo_test container
    subprocess.Popen(f'docker run --name mongo_test --detach -p 27017:27017 mongo', shell=True).wait()

    # search the current running containers for a mongo instance
    filter_for_mongo = {"ancestor": "mongo"}
    mongo_container = docker_client.containers.list(filters=filter_for_mongo)

    # if mongo is not created, return an error
    if not mongo_container:
        print("was not able to start the mongo container instance.")
        exit(1)

    print("mongo_test container instance has started.")
    return


def run_django_server(python_interpreter):
    os.chdir(os.path.dirname(os.getcwd()))
    os.chdir("server")

    time.sleep(5)
    kill_port()
    os.system(f'{python_interpreter} manage.py flush --no-input --settings django_server.test_settings')
    os.system(f'{python_interpreter} manage.py makemigrations --settings django_server.test_settings')
    os.system(f'{python_interpreter} manage.py migrate --settings django_server.test_settings')
    os.system(
        f'{python_interpreter} manage.py loaddata ../script/performance_test/fixtures/organizations.json '
        f'../script/performance_test/fixtures/users.json '
        f'../script/performance_test/fixtures/items.json '
        f'../script/performance_test/fixtures/audits.json '
        f'../script/performance_test/fixtures/audit_templates.json '
        f'--settings django_server.test_settings')
    print('fixtures are loaded')
    subprocess.Popen(f'{python_interpreter} manage.py runserver 127.0.0.1:8000 '
                     f'--settings django_server.test_settings', shell=True)


def apply_performance_test(test_type):
    os.chdir(os.path.dirname(os.getcwd()))
    os.chdir("script/performance_test")
    subprocess.Popen(
        f"locust --config {test_type}_testing.conf",
        shell=True).wait()
    kill_port()
    return


def clean_database():
    if docker_available():
        subprocess.Popen(f'docker container stop mongo_test', shell=True).wait()
        subprocess.Popen(f'docker container rm mongo_test').wait()
        print("mongo_test container has been removed.")
    else:
        print("delete dbs from local mongo")
    return


def get_python_interpreter():
    try:
        subprocess.check_output(["python3", "--version"])
        # if no error was raised modify
        return "python3"
    except:
        print("Attempting to replace with regular python interpreter")
        try:
            subprocess.check_output(["python", "--version"])
            return "python"
        except:
            print("No valid python interpreter is accessible through cli")
            exit(1)


if __name__ == "__main__":

    test_types = ['load', 'soak', 'stress']
    test_type = sys.argv[1].lower()

    if test_type not in test_types:
        raise Exception("please provide a valid performance test type as the first argument")

    clean_database()

    if docker_available():

        # create a docker client using the docker sdk library
        docker_client = docker.from_env()

        # search the current running container for a mongo instance
        filter_for_mongo = {"ancestor": "mongo"}
        mongo_container = docker_client.containers.list(filters=filter_for_mongo)

        # if no container is running mongo, we will create one
        if not mongo_container:
            start_mongo_container()
        else:
            print(f"A mongo container instance is already running. The container id is {mongo_container[0]}."
                  f" Please stop that container before you run this again.")
            exit(1)

    python_interpreter = get_python_interpreter()
    run_django_server(python_interpreter)
    apply_performance_test(test_type)
    clean_database()
