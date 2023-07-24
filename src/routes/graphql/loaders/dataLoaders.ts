import DataLoader from 'dataloader';
import { PrismaClient, MemberType, Post, Profile, User } from '@prisma/client';
import { batchPosts, batchProfile, batchMember, batchUser } from './batchs.js';

export interface DataLoaders {
  postsLoader: DataLoader<string, Post[]>;
  profileLoader: DataLoader<string, Profile>;
  memberLoader: DataLoader<string, MemberType>;
  userLoader: DataLoader<string, User>;
}

export const createDataLoaders = (prisma: PrismaClient): DataLoaders => ({
  postsLoader: new DataLoader(batchPosts(prisma)),
  profileLoader: new DataLoader(batchProfile(prisma)),
  memberLoader: new DataLoader(batchMember(prisma)),
  userLoader: new DataLoader(batchUser(prisma)),
});
