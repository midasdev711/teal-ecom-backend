const mongoose = require("mongoose");
// const UserSchema = require('../models/users');

const Schema = mongoose.Schema;

const UserAccessLevelSchema = new Schema({
        ID: Number,
        isParentRule : Boolean,
        Rule :  String,
        RuleDescription:String,
        ParentRuleID : Number,
        //     UserID: { type: Schema.Types.ID, ref : UserSchema },
        // },
        isCrud : Boolean,
        CrudPermission : {
            isAdd : Boolean,
            isEdit : Boolean,
            isDelete : Boolean,
            isView : Boolean,
        }
        Status : { type: Number, default: 1 },
        CreatedDate:  { type: Date, default: Date.now },
        ModifiedDate:  { type: Date, default: Date.now },
        CreatedBy: Number,
        ModifiedBy: Number
});

module.exports = mongoose.model('user_access_levels',UserAccessLevelSchema );
