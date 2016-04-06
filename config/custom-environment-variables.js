module.exports = {
    "DB": {
        "Type":"SYS_DATABASE_TYPE",
        "User":"SYS_DATABASE_POSTGRES_USER",
        "Password":"SYS_DATABASE_POSTGRES_PASSWORD",
        "Port":"SYS_SQL_PORT",
        "Host":"SYS_DATABASE_HOST",
        "Database":"SYS_DATABASE_POSTGRES_USER"
    },


    "Redis":
    {
        "ip": "REDIS_IP",
        "port": "REDIS_PORT",
        "user": "SYS_REDIS_USER",
        "password": "SYS_REDIS_PASSWORD"

    },
    
    "Debug":{
        "ip":"SYS_DBG_IP",
        "port":"SYS_DBG_PORT"
    },

    "Host":
    {
        "domain": "HOST_IP",
        "port": "HOST_HTTPPROGRAMMINGAPIDEBUG_PORT",
        "version":"HOST_VERSION"
    },
    "HTTPServer" : {
        "port": "SYS_HTTPPROGRAMMINGAPI_PORT",
        "ip":"HOST_IP"
    },
    "APP" :
    {
        "pbx": "APP_PBX",
        "domain":"APP_DOMAIN",
        "profile": "APP_PROFILE"

    },
    "Security":
    {
        "ip": "SYS_REDIS_HOST",
        "port": "SYS_REDIS_PORT",
        "user": "SYS_REDIS_USER",
        "password": "SYS_REDIS_PASSWORD"

    }

};

//NODE_CONFIG_DIR