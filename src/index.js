require("dotenv").config();
const express = require("express");
const client = require("prom-client");
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express");

const routes = require("./routes");
const { errorDbConnection } = require("./metrics");
const swaggerDocs = require("./docs/swagger.json");

const PORT = 4000;

mongoose.connect(
  process.env.MONGO_URL,
  {
    dbName: "nodejsApi",
  },
  (error) => {
    errorDbConnection.inc();
  }
);

const register = new client.Registry();

register.setDefaultLabels({
  app: "nodejs-app",
});

client.collectDefaultMetrics({ register });

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.startRequest = new Date();
  next();
});

app.use("/api/v1", routes);

app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
