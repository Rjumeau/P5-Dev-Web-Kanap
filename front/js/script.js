// === PRODUCTS API CALL ===
const getProducts = async () => {
  const response = await fetch('http://localhost:3000/api/products')
  const products = await response.json()
  return products
}

// === ADD PRODUCTS CONTENT ===
const addProductToDom = (product) => {
  const itemsSection = document.querySelector('#items')

  const productLink = document.createElement('a')
  productLink.href =`../html/product.html?id=${product._id}`

  const productArticle = document.createElement('article')

  const productImg = document.createElement('img')
  productImg.alt = product.altTxt

  const productTitle = document.createElement('h3')
  productTitle.classList.add('productName')
  productTitle.innerText = product.name

  productDescription = document.createElement('p')
  productDescription.classList.add('productDescription')
  productDescription.innerText = product.description

  productImg.src = product.imageUrl
  productLink.append(productArticle)
  productArticle.append(productImg)
  productArticle.append(productTitle)
  productArticle.append(productDescription)
  itemsSection.append(productLink)
}

const displayProducts = async () => {
  const products = await getProducts()
  products.forEach((product) => {
    addProductToDom(product)
  })
}

displayProducts()
