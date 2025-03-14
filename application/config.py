class Config():
    DEBUG = False
    SQLALCHEMY_TRACK_MODIFICATIONS = True

class LocalDevelopmentConfig(Config):
    SQLALCHEMY_DATABASE_URI = "sqlite:///fixItNow_V2.sqlite3"
    DEBUG = True

    #config for flask-security
    SECRET_KEY = "some-secret-key"                            # hash user credentials in the session
    SECURITY_PASSWORD_HASH = "bcrypt"                         # mechanism for hashing password
    SECURITY_PASSWORD_SALT = "some-password-salt"             # helps in hashing the password
    
    SECURITY_TOKEN_AUTHENTICATION_HEADER = "Authentication-Token"

    # config for cache
    CACHE_TYPE = "RedisCache"
    CACHE_DEFAULT_TIMEOUT = 30
    CACHE_REDIS_PORT = 6379

    WTF_CSRF_ENABLED = False 