import {
  GraphQLString,
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLFloat,
} from 'graphql';
import { ProfileType } from '../profiles/profile.js';
import { UUIDType } from '../uuid.js';
import { PostType } from '../posts/post.js';
import { Context, UserSubs } from '../interfaces.js';
import { User } from '@prisma/client';

export const UserType: GraphQLObjectType = new GraphQLObjectType({
  name: 'User',

  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },

    profile: {
      type: ProfileType,
      resolve: async ({ id }: User, args, { dataLoaders }: Context) =>
        await dataLoaders.profileLoader.load(id),
    },

    posts: {
      type: new GraphQLList(PostType),
      resolve: async ({ id }: User, args, { dataLoaders }: Context) =>
        await dataLoaders.postsLoader.load(id),
    },

    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: async ({ userSubscribedTo }: UserSubs, args, { dataLoaders }: Context) =>
        userSubscribedTo
          ? dataLoaders.userLoader.loadMany(
              userSubscribedTo.map(({ authorId }) => authorId),
            )
          : null,
    },

    subscribedToUser: {
      type: new GraphQLList(UserType),
      resolve: async ({ subscribedToUser }: UserSubs, args, { dataLoaders }: Context) =>
        subscribedToUser
          ? dataLoaders.userLoader.loadMany(
              subscribedToUser.map(({ subscriberId }) => subscriberId),
            )
          : null,
    },
  }),
});
