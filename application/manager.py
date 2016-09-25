from application import app
from flask import render_template
from application.models import *


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/views/<view>')
def durandal_view(view):
    return render_template('views/' + view)

