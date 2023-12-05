const mongo = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongo.Schema(
    {
        userName: {
            type: String,
            unique: [true, "That username is already taken, try another"],
            required: [true, "Please provide your username"]
        }, 
        password: {
            type: String,
            required: [true, "Please provide a password"]
        },
        role: {
            type: String,
            default: 'client'
            // employee & admin are other two types
        }
    }
)

userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 10);
    }
    next();
})

const User = mongo.model('user', userSchema);
module.exports = User;