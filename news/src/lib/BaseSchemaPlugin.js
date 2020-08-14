module.exports = exports = function BaseSchemaPlugin (schema, options) {
  schema.options = Object.assign(schema.options, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  });

  schema.virtual('id').get(function(){
      return this._id.toHexString();
  });
}
