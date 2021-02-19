#!/usr/bin/python

import os
import subprocess
import psutil
import signal
import sys
import webbrowser
import platform

python_interpreter = ""


def e2e():
    os.chdir("server")
    print(
        "\n\n\n**************************************************\n\n\n"
        "E2E test will now run"
        "\n\n\n**************************************************\n\n\n")
    kill_port()
    os.system(f'{python_interpreter} manage.py flush --no-input --settings django_server.test_settings')
    os.system(f'{python_interpreter} manage.py makemigrations --settings django_server.test_settings')
    os.system(f'{python_interpreter} manage.py migrate --settings django_server.test_settings')
    os.system(
        f'{python_interpreter} manage.py loaddata users.json organizations.json items.json audit_template.json '
        f'audits.json bins.json --settings django_server.test_settings')
    subprocess.Popen(f'{python_interpreter} manage.py runserver 127.0.0.1:8000 '
                     f'--settings django_server.test_settings', shell=True)
    os.chdir(os.path.dirname(os.getcwd()))
    os.chdir("client")
    p1 = subprocess.Popen("ng e2e", shell=True)
    p1.wait()
    kill_port()
    os.chdir(os.path.dirname(os.getcwd()))


def back():
    os.chdir("server")
    print(
        "\n\n\n**************************************************\n\n\n"
        "Backend tests and coverage will now be calculated"
        "\n\n\n**************************************************\n\n\n")
    os.system("coverage run -m --branch pytest")
    os.system("coverage html")
    webbrowser.open('file://' + os.path.realpath("htmlcov/index.html"))
    os.chdir(os.path.dirname(os.getcwd()))


def front():
    os.chdir("client")
    print(
        "\n\n\n**************************************************\n\n\n"
        "Frontend tests and coverage will now be calculated"
        "\n\n\n**************************************************\n\n\n")
    os.system("ng test --no-watch --code-coverage")
    webbrowser.open('file://' + os.path.realpath("coverage/alta-front/index.html"))
    os.chdir(os.path.dirname(os.getcwd()))


def load():
    os.chdir("server")
    print(
        "\n\n\n**************************************************\n\n\n"
        "load tests will now run"
        "\n\n\n**************************************************\n\n\n")
    kill_port()
    os.system(f'{python_interpreter} manage.py flush --no-input --settings django_server.test_settings')
    os.system(f'{python_interpreter} manage.py makemigrations --settings django_server.test_settings')
    os.system(f'{python_interpreter} manage.py migrate --settings django_server.test_settings')
    os.system(
        f'{python_interpreter} manage.py loaddata users.json organizations.json items.json audit_template.json '
        f'--settings django_server.test_settings')
    subprocess.Popen(f'{python_interpreter} manage.py runserver 127.0.0.1:8000 '
                     f'--settings django_server.test_settings', shell=True)
    os.chdir(os.path.dirname(os.getcwd()))
    os.chdir("server/performance_test")
    p1 = subprocess.Popen("locust --config=load_testing.conf", shell=True)
    p1.wait()
    kill_port()
    os.chdir(os.path.dirname(os.getcwd()))


def lint():
    os.chdir("server")
    print(
        "\n\n\n**************************************************\n\n\n"
        "Backend linter test will now run"
        "\n\n\n**************************************************\n\n\n")
    lint_me = 'django_server '
    for folder_name in os.listdir():
        if os.path.exists(os.path.join(os.getcwd(), folder_name, 'migrations')):
            lint_me += folder_name + ' '
    os.system(
        f'pylint --load-plugins pylint_django --django-settings-module=django_server.settings ' + lint_me)
    print(
        "\n\n\n**************************************************\n\n\n"
        "Frontend linter test will now run"
        "\n\n\n**************************************************\n\n\n")
    os.chdir(os.path.dirname(os.getcwd()))
    os.chdir("client")
    os.system("ng lint")
    os.chdir(os.path.dirname(os.getcwd()))


def execute(args):
    os.chdir(os.path.dirname(os.getcwd()))
    for arg in args:
        globals()[arg]()
    print(
        "\n\n\n**************************************************\n\n\n"
        "SCRIPT HAS SUCCESSFULLY TERMINATED"
        "\n\n\n**************************************************\n\n\n")


def kill_port():
    if platform.system() == "Windows":
        for proc in psutil.process_iter():
            for conns in proc.connections(kind='inet'):
                if conns.laddr.port == 8000:
                    proc.send_signal(signal.SIGTERM)
    elif platform.system() == "Linux":
        os.system("fuser -k 8000/tcp")


if __name__ == "__main__":
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
    if len(sys.argv) > 1:
        sys.argv.pop(0)
        if 'help' in sys.argv:
            print(
                "Examples to execute this scripts are:\n"
                "python execute.py back\n"
                "python execute.py front back\n"
                "python execute.py lint\n"
                "python execute.py e2e\n"
                "python execute.py load")
        else:
            execute(args=sys.argv)
