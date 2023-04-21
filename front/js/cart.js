import { getProduct, postOrder } from "./api.js"
import { handleQuantityMaxError } from "./error.js"

const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const COMMON_REGEX = /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/ // firstName, lastName, city
const ADDRESS_REGEX = /^\d+\s(?:[a-zA-Z]+(?:[\s-][a-zA-Z]+)*)?$/


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

// article
const createProductArticle = (product) => {
  const productArticle = document.createElement("article")
  productArticle.classList.add("cart__item")
  productArticle.setAttribute("data-id", product.id)
  productArticle.setAttribute("data-color", product.color)

  return productArticle
}

// img
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

  productDeleteSettings.append(productDeleteText)
  return productDeleteSettings
}

// update quantity event
const updateProductQuantity = (event, cart) => {
  // closest event
  const product = event.target.closest('article')
  const id = product.dataset.id
  const color = product.dataset.color
  const productToUpdate = cart.find(product => product.id === id && product.color === color)

  try {
    const newQuantity = parseInt(event.target.value)
    handleQuantityMaxError(newQuantity)
    const input = product.querySelector('input')
    input.setAttribute('value', newQuantity)

    productToUpdate.quantity = newQuantity
    localStorage.clear()
    localStorage.setItem('cart', JSON.stringify(cart))

    insertCartTotal(cart)
  } catch(error) {
    window.alert(error.message)
    event.stopPropagation()
  }
}

const updateProductEvent = async(cart) => {
  const updateInputs = document.querySelectorAll('.itemQuantity')
  updateInputs.forEach((updateInput) => {
    updateInput.addEventListener('change', (event) => { updateProductQuantity(event, cart) })
  })
}

const deleteProductEvent = async(cart) => {
  const productDeleteButtons = document.querySelectorAll('.deleteItem')
  productDeleteButtons.forEach(async (deleteButton) => {
    deleteButton.addEventListener('click', (event) => {
      if (confirm('Êtes-vous sûr de vouloir supprimer ce produit de votre panier ?')) {
        deleteProduct(event, cart)
      }
    })
  })
}

// delete product event
const deleteProduct = (event, cart) => {
  const product = event.target.closest('article')
  const productParent = product.parentElement
  const id = product.dataset.id

  const productToDelete = cart.find(product => product.id === id)
  const index = cart.indexOf(productToDelete)
  cart.splice(index, 1)

  localStorage.clear()
  localStorage.setItem('cart', JSON.stringify(cart))
  updateCartTotal(productToDelete)

  window.alert('Votre produit a bien été supprimé du panier')

  productParent.removeChild(product)

  if (cart.length < 1) insertEmptyCartText()
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

// sum price & quantity cart total
const insertCartTotal = async(cart) => {
  let totalPrice = 0
  let totalQuantity = 0

  const displayTotalPrice = document.querySelector('#totalPrice')
  const displayTotalQuantity = document.querySelector('#totalQuantity')
  await new Promise((resolve) => {
    cart.forEach(async (product, index) => {
      const productData = await getProduct(product.id)
      totalPrice += parseInt(product.quantity) * productData.price
      totalQuantity += parseInt(product.quantity)

      if (index === cart.length - 1) {
        resolve()
      }
    })
  })

  displayTotalPrice.innerText = ""
  displayTotalQuantity.innerText = ""

  displayTotalPrice.append(totalPrice)
  displayTotalQuantity.append(totalQuantity)
}

const updateCartTotal = async(product) => {
  const productData = await getProduct(product.id)
  const totalPrice = document.querySelector('#totalPrice')
  const totalQuantity = document.querySelector('#totalQuantity')

  const newPrice = parseInt(totalPrice.textContent) - (productData.price * product.quantity)
  const newQuantity = parseInt(totalQuantity.textContent) - product.quantity

  totalPrice.innerText = newPrice
  totalQuantity.innerText = newQuantity
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

  await insertCartTotal(cart)
  await deleteProductEvent(cart)
  await updateProductEvent(cart)

}

// === Empty text and total ===

// insert a sentence if cart is empty
const insertEmptyCartText = () => {
  const sectionParent = document.querySelector("#cart__items")
  sectionParent.innerHTML = ""
  const emptyCartText = document.createElement("p")
  emptyCartText.classList.add('cart__item')
  emptyCartText.innerText = "Votre panier est vide"
  sectionParent.append(emptyCartText)
}

// insert empty total if cart is empty
const insertEmptyTotal = () => {
  const displayTotalPrice = document.querySelector('#totalPrice')
  const displayTotalQuantity = document.querySelector('#totalQuantity')

  displayTotalPrice.innerText = '0'
  displayTotalQuantity.innerText = '0'
}

// === Contact form ===

// get data from form and create object with it
const createFormDataObject = (contactForm) => {
  const formData = new FormData(contactForm)
  const firstName = formData.get('firstName')
  const lastName = formData.get('lastName')
  const address = formData.get('address')
  const city = formData.get('city')
  const email = formData.get('email')

  return {
    firstName: firstName,
    lastName: lastName,
    address: address,
    city: city,
    email: email
  }
}

// add input error msg under input
const addInputErrorMsg = (eventTarget, text) => {
  const inputError = document.querySelector(`#${eventTarget.id}ErrorMsg`)
  inputError.innerText = text
}

// clean error msg before test inputs
const cleanInputErrorMsg = (eventTarget) => {
  const inputError = document.querySelector(`#${eventTarget.id}ErrorMsg`)
  inputError.innerText = ""
}

// disable submit button if input is not valid
const handleDisabledStatus = (status) => {
  const submitButton = document.querySelector("#order")
  submitButton.disabled = status
  submitButton.style.opacity = submitButton.disabled ? '0.5' : '1'
}

// validate all inputs with regexs
const validateFormData = (formData, eventTarget) => {
  cleanInputErrorMsg(eventTarget)

  if (!EMAIL_REGEX.test(formData) && eventTarget.id === 'email') {
    addInputErrorMsg(eventTarget, "L'email n'est pas valide")
  }
  if (!ADDRESS_REGEX.test(formData) && eventTarget.id === 'address') {
    addInputErrorMsg(eventTarget, "L'adresse n'est pas valide")
  }

  // firstName, lastName and city have same pattern so we use the same regex
  if (!COMMON_REGEX.test(formData) && eventTarget.id === 'firstName') {
    addInputErrorMsg(eventTarget, "Le prénom n'est pas valide")
  }

  if (!COMMON_REGEX.test(formData) && eventTarget.id === 'lastName') {
    addInputErrorMsg(eventTarget, "Le nom de famille n'est pas valide")
  }

  if (!COMMON_REGEX.test(formData) && eventTarget.id === 'city') {
    addInputErrorMsg(eventTarget, "La ville n'est pas valide")
  }
}

const checkErrorsPresence = () => {
  const errorParaphs = document.querySelectorAll('.cart__order__form__question p')
  const errorTexts = Array.from(errorParaphs).map(p => p.textContent)
                                             .filter(str => str !== '')
  errorTexts.length > 0 ? handleDisabledStatus(true) : handleDisabledStatus(false)
}

// get contact form data and create order if all inputs are valid
const createOrder = async(contactForm) => {
  const order = {}
  const formData = createFormDataObject(contactForm)

  const cart = localStorage.getItem('cart')

  const productIds = JSON.parse(cart).map(product => product.id)

  order.products = productIds
  order.contact = formData
  const postedOrder = await postOrder(order)
  window.location = `/front/html/confirmation.html?orderid=${postedOrder.orderId}`
}

// === Cart and order creation logic ===
const storageCart = localStorage.getItem('cart')
const cart = JSON.parse(storageCart)

if (cart && (cart.length > 0)) {
  const cleanedCart = cleanCart(cart)
  insertCartProducts(cleanedCart)

  const contactInputs = document.querySelectorAll('.cart__order__form__question')
  contactInputs.forEach(input => {
    input.addEventListener('change', (event) => {
      validateFormData(event.target.value, event.target)
      checkErrorsPresence()
    })
  })

  const contactForm = document.querySelector('.cart__order__form')
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault()
    createOrder(contactForm)
  })
} else {
  insertEmptyCartText()
  insertEmptyTotal()
  handleDisabledStatus(true)
}
