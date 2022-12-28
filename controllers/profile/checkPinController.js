import User from "../../models/userModel.js"

export const checkPin = async (req, res) => {
  const { pin, _id } = req.body
  if(!pin) return res.status(400).json({message: "A pin is required!"})

  if(pin.length > 4) return res.status(400).json({message: "The pin nedds to be exactly 4 characters. "})

  try {

    let existingUser = await User.findOne({ _id, pin }).exec()
    if(!existingUser) return res.status(401).json({message: "No user with that ID or Wrong PIN"})
    
    delete existingUser._doc.password
    delete existingUser._doc.refreshToken

    return res.status(200).json({
      user: {...existingUser._doc},
      message: "Valid Pin"
    })
  } catch (error) {
    return res.status(500).json({message: "Something went wrong with our server while checking your Pin!"})
  }
}