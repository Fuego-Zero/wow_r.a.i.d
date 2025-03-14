async function checkAndRemoveContainer(dockerode, containerName) {
  const containers = await dockerode.listContainers({ all: true });

  for (const containerInfo of containers) {
    if (containerInfo.Names.includes(`/${containerName}`)) {
      // 找到同名容器
      const existingContainer = dockerode.getContainer(containerInfo.Id);

      // 停止同名容器
      await existingContainer.stop();

      // 删除同名容器
      await existingContainer.remove();

      console.log(
        `Stopped and removed existing container with name: ${containerName}`
      );
    }
  }
}

async function createContainer(dockerode, containerConfig) {
  // 创建容器
  const container = await dockerode.createContainer(containerConfig);

  // 启动容器
  await container.start();

  console.log("Container started successfully.");

  // 附加到容器的输出流
  const attachStream = await container.attach({
    stream: true,
    stdout: true,
    stderr: true,
  });

  await new Promise((resolve) => {
    // 监听流的数据事件
    attachStream.on("data", (data) => {
      data = data.toString();
      console.log(data);

      if (
        data.includes("Ready in") ||
        data.includes("Running on") ||
        data.includes("Listening on")
      ) {
        attachStream.destroy();
        resolve();
      }
    });
  });
}

module.exports = {
  checkAndRemoveContainer,
  createContainer,
};
