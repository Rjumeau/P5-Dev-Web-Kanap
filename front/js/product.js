const getProduct = async (id) => {
  const response = await fetch(`http://localhost:3000/api/products/${id}`)
  const data = await response.json()
  return data
}

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

const addProductToCart = (id) => {
  const cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : []
  const quantity = document.querySelector("#quantity").value
  const color = document.querySelector('#colors').value

  if (quantity <= 0 || color === '') {
    return window.alert('La quantité et la couleur doivent être spécifiées.')
  }

  const sameProduct = cart.find((product) => {
    product.id === id && product.color === color
  })

  if (sameProduct) {
    sameProduct.quantity = parseInt(sameProduct.quantity) + parseInt(quantity)
  } else {
    const cartItem = { id: id, quantity: quantity, color: color}
    cart.push(cartItem)
  }

  localStorage.removeItem("cart")
  localStorage.setItem("cart", JSON.stringify(cart))
  window.alert('Votre produit a bien été ajouté au panier')
}

const productUrl = new URL(window.location.href)
const productId = productUrl.searchParams.get("id")
insertProductContent(productId)
document.querySelector("#addToCart").addEventListener('click', () => addProductToCart(productId))
console.log(localStorage.getItem('cart'))
