import logging
import logging.config
import os

import yaml

from application import app


loggingyaml = '''
version: 1

disable_existing_loggers: false

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

# loggers:
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

# run the application!
if __name__ == '__main__':
    logging.config.dictConfig(yaml.load(loggingyaml))

     # Bind to PORT if defined, otherwise default to 5000.
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
