export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters?: string) => [...userKeys.lists(), { filters }] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  potentialFriends: (email?: string) => [...userKeys.all, 'potential-friends', email] as const,
  byEmail: (email?: string) => [...userKeys.all, 'by-email', email] as const,
  byEmails: (emails?: string[]) => [...userKeys.all, 'by-emails', emails] as const,
};
