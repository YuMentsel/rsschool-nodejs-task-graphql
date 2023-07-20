import { GraphQLBoolean, GraphQLNonNull } from 'graphql';
import { ChangeUser, CreateUser, ID } from '../../types/common.js';
import { UUIDType } from '../../types/uuid.js';
import { UserType } from '../../types/users/user.js';
import { CreateUserInputType, ChangeUserInputType } from '../../types/users/userInput.js';

export const userMutationFields = {
  createUser: {
    type: UserType,
    args: { dto: { type: new GraphQLNonNull(CreateUserInputType) } },
    resolve: async (source, { dto }: CreateUser, { prisma }) =>
      await prisma.user.create({ data: dto }),
  },

  changeUser: {
    type: UserType,
    args: {
      id: { type: new GraphQLNonNull(UUIDType) },
      dto: { type: new GraphQLNonNull(ChangeUserInputType) },
    },
    resolve: async (source, { id, dto }: ChangeUser, { prisma }) =>
      await prisma.user.update({ where: { id }, data: dto }),
  },

  deleteUser: {
    type: GraphQLBoolean,
    args: { id: { type: new GraphQLNonNull(UUIDType) } },
    resolve: async (source, { id }: ID, { prisma }) =>
      !!(await prisma.user.delete({ where: { id } })),
  },
};
