import { showErrorMsg } from "../services/event-bus.service.js"
import { userService } from "../services/user.service.js"

export default {
    template: `
    <section class="login-signup">
        <p>Login/Signup</p>
        <form  @submit.prevent="login">
            <p>Login</p>
            <input type="text" v-model="credentials.username" placeholder="Username" />
            <input type="password" v-model="credentials.password" placeholder="Password" />
            <button>Login</button>
        </form>
        <hr />
        <form  @submit.prevent="signup">
            <p>Signup</p>
            <input type="text" v-model="signupInfo.fullname" placeholder="Full name" />
            <input type="text" v-model="signupInfo.username" placeholder="Username" />
            <input type="password" v-model="signupInfo.password" placeholder="Password" />
            <button>Signup</button>
        </form>
    </section>
    `,
    data() {
        return {
            credentials: {
                username: 'puki',
                password: '123'
            },
            signupInfo: {
                fullname: '',
                username: '',
                password: ''
            }
        }
    },
    methods: {
        login() {
            userService.login(this.credentials)
                .then(user => {
                    this.$emit('onChangeLoginStatus')
                })
                .catch(err => {
                    console.log('Cannot login', err)
                    showErrorMsg(`Cannot login`)
                })
        },
        signup() {
            userService.signup(this.signupInfo)
                .then(user => {
                    this.$emit('onChangeLoginStatus')
                })
                .catch(err => {
                    console.log('Cannot signup', err)
                    showErrorMsg(`Cannot signup`)
                })
        },
    }

}

