import User from "../../models/userModel.js"

export const deleteUser = async (req, res) => {
  const _id = req.params.id

  try {
    let existingUser = await User.findById(_id).exec()
    if(!existingUser) return res.status(404).json({message: "This user doesn't exist."})

    await existingUser.delete()

    return res.status(200).json({message: "User deleted successfully"})

  } catch (error) {
    return res.status(500).json({message: "Something went wrong withe our server while deleting the User!"})
  }

}