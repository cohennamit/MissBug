'use strict'
import { bugService } from '../services/bug.service.js'
import { utilService } from '../services/util.service.js'
import bugList from '../cmps/BugList.js'
import bugFilter from '../cmps/BugFilter.js'

export default {
	template: `
    <section class="bug-app">
        <div class="subheader">
          <bug-filter @setFilterBy="setFilterBy"></bug-filter> ||
          <router-link to="/bug/edit">Add New Bug</router-link> 
        </div>
        <bug-list v-if="bugs" :bugs="bugs" @removeBug="removeBug"></bug-list>
		<button @click="getPage(-1)">Prev</button>
		<button @click="getPage(1)">Next</button>
        <!-- <bug-list v-if="bugs" :bugs="bugsToDisplay" @removeBug="removeBug"></bug-list> -->
    </section>
    `,
	data() {
		return {
			bugs: [],
			filterBy: { title: '', page: 0 },
		}
	},
	created() {
		this.loadBugsLater = utilService.debounce(this.loadBugs, 700)
		this.loadBugs()
	},
	methods: {
		getPage(dir) {
			if (this.bugs.length !== 3 && dir > 0) {
				return
			}
			this.filterBy.page += dir
			if (this.filterBy.page < 0) this.filterBy.page = 0
			this.loadBugs()

		},
		loadBugs() {
			bugService.query(this.filterBy)
				.then((bugs) => {
					this.bugs = bugs
				})
		},
		setFilterBy(filterBy) {
			this.filterBy = filterBy
			this.loadBugsLater()
		},
		removeBug(bugId) {
			bugService.remove(bugId).then(() => this.loadBugs())
		},
	},
	computed: {
		bugsToDisplay() {
			let bugs
			if (!this.filterBy?.title) return this.bugs
			else {
				const regex = new RegExp(this.filterBy.title, 'i')
				bugs = this.bugs.filter(bug => regex.test(bug.title))
			}
			return bugs
			// return this.bugs.filter((bug) => bug.title.includes(this.filterBy.title))
		},
	},
	components: {
		bugList,
		bugFilter,
	},
}
