import User from "../../models/userModel.js"

//* CONTROLLER THAT GETS ALL USERS
export const getUsers = async (req, res) => {

  try {
    const allUsers = await User.find({}, 'firstName lastName createdAt email').exec()

    res.status(200).json(allUsers)
  } catch (error) {
    console.log(error.message)
    res.status(500).json({message: 'Something went wrong!'}) 
  }
}
