const client = require("prom-client");

const registerBooks = new client.Counter({
  name: "register_books",
  help: "register books",
});

const errorDbConnection = new client.Counter({
  name: "error_db_connection",
  help: "error Db Connection",
});

const borrowBooks = new client.Counter({
  name: "borrow_books",
  help: "borrow books",
  labelNames: ["status"],
});

const latencyHistogram = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP request in ms",
  labelNames: ["method", "route", "status"],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
});

function setlLatencyHistogram(data) {
  const responseTimeInMs = new Date() - data.startRequest;
  latencyHistogram
    .labels(data.method, data.route, data.statusCode)
    .observe(responseTimeInMs / 1000);
}

module.exports = {
  borrowBooks,
  errorDbConnection,
  registerBooks,
  setlLatencyHistogram,
};
