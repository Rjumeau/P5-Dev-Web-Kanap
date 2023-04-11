const orderId = new URLSearchParams(document.location.search).get('orderid')
const orderIdElement = document.querySelector('#orderId');
orderIdElement.insertAdjacentHTML('beforeend', `<strong>${orderId}</strong>`)
