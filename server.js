/*
 * CreatedBy : Ankita Solace
 * CreatedDate : 29-11-2019
 * Purporse :  graphql server create for port 9100
 */

const express = require("express"),
  graphqlHTTP = require("express-graphql"),
  mongoose = require("mongoose"),
  EcommSchema = require("./ecomm/schema/schema"),
  NewsSchema = require("./news/schema/schema"),
  expressPlayground = require("graphql-playground-middleware-express").default,
  cors = require("cors"),
  autoIncrement = require("mongoose-auto-increment"),
  bodyParser = require("body-parser"),
  app = express();
const { mergeSchemas } = require("graphql-tools");
const schema = mergeSchemas({
  schemas: [EcommSchema, NewsSchema],
});
app.use(cors({ origin: "*" }));
app.use(bodyParser.text({ type: "application/graphql" }));
app.use(bodyParser.json({ limit: "250mb" }));
app.use(bodyParser.urlencoded({ limit: "250mb", extended: true }));

// mongo connection

// mongodb+srv://admin:test1234@cluster0-hfbk1.mongodb.net/pre_launch?retryWrites=true&w=majority // local
// mongodb+srv://admin:teal1234@cluster0-bhoxg.mongodb.net/pre_launch?replicaSet=rs // server
//global
mongoose.connect(
  "mongodb+srv://admin:teal2020@cluster0-qz34h.mongodb.net/teal?replicaSet=rs",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  }
);
mongoose.connection.once("open", () => {
  console.log("conneted to database");
});

app.use("/uploads", express.static("uploads"));
// bind express with graphql
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.get("/playground", expressPlayground({ endpoint: "/ecomm" }));

app.listen(443, () => {
  console.log("now listening for requests on port 9200");
  console.log("access web url:-  http://localhost:9200/graphql");
});
