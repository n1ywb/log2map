from flask import Flask, render_template, session
from flask.ext.sqlalchemy import SQLAlchemy

# Create the app and configuration
# Read the configuration file
app = Flask(__name__, static_url_path='static', static_folder='static')
app.config.from_object('application.default_settings')
app.config.from_envvar('PRODUCTION_SETTINGS', silent=True)

# Connect to database with sqlalchemy.
#db = SQLAlchemy(app)


import application.manager
