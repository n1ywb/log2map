import geojson
from pkg_resources import resource_stream

from flask import render_template, request, jsonify, redirect
from application import app, mongo
from application.models import *

from bson.objectid import ObjectId
from bson.errors import InvalidId

from hamtools.geolog import Log
from hamtools.ctydat import CtyDat
from hamtools.qrz import NotFound, Session as QrzSession


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/views/<view>')
def durandal_view(view):
    return render_template('views/' + view)


class DummyQRZ(object):
    @staticmethod
    def qrz(callsign):
        if callsign.lower() == 'n1ywb':
            return dict(lon=-72.486441, lat=44.196575)
        raise NotFound("Unimplemented")

ctydatflo = resource_stream('hamtools', "ctydat/cty.dat")
ctydat = CtyDat(ctydatflo)

def georeferencelog(logfile, key):
    CABRILLO_HEADER = 'START-OF-LOG'

    line = logfile.read(len(CABRILLO_HEADER))
    logfile.seek(0)

    if line == CABRILLO_HEADER:
        app.logger.info("Opened Cabrillo format log %r" % logfile)
        qsolog = Log.from_cabrillo(logfile)
    else:
        app.logger.info("Opened ADIF format log %r" % logfile)
        qsolog = Log.from_adif(logfile)

    sess = None
    if key:
        sess = QrzSession(key=key)
    qsolog.georeference(sess, ctydat)

    qth, points, lines = qsolog.geojson()
    d = dict(qth=qth, points=points, lines=lines)
    return d


@app.route('/api/upload/post', methods=['POST'])
def upload_log():
    # app.logger.debug(request.files['file'].read())
    key = request.form['key']
    state = request.form['state']
    try:
        geojson = georeferencelog(request.files['file'], key)
        operator = None # georeferencelog() needs to return this
        filename = None # it's in the file obj somewhere
        r = mongo.db.logs.insert_one({
            'operator': operator,
            'filename': filename,
            'geojson': geojson
        })
        return jsonify({'_id': str(r.inserted_id), 'qth': geojson['qth']})
    except Exception, e:
        return str(e), 500



@app.route('/api/log/<_id>', methods=['GET'])
def download_geolog(_id):
    try:
        oid = ObjectId(_id)
    except InvalidId:
        return "invalid oid", 400
    r = mongo.db.logs.find_one({'_id': oid})
    if r is None:
        return "log not found", 404
    return jsonify(r['geojson'])

