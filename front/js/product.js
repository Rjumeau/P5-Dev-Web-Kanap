import { getProduct } from "./api.js"
import { handleColorQuantityPresence, handleQuantityMaxError, handleQuantitySumError } from "./error.js"

// === PRODUCT CONTENT CREATION FUNCTIONS ===
const insertProductImg = async(product) => {
  const imgParent = document.querySelector(".item__img")
  const productImg = document.createElement("img")

  productImg.src = product.imageUrl
  productImg.alt = product.altTxt

  imgParent.append(productImg)
}

const insertTextContent = (selector, text) => {
  const element = document.querySelector(selector)
  if (element) {
    element.innerText = text;
  } else {
    console.error(`Element not found for selector ${selector}`);
  }
}

const insertColorOptions = (colors) => {
  const colorsParent = document.querySelector("#colors")
  colors.forEach(color => {
    const colorOption = document.createElement("option")
    colorOption.value = color
    colorOption.innerText = color
    colorsParent.append(colorOption)
  });
}


const insertProductContent = async(id) => {
  const product = await getProduct(id)
  insertProductImg(product)

  insertTextContent("#price", product.price)
  insertTextContent("#title", product.name)
  insertTextContent("#description", product.description)

  insertColorOptions(product.colors)
}

// === ADD CART CONTENT FUNCTIONS ===

const addProductToCart = (id) => {
  const cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : []
  const quantity = document.querySelector("#quantity").value
  const color = document.querySelector('#colors').value
  const sameProduct = cart.find(product => product.id === id && product.color === color)

  try {
    handleColorQuantityPresence(quantity, color)
    handleQuantityMaxError(quantity)

    if (sameProduct) {
      const initialQuantity = sameProduct.quantity
      sameProduct.quantity = parseInt(sameProduct.quantity) + parseInt(quantity)

      handleQuantitySumError(initialQuantity, sameProduct.quantity)
    } else {
      const cartItem = { id: id, quantity: quantity, color: color }
      cart.push(cartItem)
    }

    localStorage.removeItem("cart")
    localStorage.setItem("cart", JSON.stringify(cart))
    window.alert('Votre produit a bien été ajouté au panier')
  } catch (error) {
    window.alert(error.message)
  }
}

// === Fetch data from product and add user input to cart ===
const productUrl = new URL(window.location.href)
const productId = productUrl.searchParams.get("id")
insertProductContent(productId)
document.querySelector("#addToCart").addEventListener('click', () => addProductToCart(productId))
