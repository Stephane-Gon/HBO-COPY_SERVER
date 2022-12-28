import User from "../../models/userModel.js"


export const updateUser = async (req, res) => {
  const _id = req.params.id
  const { firstName, lastName } = req.body
  if(!firstName) return res.status(400).json({"message": "First Name is required!"})

  try {
    let existingUser = await User.findById(_id).exec()
    if (!existingUser) {
      return res.status(401).json({message: "This user doesn't exist."})
    }

    existingUser.lastName = lastName
    existingUser.firstName = firstName
    const updatedUser = await existingUser.save()

    delete updatedUser._doc.password
    delete updatedUser._doc.refreshToken

    res.status(200).json({
      user: {...updatedUser._doc},
      message: "User info updated successfully"
    })
  } catch (error) {
    res.status(500).json({message: 'Something went wrong with our server, could not update user.'})
  }
  
}