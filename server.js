/*
 * CreatedBy : Ankita Solace
 * CreatedDate : 29-11-2019
 * Purporse :  graphql server create for port 9100
 */
const cors = require('cors'),
  express = require('express'),
  mongoose = require('mongoose'),
  bodyParser = require('body-parser'),
  app = express();

app.use(cors({ origin: '*' }));
app.use(bodyParser.json());
app.use(bodyParser.text({ type: 'application/graphql' }));
app.use(bodyParser.json({ limit: '250mb' }));
app.use(bodyParser.urlencoded({ limit: '250mb', extended: true }));

//global
mongoose.connect(
  'mongodb+srv://admin:teal2020@cluster0-qz34h.mongodb.net/teal?replicaSet=rs',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  }
);

mongoose.connection.once('open', () => {
  console.log('conneted to database');
});

(function loadRoutes() {
  require('./news/src/config/routes')(app);
})();

app.listen({ port: 9200 }, () =>
  console.log('Server ready at http://localhost:9200/graphql')
);
