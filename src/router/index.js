import { createRouter, createWebHistory } from 'vue-router';
import TextTool from '../views/TextTool.vue'; 
import ColorTool from '../views/ColorTool.vue'; 
import PostMortem from '../views/PostMortem.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/texttool',
      name: 'texttool',
      component: TextTool 
    },
    {
      path: '/colortool',
      name: 'colortool',
      component: ColorTool 
    },
    {
      path: '/postmortem',
      name: 'postmortem',
      component: PostMortem,
    }
  ]
})

export default router;