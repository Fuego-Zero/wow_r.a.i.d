const { Client } = require("ssh2");
const { sshConfig } = require("./config");

function ssh(command) {
  return new Promise((resolve, reject) => {
    const conn = new Client();

    conn
      .on("ready", function () {
        console.log("SSH connection established.");
        console.log("command:", command);

        conn.exec(command, function (err, stream) {
          if (err) throw err;

          stream
            .on("close", function (code, signal) {
              conn.end();
              resolve();
            })
            .on("data", function (data) {
              console.log("STDOUT: " + data);
            })
            .stderr.on("data", function (data) {
              console.log("STDERR: " + data);
              reject();
            });
        });
      })
      .connect(sshConfig);

    conn.on("error", function (err) {
      console.error("Error connecting to the SSH server:", err);
      reject();
    });
  });
}

function open() {
  return ssh("firewall-cmd --zone=public --add-port=2375/tcp");
}

function close() {
  return ssh("firewall-cmd --zone=public --remove-port=2375/tcp");
}

module.exports = {
  open,
  close,
};
