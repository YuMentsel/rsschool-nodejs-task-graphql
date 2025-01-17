import { GraphQLBoolean, GraphQLNonNull } from 'graphql';
import { UUIDType } from '../../types/uuid.js';
import { UserSubscribedTo } from '../../types/interfaces.js';
import { UserType } from '../../types/users/user.js';

export const subscribeMutationFields = {
  subscribeTo: {
    type: UserType,
    args: {
      userId: { type: new GraphQLNonNull(UUIDType) },
      authorId: { type: new GraphQLNonNull(UUIDType) },
    },
    resolve: async (source, { userId, authorId }: UserSubscribedTo, { prisma }) =>
      await prisma.user.update({
        where: { id: userId },
        data: { userSubscribedTo: { create: { authorId } } },
      }),
  },

  unsubscribeFrom: {
    type: GraphQLBoolean,
    args: {
      userId: { type: new GraphQLNonNull(UUIDType) },
      authorId: { type: new GraphQLNonNull(UUIDType) },
    },
    resolve: async (source, { userId, authorId }: UserSubscribedTo, { prisma }) =>
      !!(await prisma.subscribersOnAuthors.delete({
        where: {
          subscriberId_authorId: {
            subscriberId: userId,
            authorId,
          },
        },
      })),
  },
};
