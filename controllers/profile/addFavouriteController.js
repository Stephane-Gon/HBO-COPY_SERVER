import User from "../../models/userModel.js"

export const addFavorite = async (req, res) => {
  const { type, img, name, id, seasonN, epN, userId, personaId, showId } = req.body

  if(!id || !userId || !personaId) return res.status(400).json({message: "Missing vital information!"})

  try {
    let existingUser = await User.findById(userId).exec()
    if(!existingUser) return res.status(401).json({message: "No user with that ID"})

    let newFavorite = {
      type,
      img,
      name,
      seasonN,
      epN,
      id,
      showId
    }

    let index = existingUser.persona.findIndex((p) => p._id.equals(personaId))

    let isAlreadyFav = existingUser.persona[index].favorites.find((fav) => fav.id === id)
    if (isAlreadyFav) return res.status(401).json({message: `This ${type} is already a favorite.`})    

    let newFavoriteArray =  [...existingUser.persona[index].favorites, newFavorite]

    existingUser.persona[index].favorites = newFavoriteArray

    const updatedUser = await existingUser.save()
    delete updatedUser._doc.password
    delete updatedUser._doc.refreshToken

    return res.status(200).json({
      user: {...updatedUser._doc},
      message: `New ${type} added to favorites!` 
    })        
  } catch (error) {
    return res.status(500).json({message: "Something went wrong with our server while adding item to favorites!"})
  }
}