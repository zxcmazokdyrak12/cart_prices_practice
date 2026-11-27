function createCart() {
  return [];
}

function addItem(cart, item) {
  const existing = cart.find((i) => i.id === item.id);
  if (existing) {
    return cart.map((i) =>
      i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
    );
  }
  return [...cart, { ...item }];
}

function removeItem(cart, id) {
  return cart.filter((i) => i.id !== id);
}

function updateQuantity(cart, id, quantity) {
  if (quantity <= 0) {
    return removeItem(cart, id);
  }
  return cart.map((i) => (i.id === id ? { ...i, quantity } : i));
}

function countItems(cart) {
  return cart.reduce((sum, i) => sum + i.quantity, 0);
}

module.exports = { createCart, addItem, removeItem, updateQuantity, countItems };
