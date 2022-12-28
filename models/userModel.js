import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  firstName: {type: String, required: true},
  lastName: String,
  email: {type: String, required: true},
  password: {type: String, required: true},
  createdAt: {type: Date, default: new Date()},
  age: {type: Number, required: true},
  pin: String,
  persona: [{
    name: {
      type: String,
      required: true
    },
    favorites: {
      type: [Object]
    },
    age: Number,
    ageRestriction: {
      type: Number,
      default: 18
    },
    isChild: {
      type: Boolean,
      required: true,
      default: false
    }
  }],
  refreshToken : [String]
})

const User = mongoose.model('User', userSchema)

export default User