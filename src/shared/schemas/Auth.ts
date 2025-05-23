import {UserSchema} from './UserSchema.js'

export const RegisterRequestSchema = UserSchema.pick({
    username: true,
    email: true,
    password: true,
})

export const LoginRequestSchema = UserSchema.pick({
    username: true,
    password: true,
})
