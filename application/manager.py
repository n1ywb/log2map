import geojson
from pkg_resources import resource_stream

from flask import render_template, request, jsonify, redirect
from application import app, mongo
from application.models import *

from bson.objectid import ObjectId

from hamtools.geolog import Log
from hamtools.ctydat import CtyDat
from hamtools.qrz import NotFound


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

def georeferencelog(logfile, username, password):
    CABRILLO_HEADER = 'START-OF-LOG'

    line = logfile.read(len(CABRILLO_HEADER))
    logfile.seek(0)

    if line == CABRILLO_HEADER:
        app.logger.info("Opened Cabrillo format log %r" % logfile)
        qsolog = Log.from_cabrillo(logfile)
    else:
        app.logger.info("Opened ADIF format log %r" % logfile)
        qsolog = Log.from_adif(logfile)

    # with qrz.Session(username, password, cachepath) as sess:
    #     qsolog.georeference(sess, ctydat)

    qsolog.georeference(DummyQRZ, ctydat)
    points, lines = qsolog.geojson()
    d = dict(points=points, lines=lines)
    return d


@app.route('/api/upload/post', methods=['POST'])
def upload_log():
    # app.logger.debug(request.files['file'].read())
    r = georeferencelog(request.files['file'], None, None)
    operator = None
    filename = None
    r = mongo.db.logs.insert_one({
        'operator': operator,
        'filename': filename,
        'geojson': r
    })
    return jsonify({'_id': str(r.inserted_id)})


@app.route('/api/log/<_id>', methods=['GET'])
def download_geolog(_id):
    r = mongo.db.logs.find_one({'_id': ObjectId(_id)})
    return jsonify(r['geojson'])

