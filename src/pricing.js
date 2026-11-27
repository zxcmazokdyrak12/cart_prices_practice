const { formatPrice, pluralizeItems } = require('./formatter');

function getSubtotal(cart) {
  return cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
}

function getQuantityDiscount(item) {
  const lineTotal = item.price * item.quantity;
  if (item.quantity >= 10) return lineTotal * 0.15;
  if (item.quantity >= 5) return lineTotal * 0.10;
  if (item.quantity >= 3) return lineTotal * 0.05;
  return 0;
}

function getCategoryDiscount(cart) {
  const subtotal = getSubtotal(cart);
  let discount = 0;

  const booksTotal = cart
    .filter((i) => i.category === 'books')
    .reduce((s, i) => s + i.price * i.quantity, 0);
  discount += booksTotal * 0.05;

  if (subtotal >= 10000) {
    const electronicsTotal = cart
      .filter((i) => i.category === 'electronics')
      .reduce((s, i) => s + i.price * i.quantity, 0);
    discount += electronicsTotal * 0.07;
  }

  return discount;
}

function getBulkDiscount(cart) {
  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);
  const subtotal = getSubtotal(cart);
  if (totalItems >= 20) return subtotal * 0.05;
  if (totalItems >= 10) return subtotal * 0.03;
  return 0;
}

function getTotal(cart) {
  const subtotal = getSubtotal(cart);
  const quantityDiscount = cart.reduce((s, i) => s + getQuantityDiscount(i), 0);
  const categoryDiscount = getCategoryDiscount(cart);
  const bulkDiscount = getBulkDiscount(cart);
  const total = subtotal - quantityDiscount - categoryDiscount - bulkDiscount;
  return Math.max(0, Number(total.toFixed(2)));
}

function buildSummary(cart) {
  const subtotal = getSubtotal(cart);
  const total = getTotal(cart);
  return {
    subtotal: formatPrice(subtotal),
    total: formatPrice(total),
    itemsLabel: pluralizeItems(cart.reduce((s, i) => s + i.quantity, 0)),
    savings: formatPrice(subtotal - total),
  };
}

module.exports = {
  getSubtotal,
  getQuantityDiscount,
  getCategoryDiscount,
  getBulkDiscount,
  getTotal,
  buildSummary,
};
