import User from "../../models/userModel.js";

export const deleteFavorite = async (req, res) => {
  const { type, id, userId, personaId, } = req.body

  if(!id || !userId || !personaId) return res.status(400).json({message: "Missing vital information!"})

  try {
    let existingUser = await User.findById(userId).exec()
    if(!existingUser) return res.status(401).json({message: "No user with that ID"})

    let index = existingUser.persona.findIndex((p) => p._id.equals(personaId))

    let newFavoritesArray = existingUser.persona[index].favorites.filter((fav) => fav.id !== id)
    existingUser.persona[index].favorites = newFavoritesArray

    const updatedUser = await existingUser.save()
    delete updatedUser._doc.password
    delete updatedUser._doc.refreshToken

    return res.status(200).json({
      user: {...updatedUser._doc},
      message: `${type} deleted from favorites!` 
    })        

  } catch (error) {
    return res.status(500).json({message: "Something went wrong with our server while deleting item from favorites!"})
  }
}