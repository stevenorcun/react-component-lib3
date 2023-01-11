export const APP_ROUTES = {
  dashboard: {
    path: '/dashboard',
    component: 'Dashboard',
  },
  case: {
    path: '/case/:id',
    component: 'Case',
  },
  inbox: {
    path: '/inbox',
    component: 'Inbox',
  },
  faq: {
    path: '/faq',
    component: 'FAQ',
  },
  browser: {
    path: '/browser',
    component: 'Browser',
  },
  graph: {
    path: '/graph',
    component: 'Graph',
  },
  map: {
    path: '/map',
    component: 'Map',
  },
  explorer: {
    path: '/explorer',
    component: 'Explorer',
  },
  media: {
    path: '/media',
    component: 'Media',
  },
  calcul: {
    path: '/calcul',
    component: 'Calcul',
  },
  note: {
    path: '/note',
    component: 'Note',
  },
  communication: {
    path: '/communication',
    component: 'Communication',
  },
  requisition: {
    path: '/requisition',
    component: 'Requisition',
  },
  settings: {
    path: '/settings',
    component: 'Settings',
  },
  login: {
    path: '/login',
    component: 'Login',
  },
  list: {
    path: '/lists',
    component: 'List',
  },
};

export const EXTERNAL_APP_ROUTE = '/external/:url';
