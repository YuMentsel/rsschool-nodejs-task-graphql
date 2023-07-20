import { GraphQLEnumType } from 'graphql';
import { MemberTypeId } from '../../../member-types/schemas.js';

export const MemberTypeIdEnum = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    basic: {
      value: MemberTypeId.BASIC,
    },
    business: {
      value: MemberTypeId.BUSINESS,
    },
  },
});
