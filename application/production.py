import os

DEBUG = False
RELOAD = False
CSRF_ENABLED = True
#SQLALCHEMY_DATABASE_URI = str(os.environ.get('DATABASE_URL', 'postgresql://localhost/myproddatabase'))
SECRET_KEY = os.environ.get('SECRET_KEY','ASDGLHASDLKGHSDALKDGHSSDAKLHGSDAKLH')
HOST_NAME = os.environ.get('OPENSHIFT_APP_DNS','localhost')
APP_NAME = os.environ.get('OPENSHIFT_APP_NAME','flask')
IP = os.environ.get('OPENSHIFT_PYTHON_IP','127.0.0.1')
PORT = int(os.environ.get('OPENSHIFT_PYTHON_PORT',8080))
MONGO_URI = os.environ['OPENSHIFT_MONGODB_DB_URL'] + APP_NAME
