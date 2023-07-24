import { GraphQLString, GraphQLObjectType, GraphQLNonNull } from 'graphql';
import { UUIDType } from '../uuid.js';
import { Context } from '../interfaces.js';
import { UserType } from '../users/user.js';
import { Post } from '@prisma/client';

export const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
    author: {
      type: UserType as GraphQLObjectType,
      resolve: async ({ authorId }: Post, args, { dataLoaders }: Context) =>
        dataLoaders.userLoader.load(authorId),
    },
  }),
});
