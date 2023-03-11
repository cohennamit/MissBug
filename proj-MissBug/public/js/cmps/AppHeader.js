'use strict'

import { userService } from "../services/user.service.js"
import { eventBus, showErrorMsg } from "../services/event-bus.service.js"

import LoginSignup from "./LoginSignup.js"

export default {
    template: `
        <header>
            <h1>Miss Bug</h1> 
            <section v-if="loggedinUser">
                <pre>{{loggedinUser}}</pre>
                <button @click="logout">Logout</button>

            </section>
            <section v-else>
                <LoginSignup @onChangeLoginStatus="changeLoginStatus"/>
                <!-- <button @click="login">Login</button>
                <button @click="signup">Signup</button> -->
            </section>

        </header>
    `,
    data() {
        return {
            loggedinUser: userService.getLoggedInUser()
        }
    },
    methods: {
        changeLoginStatus() {
            this.loggedinUser = userService.getLoggedInUser()
        },
        // login() {
        //     const username = prompt('Username', 'puki')
        //     const password = prompt('Password?', '123')
        //     const credentials = {
        //         username,
        //         password
        //     }
        //     userService.login(credentials)
        //         .then(user => {
        //             this.loggedinUser = user
        //         })
        // },
        logout() {
            userService.logout()
                .then(() => {
                    this.loggedinUser = null
                })
                .catch(err => {
                    showErrorMsg('invalid username/password')
                })
        },
        // signup() {
        //     const username = prompt('Username', 'puki')
        //     const password = prompt('Password?', '123')
        //     const credentials = {
        //         username,
        //         password,
        //     }
        //     userService.signup(credentials)
        //         .then((user) => {
        //             this.loggedinUser = user
        //         })
        // },
    },
    components: {
        LoginSignup
    }
}
