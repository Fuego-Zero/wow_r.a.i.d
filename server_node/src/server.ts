import app from './app';

const port = process.env.PORT || 34567;

// 启动 Koa 服务器
const server = app.listen(port, () => {
  console.log(`Listening on ${port}`);
});

// 处理未捕获的 Promise 异常
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  // 关闭服务器，或者执行其他错误处理逻辑
  server.close(() => process.exit(1));
});

// 处理未捕获的异常
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // 关闭服务器，或者执行其他错误处理逻辑
  server.close(() => process.exit(1));
});
