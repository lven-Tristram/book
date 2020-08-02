import Vue from 'vue'
import VueRouter from 'vue-router'

// const Home = ()=>import('views/Home');
Vue.use(VueRouter)



const routes = [
  {
    path:'',
    redirect:'/store'
  },
  {
    path: '/ebook',
    component: ()=>import('views/book/index'),
    children: [
      {
        path:':fileName',
        component:()=>import('components/eBook/eBookReader')
      }
    ]
  },
  {
    path:'/store',
    component:()=>import('views/store/index'),
    redirect:'./store/shelf',
    children:[
      {
        path:'home',
        component:()=>import('views/store/StoreHome')
      },
      {
        path:'shelf',
        component:()=>import('views/store/StoreShelf')
      },
      {
        path:'list',
        component:()=>import('views/store/StoreList')
      },
      {
        path:'detail',
        component:()=>import('views/store/StoreDetail')
      },
      {
        path:'category',
        component:()=>import('views/store/StoreCategory')
      },
      {
        path:'speaking',
        component:()=>import('views/store/StoreSpeaking')
      }
    ]
  },

]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
