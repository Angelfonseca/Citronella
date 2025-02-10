const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/HomeView.vue') },
      { path: '/dresses', component: () => import('pages/DressesView.vue') },
      { path: '/jewelry', component: () => import('pages/JewelryView.vue') },
      { path: '/rentals', component: () => import('pages/RentalsView.vue') },
      { path: '/sales', component: () => import('src/pages/SalesView.vue') },
      { path: '/contact', component: () => import('pages/ContactView.vue') },
      { path: '/admin', component: () => import('pages/AdminView.vue') },
      { path: '/add-product', component: () => import('pages/AddProductsView.vue') },
    ]
  },
  { path: '/login', component: () => import('pages/LoginView.vue') },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
