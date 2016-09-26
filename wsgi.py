#!/usr/bin/python
import logging
import logging.config
import os

import yaml

virtenv = os.environ['OPENSHIFT_PYTHON_DIR'] + '/virtenv/'
virtualenv = os.path.join(virtenv, 'bin/activate_this.py')
try:
    execfile(virtualenv, dict(__file__=virtualenv))
except IOError:
    pass
#
# IMPORTANT: Put any additional includes below this line.  If placed above this
# line, it's possible required libraries won't be in your searchable path
#

from application import app as application


loggingyaml = '''
version: 1

formatters:
  default:
    format: '%(asctime)s %(levelname)s %(name)s %(message)s'
  # jsonFormat:
  #   (): pythonjsonlogger.jsonlogger.JsonFormatter
  #   format: '%(asctime) %(created) %(filename) %(funcName) %(levelname) %(levelno) %(lineno) %(module) %(msecs) %(message) %(name) %(pathname) %(process) %(processName) %(relativeCreated) %(thread) %(threadName)'

filters: []

handlers:
  # loggly:
  #   class: loggly.handlers.HTTPSHandler
  #   formatter: jsonFormat
  #   url: 'https://logs-01.loggly.com/inputs/''' + os.environ.get('SERVICES_LOGGLY_TOKEN', '') + '''/tag/python'

  stderr:
    class: logging.StreamHandler
    formatter: default
    stream: ext://sys.stderr

loggers:
#  sqlalchemy.engine:
#    propagate: False
#    level: WARNING
#    handlers: [loggly,]
#  sqlalchemy.engine.base.Engine.test:
#    level: WARNING
#    propagate: False
#    handlers: [loggly,]
#  sqlalchemy.pool:
#    level: WARNING
#  sqlalchemy.orm.unitofwork:
#    level: WARNING

root:
  level: DEBUG
  handlers: [stderr]
'''

logging.config.dictConfig(yaml.load(loggingyaml))

#
# Below for testing only
#
if __name__ == '__main__':
    from wsgiref.simple_server import make_server
    httpd = make_server('localhost', 8051, application)
    # Wait for a single request, serve it and quit.
    httpd.handle_request()
