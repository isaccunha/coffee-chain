from werkzeug.middleware.dispatcher import DispatcherMiddleware
from flask import Flask
from app import create_app 
from config import Config

flask_app = create_app()

app = DispatcherMiddleware(Flask("root"), {
    Config.WSGI_API_PREFIX: flask_app
})