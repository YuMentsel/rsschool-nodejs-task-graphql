import { GraphQLObjectType } from 'graphql';
import { PrismaClient } from '@prisma/client';
import { postMutationFields } from './mutationFields/postMutationFields.js';
import { profileMutationFields } from './mutationFields/profileMutationFields.js';
import { userMutationFields } from './mutationFields/userMutationFields.js';
import { subscribeMutationFields } from './mutationFields/subscribeMutationFields.js';

export const MutationType = new GraphQLObjectType<string, { prisma: PrismaClient }>({
  name: 'Mutation',
  fields: () => ({
    ...postMutationFields,
    ...profileMutationFields,
    ...userMutationFields,
    ...subscribeMutationFields,
  }),
});
