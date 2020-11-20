import mongoose from 'mongoose';
import Promise from 'bluebird';
import findOrCreate from 'mongoose-findorcreate';
import BaseSchemaPlugin from '../../lib/BaseSchemaPlugin';

mongoose.plugin(findOrCreate);
mongoose.plugin(BaseSchemaPlugin);

mongoose.Promise = Promise;
