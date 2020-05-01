
const routes = [
  {
    path: '/login',
    beforeEnter() {location.href = 'localhost:6401/auth/google'}
  },
  {
    path: '/logout',
    beforeEnter() {location.href = 'localhost:6401/auth/logout'}
  },
  {
    path: '/',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Login.vue') },
      { path: 'help', component: () => import('pages/Help.vue') }
    ]
  },
  {
    path: '/app',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Dashboard.vue') },
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
