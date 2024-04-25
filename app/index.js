const { spawn } = require('child_process')



let sshProcess

function exit(code = 0) {
  sshProcess?.kill('SIGKILL')
  process.exit(code)
}

for (const event of ["exit", "SIGINT", "SIGTERM"])
  process.on(event, () => exit())



const config = {
  host    : process.env.SSH_HOST,          
  port    : process.env.SSH_PORT,          
  username: process.env.SSH_USERNAME,      
  password: process.env.SSH_PASSWORD,      
  srcPort : process.env.SRC_PORT,          
  dstPort : process.env.DST_PORT,          
  reverse : process.env.REVERSE === 'true'
}



sshProcess = spawn('expect', ['expect.exp'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    host: config.host,
    port: config.port,
    username: config.username,
    password: config.password,
    reverse: config.reverse ? 'R' : 'L',
    mapping: config.reverse
      ? config.dstPort + ':localhost:' + config.srcPort
      : config.srcPort + ':localhost:' + config.dstPort,
  }
})

sshProcess.on('exit', code => exit(code))