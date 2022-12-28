import jwt from 'jsonwebtoken';

export const verifyJwt = (req, res, next) => {
  console.log('Verify JWT Middleware!')
  const authHeader = req.headers.authorization || req.headers.Authorization

  if(!authHeader?.startsWith("Bearer ")) {
    return res.sendStatus(401)
  }

  const token = authHeader.split(' ')[1]
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err, decoded) => {
      if(err) return res.sendStatus(403) // Invalid Token

      req._id = decoded.UserInfo._id
      next()
    }
  )
}
