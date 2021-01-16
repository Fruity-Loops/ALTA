#!/usr/bin/python

import os
import subprocess
from psutil import process_iter
from signal import SIGTERM
import time
import sys
import webbrowser
import platform

python_interpreter = ""

try:
    subprocess.check_output(["python3", "--version"])
    # if no error was raised modify 
    python_interpreter = "python3"
except:
    print("Attempting to replace with regular python interpreter")
    try:
        subprocess.check_output(["python", "--version"])
        python_interpreter = "python"
    except:
        print("No valid python interpreter is accessible through cli")
        exit(1)


def execute(back, front, e2e, lint, load):
    os.chdir(os.path.dirname(os.getcwd()))

    if back:
        os.chdir("server")
        print(
            "\n\n\n**************************************************\n\n\n"
            "Backend tests and coverage will now be calculated"
            "\n\n\n**************************************************\n\n\n")
        time.sleep(5)
        os.system("coverage run -m --branch pytest")
        os.system("coverage html")
        time.sleep(5)
        webbrowser.open('file://' + os.path.realpath("htmlcov/index.html"))
        os.chdir(os.path.dirname(os.getcwd()))
    if front:
        os.chdir("client")

        print(
            "\n\n\n**************************************************\n\n\n"
            "Frontend tests and coverage will now be calculated"
            "\n\n\n**************************************************\n\n\n")
        time.sleep(5)
        os.system("ng test --no-watch --code-coverage")
        time.sleep(5)
        webbrowser.open('file://' + os.path.realpath("coverage/alta-front/index.html"))
        os.chdir(os.path.dirname(os.getcwd()))
    if e2e:
        os.chdir("server")
        print(
            "\n\n\n**************************************************\n\n\n"
            "E2E test will now run"
            "\n\n\n**************************************************\n\n\n")
        time.sleep(5)
        kill_port()
        os.system(f'{python_interpreter} manage.py flush --no-input --settings django_server.test_settings')
        os.system(f'{python_interpreter} manage.py makemigrations --settings django_server.test_settings')
        os.system(f'{python_interpreter} manage.py migrate --settings django_server.test_settings')
        os.system(f'{python_interpreter} manage.py loaddata users.json organizations.json items.json audit_template.json --settings django_server.test_settings')
        subprocess.Popen(f'{python_interpreter} manage.py runserver 127.0.0.1:8000 '
                         f'--settings django_server.test_settings', shell=True)
        os.chdir(os.path.dirname(os.getcwd()))
        os.chdir("client")
        p1 = subprocess.Popen("ng e2e", shell=True)
        p1.wait()
        kill_port()
        os.chdir(os.path.dirname(os.getcwd()))
        time.sleep(5)
    if load:
        os.chdir("server")
        print(
            "\n\n\n**************************************************\n\n\n"
            "load tests will now run"
            "\n\n\n**************************************************\n\n\n")
        time.sleep(5)
        kill_port()
        os.system(f'{python_interpreter} manage.py flush --no-input --settings django_server.test_settings')
        os.system(f'{python_interpreter} manage.py makemigrations --settings django_server.test_settings')
        os.system(f'{python_interpreter} manage.py migrate --settings django_server.test_settings')
        os.system(f'{python_interpreter} manage.py loaddata users.json organizations.json items.json audit_template.json --settings django_server.test_settings')
        subprocess.Popen(f'{python_interpreter} manage.py runserver 127.0.0.1:8000 '
                         f'--settings django_server.test_settings', shell=True)
        os.chdir(os.path.dirname(os.getcwd()))
        os.chdir("server/performance_test")
        # os.system(f'{python_interpreter} -mwebbrowser 127.0.0.1:8089')
        p1 = subprocess.Popen("locust --config=load_testing.conf", shell=True)
        p1.wait()
        kill_port()
        os.chdir(os.path.dirname(os.getcwd()))
        time.sleep(5)
    if lint:
        os.chdir("server")
        print(
            "\n\n\n**************************************************\n\n\n"
            "Backend linter test will now run"
            "\n\n\n**************************************************\n\n\n")
        time.sleep(5)
        with open('__init__.py', 'w'):
            pass
        os.system("pylint server")
        os.remove("__init__.py")
        time.sleep(5)
        print(
            "\n\n\n**************************************************\n\n\n"
            "Frontend linter test will now run"
            "\n\n\n**************************************************\n\n\n")
        time.sleep(5)
        os.chdir(os.path.dirname(os.getcwd()))
        os.chdir("client")
        os.system("ng lint")
        os.chdir(os.path.dirname(os.getcwd()))
        time.sleep(5)

    print(
        "\n\n\n**************************************************\n\n\n"
        "SCRIPT HAS SUCCESSFULLY TERMINATED"
        "\n\n\n**************************************************\n\n\n")


def kill_port():
    if platform.system() == "Windows":
        for proc in process_iter():
            for conns in proc.connections(kind='inet'):
                if conns.laddr.port == 8000:
                    proc.send_signal(SIGTERM)
    elif platform.system() == "Linux":
        os.system("fuser -k 8000/tcp")

if len(sys.argv) > 1:
    argument = sys.argv[1]

    if argument.lower() == 'alltests':
        print("\n The following will be executed: Backend, Frontend, E2E")
        time.sleep(5)
        execute(True, True, True, False, False)
    elif argument.lower() == 'tests':
        print("\n The following will be executed: Backend, Frontend")
        time.sleep(5)
        execute(True, True, False, False, False)
    elif argument.lower() == 'linters':
        print("\n The following will be executed: Linters")
        time.sleep(5)
        execute(False, False, False, True, False)
    elif argument.lower() == 'e2e':
        print("\n The following will be executed: e2e")
        time.sleep(5)
        execute(False, False, True, False, False)
    elif argument.lower() == 'load':
        print("\n The following will be executed: load")
        time.sleep(5)
        execute(False, False, False, False, True)
    else:
        print(
            "\nArgument not recognized.\n\n"
            "Examples to execute this scripts are:\n"
            "python testlint.py\n"
            "python testlint.py alltests\n"
            "python testlint.py tests\n"
            "python testlint.py linters\n"
            "python testlint.py e2e\n"
            "python testlint.py load")
else:
    print("\n The following will be executed: Backend, Frontend, E2E, Linters")
    time.sleep(5)
    execute(True, True, True, True)
