export const transformNavForHorizontal = (navData: any[]) =>
  navData.map((section) => {
    const nestedItems = section.items?.map((item: any) => {
      const hasChildren = Array.isArray(item.children) && item.children.length > 0;

      return {
        title: item.title,
        path: item.path,
        icon: item.icon,
        ...(hasChildren ? { children: item.children } : {}),
      };
    });

    return {
      subheader: section.subheader,
      items: [
        {
          title: section.subheader,
          icon: section.items?.[0]?.icon || undefined,
          path: section.items?.[0]?.path || undefined,
          children: nestedItems,
        },
      ],
    };
  });

export const filterNavDataByPermissions = (
  navData: any[],
  isAdmin?: boolean,
  isOrganizationAdmin?: boolean
) => {
  // Super Admin → everything visible
  if (isAdmin) {
    return navData;
  }

  const alwaysVisibleSubheaders = ['Utility', 'Personal Hub'];

  return navData
    .map((section) => {
      if (isOrganizationAdmin) {
        if (section.subheader === 'Management') {
          return null;
        }

        return section;
      }

      if (['Management', 'Setup & Configuration', 'Master'].includes(section.subheader)) {
        return null;
      }

      const allowItemsWithoutPermissions = alwaysVisibleSubheaders.includes(section.subheader);

      const filteredItems = allowItemsWithoutPermissions
        ? section.items
        : section.items?.filter((item: any) => item.path);

      if (filteredItems.length > 0) {
        return {
          ...section,
          items: filteredItems,
        };
      }

      return null;
    })
    .filter(Boolean);
};
