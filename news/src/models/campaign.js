const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const SchemaType = Schema.Types;
const BlockAuthor = require("./block_author");

const autoIncrement = require("mongoose-auto-increment");
const mongoosePaginate = require("mongoose-paginate");
autoIncrement.initialize(mongoose);

const CampaignSchema = new Schema({
    ID: {  type: Number,  required: true, exists: false, unique : true },
    CampaignName: {type: String, required:true, unique : true},
    ArticleId1: {  type: Number,  required: true },
    ArticleId2: {  type: Number,  required: true },
    SplitId: {  type: Number,  required: true },
    viewCount: { type: Number, default: 0 },
    isDeleted: {type: Boolean, default: false},
    authorID: Number,
});
CampaignSchema.plugin(autoIncrement.plugin, { model: 'campaign', field: 'ID',startAt: 1 });
CampaignSchema.plugin(autoIncrement.plugin, { model: 'campaign', field: 'SplitId', startAt: 258678 });
module.exports = mongoose.model('campaign',CampaignSchema );  

