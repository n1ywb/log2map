from flask import Flask, render_template, session
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.pymongo import PyMongo

from geojson.codec import GeoJSONEncoder

# Create the app and configuration
# Read the configuration file
app = Flask(__name__)
app.config.from_object('application.default_settings')
app.config.from_envvar('PRODUCTION_SETTINGS', silent=True)
app.json_encoder = GeoJSONEncoder
mongo = PyMongo(app)

# Connect to database with sqlalchemy.
#db = SQLAlchemy(app)


import application.manager
