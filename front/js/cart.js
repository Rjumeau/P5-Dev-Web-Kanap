const filterDuplicateProducts = (cart) => {
  cart.filter
}


const storageCart = localStorage.getItem('cart')
const cartParent = document.querySelector("#cart__items")
if (storageCart) {
  const cart = JSON.parse(storageCart)
  console.log(cart)
} else {
  const emptyCartText = document.createElement("p")
                                .innerText("Votre panier est vide")
  cartParent.append(emptyCartText)
}
