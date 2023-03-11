import bugApp from '../pages/BugIndex.js'
import bugEdit from '../pages/BugEdit.js'
import bugDetails from '../pages/BugDetails.js'

const routes = [
	{ path: '/', redirect: '/bug' },
	{ path: '/bug', component: bugApp },
	{ path: '/bug/edit/:bugId?', component: bugEdit },
	{ path: '/bug/:bugId', component: bugDetails },
]

export const router = VueRouter.createRouter({ history: VueRouter.createWebHashHistory(), routes })
