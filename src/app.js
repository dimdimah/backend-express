const express = require("express");
const routes = require("./routes");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3221;

app.use("/", routes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
