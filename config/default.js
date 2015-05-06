module.exports = {

    "DB": {
        "Type":"postgres",
        "User":"duo",
        "Password":"DuoS123",
        "Port":5432,
        "Host":"127.0.0.1",
        "Database":"dvpdb"
    },
    "Types":{
        "Type":"DEV_API"
    },
    "Class":{
        "EventClass":"APP"
    },

"Debug":{
    "ip":"127.0.0.1",
    "port":"8088"
},
    "HTTPServer" : {
        "port": "8086",
        "ip":"http://127.0.0.1"

    },


    "Redis":
    {
        "ip": "192.168.0.47",
        "port": "6379"

    },

    "Host":
    {
        "domain": "0.0.0.0",
        "port": "8082",
        "version":"6.0"
    }

};