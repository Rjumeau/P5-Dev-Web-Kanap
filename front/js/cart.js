import { getProduct } from "./api.js"

const cleanCart = (cart) => {
  const sanitizedCart = cart.filter(item => item.color !== "" && item.quantity !== "0")
  return removeDuplicatesAndSumQuantities(sanitizedCart)
}

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

const createProductArticle = (product) => {
  const productArticle = document.createElement("article")
  productArticle.classList.add("cart__item")
  productArticle.setAttribute("data-id", product.id)
  productArticle.setAttribute("data-color", product.color)

  return productArticle
}

const createProductImg = (productData) => {
  const productImgDiv = document.createElement("div")
  productImgDiv.classList.add("cart__item__img")
  const productImg = document.createElement("img")
  productImg.src = productData.imageUrl
  productImg.alt = productData.altTxt

  productImgDiv.append(productImg)

  return productImgDiv
}

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

  productQuantitySettings.append(document.createElement("p").innerText = "Qté:")
  productQuantitySettings.append(productQuantityInput)

  return productQuantitySettings
}

const createProductDelete = () => {
  const productDeleteSettings = document.createElement("div")
  productDeleteSettings.classList.add("cart__item__content__settings__delete")

  const productDeleteText = document.createElement("p")
  productDeleteText.classList.add("deleteItem")
  productDeleteText.innerText = "Supprimer"

  productDeleteSettings.append(productDeleteText)
  return productDeleteSettings
}

const createProductCartSettings = (product) => {
  const productContentSettings = document.createElement("div")
  productContentSettings.classList.add("card__item__content__settings")

  const productQuantitySettings = createProductQuantity(product)

  const productDeleteSettings = createProductDelete()


  productContentSettings.append(productQuantitySettings)
  productContentSettings.append(productDeleteSettings)
  return productContentSettings
}

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



const storageCart = localStorage.getItem('cart')
const cartParent = document.querySelector("#cart__items")
if (storageCart) {
  const cart = JSON.parse(storageCart)
  insertCartProducts(cleanCart(cart))
} else {
  const emptyCartText = document.createElement("p")
                                .innerText("Votre panier est vide")
  cartParent.append(emptyCartText)
}
