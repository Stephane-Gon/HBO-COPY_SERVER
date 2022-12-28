import User from "../../models/userModel.js";

export const replacePin = async (req, res) => {
  const { _id, oldPin, newPin } = req.body
  if(!oldPin || !newPin) return res.status(400).json({message: "Missing a PIN!"})

  if(newPin.length > 4) return res.status(400).json({message: "The pin nedds to be exactly 4 characters. "})

  try {
    let existingUser = await User.findById(_id).exec()    
    if(!existingUser) return res.status(401).json({message: "No user with that ID"})
    if(oldPin !== existingUser.pin) return res.status(401).json({message: "That is not your current PIN!"})
    
    existingUser.pin = newPin

    const updatedUser = await existingUser.save()
    delete updatedUser._doc.password
    delete updatedUser._doc.refreshToken

    return res.status(200).json({
      user: {...updatedUser._doc},
      message: `PIN successfully replaced!` 
    })
  } catch (error) {
    return res.status(500).json({message: "Something went wrong with our server while replacing your Pin!"})
  }

}