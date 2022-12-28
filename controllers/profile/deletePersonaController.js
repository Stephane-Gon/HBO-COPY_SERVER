import User from "../../models/userModel.js";

export const deletePersona = async ( req, res) => {
  const { personaId } = req.params

  try {
    
    let existingUser = await User.findOne({ "persona._id":personaId }).exec()
    if(!existingUser) return res.status(404).json({message: "No user with that id!"})

    const newPersonaArray = existingUser.persona.filter((person) => !person._id.equals(personaId))

    existingUser.persona = newPersonaArray
    const updatedUser = await existingUser.save()

    delete updatedUser._doc.password
    delete updatedUser._doc.refreshToken

    return res.status(200).json({
      user: {...updatedUser._doc},
      personaId,
      message: `Persona deleted!` 
    })

  } catch (error) {
    return res.status(500).json({message: "Something went wrong with our server while deleting a Persona!"})
  }

}