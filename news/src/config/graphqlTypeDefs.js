const typeDefs = `
  type UrlDomain {
    id: ID!
    domain: String
  }

  type UrlPath {
    id: ID!
    pathname: String
    port: String
  }

  type UrlVariation {
    id: ID!
    search: String
    hash: String
  }

  type UrlEntity {
    id: ID!
    rawUrl: String
    urlDomain: UrlDomain
    urlPath: UrlPath
    urlVariation: UrlVariation
  }

  type SharableLink {
    id: ID!
    createdAt: String
    permission: String
    forModel: String
  }

  type Note {
    id: ID!
    plainText: String
    author: ID
    url: String
    reaction: String
    urlEntity: UrlEntity
    contentState: String
    isDeleted: Boolean
    updatedAt: String
    createdAt: String
    forHighlight: ID
    _hasUnsyncedChanges: Boolean
    tags: [String]
    usersSharedWith: [User]
    isPinned: Boolean
    sharedWithLink: SharableLink
    author: User
    collectionId : ID
    canonicalId : ID
  }

  type DOMPosition {
    start: String
    end: String
    startOffset: Int
    endOffset: Int
    __typename: String
  }

  type AssetCollection {
    id: ID
    parent: AssetCollection
    name: String
    isDeleted: Boolean
    assets : [ID]
    _hasUnsyncedChanges: Boolean
  }

  type GetAssetCollection {
    doc_id : String
    name: String
    isDeleted: Boolean
    collectionSubfolder : [AssetCollection]
  }

  type Highlight {
    id: ID!
    url: String
    reaction: String
    urlEntity: UrlEntity
    position: DOMPosition
    isDeleted: Boolean
    highlightText: String
    highlightHtml: String
    preContext: String
    postContext: String
    color: String
    updatedAt: String
    createdAt: String
    notes: [Note]
    _hasUnsyncedChanges: Boolean
    tags: [String]
    usersSharedWith: [User]
    sharedWithLink: SharableLink
    author: User
    isPinned: Boolean
    collectionId : ID
    canonicalId : ID
  }

  type Tag {
    name: String
  }

  type Subscription {
    id: ID!
    type: String
    isActive: Boolean
  }

  input TagInput {
    id: ID
    name: String
  }

  input DOMPositionInput {
    start: String
    end: String
    startOffset: Int
    endOffset: Int
    __typename: String
  }

  input HighlightInput {
    id: ID
    url: String
    isDeleted: Boolean
    reaction: String
    position: DOMPositionInput
    highlightText: String
    highlightHtml: String
    preContext: String
    postContext: String
    color: String
    isPinned: Boolean
    notes: [NoteInput]
    createdAt: String
    _hasUnsyncedChanges: Boolean
    tags: [String]
    isPinned: Boolean
    collectionId : ID
    __typename: String
    canonicalId : ID
  }

  input NoteInput {
    id: ID
    reaction : String
    plainText: String
    contentState: String
    url: String
    forHighlight: ID
    createdAt: String
    updatedAt: String
    isDeleted: Boolean
    _hasUnsyncedChanges: Boolean
    tags: [String]
    isPinned: Boolean
    __typename: String
    canonicalId : ID
    collectionId : ID
  }
  
  input UrlFilter {
    domain: String
    pathname: String
    search: String
    hash: String
  }

  input AssetFilters {
    url: UrlFilter
    sharableLinkId: String
    isPinned: Boolean
    query: String
    tags: [String]
    assetTypes: [String]
    reaction: String
    collectionId : ID
  }

  input UserFilters {
    query: String
  }

  union Asset = Note | Highlight

  type Query {
    assets(filters: AssetFilters, sort: String): [Asset]
    users(filters: UserFilters): [User]
    currentUser: CurrentUser
    tags: [String]
    collections: [AssetCollection]
    getCollections : [GetAssetCollection]
  }

  type Mutation {
    upsertAssetsBulk(highlights: [HighlightInput], notes: [NoteInput]): [Asset]
    shareAssetWithLink(id: ID): SharableLink
    unshareAssetFromLink(id: ID, shareableLinkId: ID): Asset
    shareAssets(ids: [ID], shareWithUserId: ID): [Asset]
    unshareAssets(ids: [ID], unshareWithUserId: ID): [Asset]
    upsertCollection(id: ID!, parent: ID, name: String!, isDeleted: Boolean): AssetCollection
    moveAssetsToCollection(fromCollectionId :ID , assetIds: [ID!], toCollectionId: ID): AssetCollection
  }
  
  type User {
    givenName: String
    familyName: String
    userPhoto: String
    id: ID
  }

  type CurrentUser {
    id: ID
    givenName: String
    familyName: String
    email: String
    userPhoto: String
    subscription: Subscription
  }
`;
module.exports = typeDefs;
