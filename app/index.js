const tunnel = require("reverse-tunnel-ssh")

const log = process.argv.includes("--log") || process.env.LOG === "true"

const config = {
    keepAlive: true,

    host     : process.env.SSH_HOST,
    port     : process.env.SSH_PORT,
    username : process.env.SSH_USERNAME,
    password : process.env.SSH_PASSWORD,

    srcHost  : process.env.SRC_HOST,
    srcPort  : process.env.SRC_PORT,

    dstHost  : process.env.DST_HOST,
    dstPort  : process.env.DST_PORT
}

function exit(code = 0) {
    connection?.close && connection?.close()
    process.exit(code)
}

for (const event of ["SIGINT", "SIGTERM"])
    process.on(event, exit)

process.on("uncaughtException", error => {
    console.error(error.message)
    exit(1)
})

const connection = tunnel(config, (error, clientConnection) => {
    if (error) {
        if (log)
            console.error(error)
        process.exit(1)
    }
    else if (log)
        console.log(clientConnection["_forwarding"])
})

connection.once("connect", () => console.info(`established [${config.srcHost}:${config.srcPort} -> ${config.dstHost}:${config.dstPort} @ ${config.host}:${config.port}]`))