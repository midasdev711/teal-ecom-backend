const BlockAuthor = require("../../models/block_author");
const Articles = require("../../models/articles");
const { verifyToken } = require("../controllers/authController");

// import { get } from "lodash";
// import { isObject, isEmpty, has, pick as pickAttributes } from "underscore";
// import { idsOnly } from "../lib/documentHelper";
const get = require("lodash/get");
const _ = require("underscore");
const mongoose = require("mongoose");
const APIError = require("../lib/APIError");
const HttpStatus = require("http-status-codes");

module.exports = {
  index: async (root, args, context) => {
    try {
      let id = {};
      if (context.headers.authorization) id = await verifyToken(context);
      if (id.UserID) args.UserID = id.UserID;

      let data = await Articles.getArticles({ user: id, args });
      return data;
    } catch (error) {
      throw new APIError({
        code: HttpStatus.BAD_REQUEST,
        message: HttpStatus.getStatusText(HttpStatus.BAD_REQUEST),
      });
    }
  },
};
