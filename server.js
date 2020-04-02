const express = require('express');
const graphqlHTTP = require('express-graphql');

const { mergeSchemas } = require('graphql-tools');
const EcommSchema = require('./ecomm/schema/schema');
const NewsSchema = require('./news/schema/schema');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
var bodyParser = require('body-parser');

const schema = mergeSchemas({
   schemas: [
     EcommSchema,
     NewsSchema
   ]
 });

app.use(cors());




 mongoose.connect('mongodb+srv://yashcouser:yashcouser@cluster0-uxpvw.mongodb.net/slang',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
     }
  )

mongoose.connection.once('open', () => {
    console.log('conneted to database');
});


app.use(bodyParser.text({type: 'application/graphql'}));
app.use(bodyParser.json({limit: '250mb'}));
app.use(bodyParser.urlencoded({limit: '250mb', extended: true}));

//Set out image-upload folder
app.use('/uploads',express.static('uploads'));

// bind express with graphql
app.use('/ecomm', graphqlHTTP({
    schema,
    graphiql: true
}));


app.listen(3010, () => {
    console.log('now listening for requests on port 3010');
    console.log("access web url:-  http://localhost:3010/ecomm");
});
