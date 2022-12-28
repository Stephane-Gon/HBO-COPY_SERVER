import jwt from 'jsonwebtoken';
import User from '../../models/userModel.js';

export const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies
  if(!cookies?.jwt) return res.sendStatus(401)

  const cookieRefreshToken = cookies.jwt
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })

  const existingUser = await User.findOne({ refreshToken : cookieRefreshToken }).exec()

  // Detected refresh token reuse!
  if(!existingUser) {
    jwt.verify(
      cookieRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if(err) return res.sendStatus(403) // Refresh token is expired
        const hackedUser = await User.findOne({ email: decoded.email}).exec()
        hackedUser.refreshToken = []

        await hackedUser.save()
      }
    )
    // User needs to login again.
    res.sendStatus(403) //Forbidden
  }

  const newRefreshTokenArray = existingUser.refreshToken.filter(rt => rt !== cookieRefreshToken)

  jwt.verify(
    cookieRefreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if(err) {
        existingUser.refreshToken = [...newRefreshTokenArray]
        await existingUser.save()
      }
      if (err || existingUser.email !== decoded.email) {
        return res.sendStatus(403)
      }

      // REFRESH TOKEN IS STILL VALID
      const access_token = jwt.sign(
        {
          "UserInfo": {
            "_id" : existingUser._id
          }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m'}
      )
      
      const newRefreshToken = jwt.sign(
        { "email" :  existingUser.email },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1d'}
      );
      existingUser.refreshToken = [...newRefreshTokenArray, newRefreshToken]
      const result = await existingUser.save()
      delete result._doc.password
      delete result._doc.refreshToken
      
      res.cookie('jwt', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000});
      res.status(200).json({ user: { ...result._doc }, access_token })
    }
  )
}