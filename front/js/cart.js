import { getProduct } from "./api.js"

// === Sanitize cart before display it ===

const cleanCart = (cart) => {
  // filter empty values
  const sanitizedCart = cart.filter(item => item.color !== "" && item.quantity !== "0")
  const newCart = removeDuplicatesAndSumQuantities(sanitizedCart)
  // clean local storage et add new cart with sanitized values
  localStorage.clear()
  localStorage.setItem('cart', JSON.stringify(newCart))
  return JSON.parse(localStorage.getItem('cart'))
}

// remove duplicates product and sum it quantity before remove it
const removeDuplicatesAndSumQuantities = (cart) => {
  let newCart = []

  cart.forEach((item) => {
    const index = newCart.findIndex(
      (el) => el.id === item.id && el.color === item.color
    )

    if (index === -1) {
      newCart.push(item);
    } else {
      newCart[index].quantity =
        parseInt(newCart[index].quantity) + parseInt(item.quantity);
    }
  })

  return newCart
}

// === Product creation stuff ===

// <article>
const createProductArticle = (product) => {
  const productArticle = document.createElement("article")
  productArticle.classList.add("cart__item")
  productArticle.setAttribute("data-id", product.id)
  productArticle.setAttribute("data-color", product.color)

  return productArticle
}

// <img>
const createProductImg = (productData) => {
  const productImgDiv = document.createElement("div")
  productImgDiv.classList.add("cart__item__img")
  const productImg = document.createElement("img")
  productImg.src = productData.imageUrl
  productImg.alt = productData.altTxt

  productImgDiv.append(productImg)

  return productImgDiv
}

// title, description and price
const createProductContent = (productData) => {
  const productContentDiv = document.createElement("div")
  productContentDiv.classList.add("cart__item__content")
  const productContentDescription = document.createElement("div")
  productContentDescription.classList.add("card__item__content__description")

  const productName = document.createElement("h2")
  productName.innerText = productData.name

  const productDescription = document.createElement("p")
  productDescription.innerText = productData.description

  const productPrice = document.createElement("p")
  productPrice.innerText = `${productData.price} €`

  productContentDescription.append(productName)
  productContentDescription.append(productDescription)
  productContentDescription.append(productPrice)

  productContentDiv.append(productContentDescription)

  return productContentDiv
}

// quantity
const createProductQuantity = (product) => {
  const productQuantitySettings = document.createElement("div")
  productQuantitySettings.classList.add("cart__item__content__settings__quantity")

  const productQuantityInput = document.createElement("input")
  productQuantityInput.setAttribute("type", "number")
  productQuantityInput.classList.add("itemQuantity")
  productQuantityInput.setAttribute("name", "itemQuantity")
  productQuantityInput.setAttribute("min", 1)
  productQuantityInput.setAttribute("max", 100)
  productQuantityInput.setAttribute("value", product.quantity)

  productQuantityInput.addEventListener('change', (event) => { updateProductQuantity(event) })

  productQuantitySettings.append(document.createElement("p").innerText = "Qté:")
  productQuantitySettings.append(productQuantityInput)

  return productQuantitySettings
}

// delete button
const createProductDelete = () => {
  const productDeleteSettings = document.createElement("div")
  productDeleteSettings.classList.add("cart__item__content__settings__delete")

  const productDeleteText = document.createElement("p")
  productDeleteText.classList.add("deleteItem")
  productDeleteText.innerText = "Supprimer"

  productDeleteText.addEventListener('click', (event) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit de votre panier ?')) {
      deleteProduct(event)
    }
  })
  productDeleteSettings.append(productDeleteText)
  return productDeleteSettings
}

// update quantity event
const updateProductQuantity = (event) => {
  // closest event
  const product = event.target.closest('product')
  const id = product.dataset.id
  const color = product.dataset.color

  const newQuantity = event.target.value
  const input = product.querySelector('input')
  input.setAttribute('value', newQuantity)

  const cart = JSON.parse(localStorage.getItem('cart'))
  const productToUpdate = cart.find(product => product.id === id && product.color === color)
  productToUpdate.quantity = parseInt(newQuantity)
  localStorage.clear()
  localStorage.setItem('cart', JSON.stringify(cart))
}

// delete product event
const deleteProduct = (event) => {
  const product = event.target.closest('article')
  const id = product.id
  product.innerHTML = ""

  const cart = JSON.parse(localStorage.getItem('cart'))
  const productToDelete = cart.find(product => product.id === id)
  const index = cart.indexOf(productToDelete)
  cart.splice(index, 1)

  localStorage.clear()
  localStorage.setItem('cart', JSON.stringify(cart))

  window.alert('Votre produit a bien été supprimé du panier')
  const sectionParent = document.querySelector("#cart__items")
  const emptyCartText = document.createElement("p")
  emptyCartText.classList.add('cart__item')
  emptyCartText.innerText = "Votre panier est vide"
  sectionParent.append(emptyCartText)
}

// append delete and quantity to product article
const createProductCartSettings = (product) => {
  const productContentSettings = document.createElement("div")
  productContentSettings.classList.add("card__item__content__settings")

  const productQuantitySettings = createProductQuantity(product)

  const productDeleteSettings = createProductDelete()


  productContentSettings.append(productQuantitySettings)
  productContentSettings.append(productDeleteSettings)
  return productContentSettings
}

// insert all content defined above to insert products in cart
const insertCartProducts = async(cart) => {
  const sectionParent = document.querySelector("#cart__items")
  cart.forEach(async (product) => {
    const productArticle = createProductArticle(product)

    const productData = await getProduct(product.id)
    const productImg = createProductImg(productData)
    const productContent = createProductContent(productData)
    const productCartSettings = createProductCartSettings(product)

    productArticle.append(productImg)
    productArticle.append(productContent)
    productArticle.append(productCartSettings)
    sectionParent.append(productArticle)
  })
}


// === Cart creation logic ===
const storageCart = localStorage.getItem('cart')
const sectionParent = document.querySelector("#cart__items")
if (storageCart && !storageCart.length === 0) {
  const cart = JSON.parse(storageCart)
  insertCartProducts(cleanCart(cart))
} else {
  const emptyCartText = document.createElement("p")
  emptyCartText.classList.add('cart__item')
  emptyCartText.innerText = "Votre panier est vide"
  sectionParent.append(emptyCartText)
}
