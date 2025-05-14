const logger = (req, res, next) => {
  const { method, originalUrl } = req;
  const timestamp = new Date().toISOString();
  const userAgent = req.headers['user-agent'];

  console.log(`[${timestamp}] ${method} ${originalUrl} - ${userAgent}`);
  next();
};

module.exports = logger;
