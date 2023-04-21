// Need to display constraint to our user for quantity & color values
export const handleColorQuantityPresence = (quantity, color) => {
  if (quantity <= 0 || color === '') throw new Error('La quantité et la couleur doivent être spécifiées')
}

export const handleQuantityMaxError = (quantity) => {
  if (quantity > 100) throw new Error('La quantité ne doit pas dépasser 100')
}

export const handleQuantitySumError = (initialQuantity, sumQuantity) => {
  if (sumQuantity > 100) {
    throw new Error(`Votre panier contient déjà ${initialQuantity} de ce produit, le total ne peut pas dépasser 100, merci de retirer des produits avant de passer commande`)
  }
}
