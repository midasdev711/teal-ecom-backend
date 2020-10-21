const cors = require("cors"),
  express = require("express"),
  bodyParser = require("body-parser"),
  app = express();
require("./db/db");
app.use(cors({ origin: "*" }));
app.use(bodyParser.json({ limit: 524288000 }));
app.use(bodyParser.text({ type: "application/graphql" }));
app.use(bodyParser.urlencoded({ limit: 524288000, parameterLimit: 10000000000000, extended: true, }));
app.use(bodyParser.raw({ limit: 524288000 }));
//global
// mongoose.connect(
//   "mongodb+srv://fuckcovid:Li5D0vvZTVvyo0V9@cluster0.oml6y.mongodb.net/teal?retryWrites=true&w=majority",
//   {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useCreateIndex: true,
//     useFindAndModify: false,
//   }
// );

// mongoose.connection.once("open", () => {
//   console.log("conneted to database");
// });

// require("./mainRoutes/mainRoutes");

(function loadRoutes() {
  // require("./news/src/config/routes")(app);
  require("./ecomm/src/config/routes")(app);
})();



app.listen({ port: 9200 }, () =>
  console.log("Server ready at http://localhost:9200/graphql")
);
