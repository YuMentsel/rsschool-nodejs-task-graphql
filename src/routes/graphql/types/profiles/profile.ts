import { GraphQLBoolean, GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { MemberType } from '../member/member.js';
import { UUIDType } from '../uuid.js';
import { Context } from '../interfaces.js';
import { Profile } from '@prisma/client';
import { MemberTypeIdEnum } from '../member/memberTypeIdEnum.js';

export const ProfileType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    memberTypeId: { type: new GraphQLNonNull(MemberTypeIdEnum) },
    userId: { type: new GraphQLNonNull(UUIDType) },
    memberType: {
      type: new GraphQLNonNull(MemberType),
      resolve: async ({ memberTypeId }: Profile, args, { dataLoaders }: Context) =>
        await dataLoaders.memberLoader.load(memberTypeId),
    },
  }),
});
