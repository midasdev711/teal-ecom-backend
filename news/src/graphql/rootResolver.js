const ArticleResolver = require("./rootResolver");
const root = {
  Query: {
    articles: ArticleResolver.index,
  },
  Mutation: {},
  Asset: {
    __resolveType(obj, context, info) {
      if (obj.kind === "Note") {
        return "Note";
      } else if (obj.kind === "Highlight") {
        return "Highlight";
      }
    },
  },
};

module.exports = root;
