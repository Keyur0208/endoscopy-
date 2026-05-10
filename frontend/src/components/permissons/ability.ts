import type { MongoAbility } from '@casl/ability';

import { AbilityBuilder, createMongoAbility } from '@casl/ability';

type Action = string;
type Subject = string;

export type AppAbility = MongoAbility<[Action, Subject]>;

export const createAppAbility = (isAdmin: boolean, permissionKeys: string[] = []): AppAbility => {
  const { can, rules } = new AbilityBuilder<AppAbility>(createMongoAbility);

  if (isAdmin) {
    can('manage', 'all');
  } else {
    permissionKeys.forEach((permissionKey) => {
      const [subject, action] = permissionKey.split(':') as [Subject, Action];
      if (subject && action) can(action, subject);
    });
  }

  return createMongoAbility(rules);
};
