import { MemberType, Post, PrismaClient, Profile } from '@prisma/client';
import { MemberTypeId } from '../../member-types/schemas.js';

export const batchPosts =
  (prisma: PrismaClient) => async (userIds: readonly string[]) => {
    const posts = await prisma.post.findMany({
      where: { authorId: { in: userIds as string[] } },
    });

    const result: Record<string, Post[]> = posts.reduce((acc, post) => {
      acc[post.authorId] = [...(acc[post.authorId] || []), post];
      return acc;
    }, {});

    return Array.from(userIds, (id) => result[id] || []);
  };

export const batchProfile =
  (prisma: PrismaClient) => async (userIds: readonly string[]) => {
    const profiles = await prisma.profile.findMany({
      where: { userId: { in: userIds as string[] } },
    });

    return userIds.map((id) =>
      profiles.find((profile) => profile.userId === id),
    ) as Profile[];
  };

export const batchMember =
  (prisma: PrismaClient) => async (memberTypeIds: readonly MemberTypeId[]) => {
    const memberTypes = await prisma.memberType.findMany({
      where: { id: { in: memberTypeIds as MemberTypeId[] } },
    });

    return memberTypeIds.map((id) =>
      memberTypes.find((type) => type.id === id),
    ) as MemberType[];
  };

export const batchUser = (prisma: PrismaClient) => async (ids: readonly string[]) => {
  const users = await prisma.user.findMany({
    where: { id: { in: ids as string[] } },
    include: { userSubscribedTo: true, subscribedToUser: true },
  });

  return ids.map(
    (id) =>
      users.reduce((acc, user) => {
        acc[user.id] = user;
        return acc;
      }, {})[id],
  );
};
