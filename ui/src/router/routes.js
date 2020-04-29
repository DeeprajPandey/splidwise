
const routes = [
  {
    path: '/',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Login.vue') },
      { path: 'register', component: () => import('pages/Register.vue') }
    ]
  },
  {
    path: '/app',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'dashboard', component: () => import('pages/Dashboard.vue') },
      { path: 'pay', component: () => import('pages/Pay.vue') },
      { path: 'unapproved', component: () => import('pages/Unapproved.vue') },
      { path: 'help', component: () => import('pages/Help.vue') }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
