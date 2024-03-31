import { createRouter, createWebHistory } from 'vue-router';
import TextTool from '../views/TextTool.vue'; // Ensure this component exists
import ColorTool from '../views/ColorTool.vue'; // Ensure this component exists

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/texttool',
      name: 'texttool',
      component: TextTool // Route for TextTool
    },
    {
      path: '/colortool',
      name: 'colortool',
      component: ColorTool // Route for ColorTool
    }
    // Add more routes as needed
  ]
})

export default router;