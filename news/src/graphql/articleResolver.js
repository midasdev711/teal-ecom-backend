const Articles = require("../models/articles");
const Users = require("../models/users");
const BlockAuthor = require("../models/block_author");
const { verifyToken } = require("../controllers/authController");
const { ArticleStatusConst } = require("../constant");
const get = require('lodash/get');

module.exports = {
  index: async (root, args, context) => {

    let id = {};
    if (context.headers.authorization) {
      id = await verifyToken(context);
    }

    if (id.UserID) {
      args.UserID = id.UserID;
    }

    const findQuery = await buildFindQuery({ args: args.filters });

    let data = await Articles.find(findQuery);
    return data;
  }
};

const buildFindQuery = async ({ args }) => {

  const blockedAuthorIds = await queryForBlockedAuthors({ args });
  let query = { $and: [] };

  query.$and.push({ Status: 2 });
  query.$and.push({ isPublish: true });

  if (blockedAuthorIds) {
    query.$and.push({ AuthorID: { $nin: blockedAuthorIds } });
  }

  if (get(args, 'AuthorUserName')) {
    args.AuthorUserName = args.AuthorUserName.trim();
    const AuthorDetails = await Users.findOne({ Status: 1, UserName: args.AuthorUserName });
    if (AuthorDetails) {
      args.AuthorID = AuthorDetails.ID;
    }
    query.$and.push({ Status: 2 });
    query.$and.push({ ArticleScope: 1 });
  }

  if (get(args, 'Slug')) {
    query.$and.push({ Slug: args.Slug });
  }

  if (get(args, 'isPopular')) {
    query.$and.push({ Status: ArticleStatusConst.Approved });
  }
  return query;

}

const queryForBlockedAuthors = async ({ args }) => {
  const blockedAuthor = await BlockAuthor.find(
    { UserID: args.UserID, Status: 0 },
    { AuthorID: 1, _id: 0 });

  if (!blockedAuthor) {
    return [];
  }

  return blockedAuthor.map((ID) => ID.AuthorID)
}
