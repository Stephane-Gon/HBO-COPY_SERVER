import User from "../../models/userModel.js"

export const addPin = async (req, res) => {
  const { pin, _id } = req.body
  if(!pin) return res.status(400).json({message: "A pin is required!"})

  if(pin.length > 4) return res.status(400).json({message: "The pin nedds to be exactly 4 characters. "})

  try {

    let existingUser = await User.findById(_id).exec()
    if(!existingUser) return res.status(401).json({message: "No user with that ID"})
    
    existingUser.pin = pin

    const updatedUser = await existingUser.save()
    delete updatedUser._doc.refreshToken
    delete updatedUser._doc.password


    return res.status(200).json({
      user: {...updatedUser._doc},
      message: `New Pin added!` 
    })
  } catch (error) {
    return res.status(500).json({message: "Something went wrong with our server while creating a new Pin!"})
  }
}