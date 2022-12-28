import User from "../../models/userModel.js"

export const logOut = async (req, res) => {
  const cookies = req.cookies
  if(!cookies?.jwt) return res.status(200).json({"message": "No User to Logout or google Logout!"})

  try {
    const cookieRefreshToken = cookies.jwt

    // Delete refresh token in request cookie
    const existingUser = await User.findOne({ refreshToken: cookieRefreshToken }).exec()
    if(!existingUser) {
      res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
      return res.status(200).json({"message": "User already Logged Out"})
    }

    //* Delete refresh token in DB
    existingUser.refreshToken = existingUser.refreshToken.filter(rt => rt !== cookieRefreshToken)
    await existingUser.save()

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    return res.status(200).json({message: "Logout Successful!"})
  } catch (err) {
    return res.status(500).json({message: "Something went wrong with our server, during logout!"})
  }
  
}