import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { MemberType } from '../types/member/member.js';
import { PostType } from '../types/posts/post.js';
import { ProfileType } from '../types/profiles/profile.js';
import { UserType } from '../types/users/user.js';
import { Context, ID } from '../types/common.js';
import { UUIDType } from '../types/uuid.js';
import { MemberTypeIdEnum } from '../types/member/memberTypeIdEnum.js';

export const QueryType = new GraphQLObjectType({
  name: 'Query',

  fields: () => ({
    posts: {
      type: new GraphQLList(PostType),
      args: {},
      resolve: async (source, args, { prisma }: Context) => await prisma.post.findMany(),
    },

    post: {
      type: PostType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (source, args: ID, { prisma }: Context) =>
        await prisma.post.findUnique({ where: { id: args.id } }),
    },

    memberTypes: {
      type: new GraphQLList(MemberType),

      resolve: async (source, args, { prisma }: Context) =>
        await prisma.memberType.findMany(),
    },

    memberType: {
      type: MemberType,
      args: { id: { type: new GraphQLNonNull(MemberTypeIdEnum) } },

      resolve: async (source, args: ID, { prisma }: Context) =>
        await prisma.memberType.findUnique({ where: { id: args.id } }),
    },

    profiles: {
      type: new GraphQLList(ProfileType),
      resolve: async (source, args, { prisma }: Context) =>
        await prisma.profile.findMany(),
    },

    profile: {
      type: ProfileType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (source, args: ID, { prisma }: Context) =>
        await prisma.profile.findUnique({ where: { id: args.id } }),
    },

    users: {
      type: new GraphQLList(UserType),
      resolve: async (source, args, { prisma }: Context) => await prisma.user.findMany(),
    },

    user: {
      type: UserType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (source, args: ID, { prisma }: Context) =>
        await prisma.user.findUnique({ where: { id: args.id } }),
    },
  }),
});
