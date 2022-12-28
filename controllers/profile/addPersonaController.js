import User from "../../models/userModel.js"

export const addPersona = async (req, res) => {
  const { name, isChild, age, _id } = req.body
  if(!name) return res(400).json({message: "Name is required to create a new persona!"})

  try {

    let existingUser = await User.findById(_id).exec()
    if(!existingUser) return res.status(401).message({message: "No user with that ID"})
    
    let duplicateName = existingUser.persona.find((person) => name === person.name)
    if(duplicateName) return res.status(400).json({message: 'That name is already in use for one of your personas.'})

    let customeAgeRestriction
    if(age < 10) {
      customeAgeRestriction = 7
    } else if(age < 13) {
      customeAgeRestriction = 10
    } else if(age < 16) {
      customeAgeRestriction = 13
    } else if(age < 18) {
      customeAgeRestriction = 16
    } else {
      customeAgeRestriction = 18
    }

    const newPersona = {
      name,
      favorites: [],
      age,
      isChild,
      ageRestriction: customeAgeRestriction
    }
    existingUser.persona = [...existingUser.persona, newPersona]

    const updatedUser = await existingUser.save()

    delete updatedUser._doc.password
    delete updatedUser._doc.refreshToken

    return res.status(200).json({
      user: {...updatedUser._doc},
      message: `New persona ${name} added!` 
    })
  } catch (error) {
    return res.status(500).json({message: "Something went wrong with our server while creating a new Persona!"})
  }
}