import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLResolveInfo,
} from 'graphql';
import { MemberType } from '../types/member/member.js';
import { PostType } from '../types/posts/post.js';
import { ProfileType } from '../types/profiles/profile.js';
import { UserType } from '../types/users/user.js';
import { Context, ID } from '../types/interfaces.js';
import { UUIDType } from '../types/uuid.js';
import { MemberTypeIdEnum } from '../types/member/memberTypeIdEnum.js';
import {
  ResolveTree,
  parseResolveInfo,
  simplifyParsedResolveInfoFragmentWithType,
} from 'graphql-parse-resolve-info';

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
      resolve: async (source, { id }: ID, { prisma }: Context) =>
        await prisma.post.findUnique({ where: { id } }),
    },

    memberTypes: {
      type: new GraphQLList(MemberType),

      resolve: async (source, args, { prisma }: Context) =>
        await prisma.memberType.findMany(),
    },

    memberType: {
      type: MemberType,
      args: { id: { type: new GraphQLNonNull(MemberTypeIdEnum) } },

      resolve: async (source, { id }: ID, { prisma }: Context) =>
        await prisma.memberType.findUnique({ where: { id } }),
    },

    profiles: {
      type: new GraphQLList(ProfileType),
      resolve: async (source, args, { prisma }: Context) =>
        await prisma.profile.findMany(),
    },

    profile: {
      type: ProfileType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (source, { id }: ID, { prisma }: Context) =>
        await prisma.profile.findUnique({ where: { id } }),
    },

    users: {
      type: new GraphQLList(UserType),
      resolve: async (source, args, context: Context, info) =>
        await usersResolver(context, info),
    },

    user: {
      type: UserType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (source, { id }: ID, { dataLoaders }: Context) =>
        await dataLoaders.userLoader.load(id),
    },
  }),
});

export const usersResolver = async (
  { prisma, dataLoaders }: Context,
  resolveInfo: GraphQLResolveInfo,
) => {
  const parsedResolveInfoFragment = parseResolveInfo(resolveInfo);

  const { fields }: { fields: { [key in string]: ResolveTree } } =
    simplifyParsedResolveInfoFragmentWithType(
      parsedResolveInfoFragment as ResolveTree,
      new GraphQLList(UserType),
    );

  const { userSubscribedTo, subscribedToUser } = fields;

  const include = {
    userSubscribedTo: !!userSubscribedTo,
    subscribedToUser: !!subscribedToUser,
  };

  const users = await prisma.user.findMany({ include });
  users.forEach((user) => dataLoaders.userLoader.prime(user.id, user));
  return users;
};
