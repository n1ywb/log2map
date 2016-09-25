from application import app
from flask import render_template
from application.models import *


@app.route('/*')
def index():
    return render_template('index.html', title='Flask-Bootstrap')

