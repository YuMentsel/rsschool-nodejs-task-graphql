import { GraphQLBoolean, GraphQLNonNull } from 'graphql';
import { ChangePost, CreatePost, ID } from '../../types/interfaces.js';
import { PostType } from '../../types/posts/post.js';
import { CreatePostInputType, ChangePostInputType } from '../../types/posts/postInput.js';
import { UUIDType } from '../../types/uuid.js';

export const postMutationFields = {
  createPost: {
    type: PostType,
    args: { dto: { type: new GraphQLNonNull(CreatePostInputType) } },
    resolve: async (source, { dto }: CreatePost, { prisma }) =>
      await prisma.post.create({ data: dto }),
  },

  changePost: {
    type: PostType,
    args: {
      id: { type: new GraphQLNonNull(UUIDType) },
      dto: { type: new GraphQLNonNull(ChangePostInputType) },
    },
    resolve: async (source, { id, dto }: ChangePost, { prisma }) =>
      await prisma.post.update({ where: { id }, data: dto }),
  },

  deletePost: {
    type: GraphQLBoolean,
    args: { id: { type: new GraphQLNonNull(UUIDType) } },
    resolve: async (source, { id }: ID, { prisma }) =>
      !!(await prisma.post.delete({ where: { id } })),
  },
};
