import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../../models/userModel.js';

export const handleLogin = async (req, res) => {
  const cookies = req.cookies
  const { email, password } = req.body
  if(!email || !password) return res.status(400).json({"message": "Email and password are required"})

  const existingUser = await User.findOne({ email }).exec()
  if(!existingUser) return res.status(401).json({"message": "No user with that email!"})

  const match = await bcrypt.compare(password, existingUser.password)
  if(!match) {
    return res.status(401).json({message: "Password is not correct"})
  }

  const access_token = jwt.sign(
    {
      "UserInfo": {
        "_id" : existingUser._id
      }
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15m'}
  );

  const newRefreshToken = jwt.sign(
    { "email" :  existingUser.email},
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '1d'}
  );

  let newRefreshTokenArray = !cookies?.jwt ? existingUser.refreshToken : existingUser.refreshToken.filter(rt => rt !== cookies.jwt)

  if (cookies?.jwt) {
    const cookieRefreshToken = cookies.jwt
    const foundToken = await User.findOne({ refreshToken : cookieRefreshToken }).exec()

    if(!foundToken) {
      // It means the REFRESH_TOKEN was already used
      newRefreshTokenArray = []
    }
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true }) // remover secure para usar Thunder Client 
  }

  existingUser.refreshToken = [...newRefreshTokenArray, newRefreshToken]
  const result = await existingUser.save()
  
  delete result._doc.password
  delete result._doc.refreshToken

  res.cookie('jwt', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000}); // remover secure para usar Thunder Client 
  
  return res.status(200).json({ 
    user: { ...result._doc }, 
    access_token,
    message: `You are logged in as ${result._doc.firstName} ${result._doc.lastName}`
  })
}