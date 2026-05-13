import { paths } from 'src/routes/paths';

import { Iconify } from 'src/components/iconify';

const icon = (name: string) => <Iconify icon={name} />;

const ICONS = {
  reportTemplate: icon('ic-file'), // Customize icon as needed
};

export const reportTemplateNavData = [
  {
    subheader: 'Master',
    items: [
      {
        title: 'Report Template',
        path: paths.dashboard.reportTemplate.root,
        icon: ICONS.reportTemplate,
        children: [
          {
            title: 'list',
            path: paths.dashboard.reportTemplate.list,
          },
          {
            title: 'create',
            path: paths.dashboard.reportTemplate.new,
          },
        ],
      },
    ],
  },
];
