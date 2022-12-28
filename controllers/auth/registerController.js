import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';

import User from '../../models/userModel.js'

//* CONTROLLER THAT CREATES NEW USER
export const register = async (req, res) => {
  const cookies = req.cookies
  const {email, firstName, lastName, age, password, confirmPassword, createdAt} = req.body
  if(!email || !firstName || !age || !password || !confirmPassword) {
    return res.status(400).json({message: "Email, First Name, Age, Password and Confirm Password are required!"})
  }

  try {
    const existingUser = await User.findOne({email}).exec()
    if(existingUser) {
      return res.status(409).json({message: 'User already exists!'})
    }

    if(password !== confirmPassword) {
      return res.status(400).json({message: "Passwords don't match!"})
    }
    const hashedPass = await bcrypt.hash(password, 12)

    if (cookies?.jwt) {
      const cookieRefreshToken = cookies.jwt
      const foundToken = await User.findOne({ refreshToken : cookieRefreshToken }).exec()
      
      if(foundToken) {
        foundToken.refreshToken = []
        await foundToken.save()
      }
      res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    }

    const newPersona = {
      name: `${firstName} ${lastName}`,
      favorites: [],
      age
    }

    const refreshToken = jwt.sign(
      { "email" :  email},
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d'}
    );

    const newUser = await User.create({
      email,
      firstName,
      lastName,
      age,
      createdAt,
      refreshToken,
      persona: newPersona,
      password: hashedPass
    })
    delete newUser._doc.password
    delete newUser._doc.refreshToken

    const access_token = jwt.sign(
      {
        "UserInfo": {
          "_id" : newUser._id
        }
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m'}
    );

    res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000});
    return res.status(200).json({ 
      user: { ...newUser._doc }, 
      access_token,
      message: `Account created as ${newUser._doc.firstName, newUser._doc.lastName}!`
    })
  } catch (error) {
    res.status(500).json({message: 'Something went wrong with our server. Try again later.', error})
  }
}
