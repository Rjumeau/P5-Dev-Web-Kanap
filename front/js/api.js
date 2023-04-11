// === PRODUCTS API CALL FUNCTION ===
export const getProducts = async () => {
  const response = await fetch('http://localhost:3000/api/products')
  const products = await response.json()
  return products
}

// === PRODUCT API CALL FUNCTION ===
export const getProduct = async (id) => {
  const response = await fetch(`http://localhost:3000/api/products/${id}`)
  const data = await response.json()
  return data
}

// === POST ORDER API CALL FUNCTION ===
export const postOrder = async (order) => {
  let response = await fetch('http://localhost:3000/api/products/order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(order)
  });
  const data = await response.json()
  return data
}
