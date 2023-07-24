import { GraphQLBoolean, GraphQLNonNull } from 'graphql';
import { ChangeProfile, CreateProfile, ID } from '../../types/interfaces.js';
import { UUIDType } from '../../types/uuid.js';
import { ProfileType } from '../../types/profiles/profile.js';
import {
  CreateProfileInputType,
  ChangeProfileInputType,
} from '../../types/profiles/profileInput.js';

export const profileMutationFields = {
  createProfile: {
    type: ProfileType,
    args: { dto: { type: new GraphQLNonNull(CreateProfileInputType) } },
    resolve: async (source, { dto }: CreateProfile, { prisma }) =>
      await prisma.profile.create({ data: dto }),
  },

  changeProfile: {
    type: ProfileType,
    args: {
      id: { type: new GraphQLNonNull(UUIDType) },
      dto: { type: new GraphQLNonNull(ChangeProfileInputType) },
    },
    resolve: async (source, { id, dto }: ChangeProfile, { prisma }) =>
      prisma.profile.update({ where: { id }, data: dto }),
  },

  deleteProfile: {
    type: GraphQLBoolean,
    args: { id: { type: new GraphQLNonNull(UUIDType) } },
    resolve: async (source, { id }: ID, { prisma }) =>
      !!(await prisma.profile.delete({ where: { id } })),
  },
};
