const Docker = require("dockerode");
const { open, close } = require("./port");
const { checkAndRemoveContainer, createContainer } = require("./docker");

const { dockerConfig } = require("./config");
const config = dockerConfig[process.env.MODE];

const image = config.image;
const name = config.name;

// 容器配置
const containerConfig = {
  Image: image,
  AttachStdout: true,
  AttachStderr: true,
  Tty: true,
  OpenStdin: true,
  name: name,
  ...config.containerConfig,
};

function followProgress(stream, dockerode) {
  return new Promise((resolve, reject) => {
    stream.pipe(process.stdout);
    dockerode.modem.followProgress(stream, (err, res) =>
      err ? reject(err) : resolve(res)
    );
  });
}

(async function () {
  try {
    await open();

    const dockerode = new Docker({
      host: "144.34.226.99",
      port: 2375,
    });

    const stream = await dockerode.buildImage(
      {
        context: config.context,
        src: config.src,
      },
      { t: image, nocache: true }
    );

    await followProgress(stream, dockerode);

    await checkAndRemoveContainer(dockerode, name);
    await createContainer(dockerode, containerConfig);

    await dockerode.pruneImages({ dangling: true });
  } catch (error) {
    console.log(error);
  } finally {
    await close();
  }
})();
