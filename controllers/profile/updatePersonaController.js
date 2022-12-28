import User from "../../models/userModel.js";

export const updatePersona = async (req, res) => {
  const { personaId } = req.params
  const { age, name, ageRestriction } = req.body

  if(!personaId || !name || !age || !ageRestriction) {
    return res.status(400).json({ message: "All fields must be filled!"})
  }

  try {
    let existingUser = await User.findOne({ "persona._id":personaId }).exec()
    if(!existingUser) return res.status(404).json({message: "No user with that id!"})

    const newPersonaArray = existingUser.persona.map((person) => {
      if(person._id.equals(personaId)) {
        person.name = name
        person.age = age
        person.ageRestriction = ageRestriction
      }
      return person
    })
    
    existingUser.persona = newPersonaArray
    const updatedUser = await existingUser.save()
    
    delete updatedUser._doc.password
    delete updatedUser._doc.refreshToken

    return res.status(200).json({
      user: {...updatedUser._doc},
      personaId,
      message: `Persona ${name} updated!` 
    })

  } catch (error) {
    return res.status(500).json({message: "Something went wrong with our server while updating a Persona!"})
    
  }
}