const {
  getSubtotal,
  getQuantityDiscount,
  getCategoryDiscount,
  getBulkDiscount,
  getTotal,
} = require('../src/pricing');

const item = (quantity, price = 100, category = 'clothing') => ({
  id: 'x',
  title: 'Товар',
  price,
  quantity,
  category,
});

describe('getQuantityDiscount', () => {
  test('1–2 шт — скидки нет', () => {
    expect(getQuantityDiscount(item(1))).toBe(0);
    expect(getQuantityDiscount(item(2))).toBe(0);
  });

  test('граница 3 шт — 5%', () => {
    expect(getQuantityDiscount(item(3))).toBeCloseTo(15);
  });

  test('4 шт — всё ещё 5%', () => {
    expect(getQuantityDiscount(item(4))).toBeCloseTo(20);
  });

  test('граница 5 шт — 10%', () => {
    expect(getQuantityDiscount(item(5))).toBeCloseTo(50);
  });

  test('9 шт — всё ещё 10%', () => {
    expect(getQuantityDiscount(item(9))).toBeCloseTo(90);
  });

  test('граница 10 шт — 15%', () => {
    expect(getQuantityDiscount(item(10))).toBeCloseTo(150);
  });

  test('больше 10 шт — 15%', () => {
    expect(getQuantityDiscount(item(20))).toBeCloseTo(300);
  });
});

describe('getCategoryDiscount', () => {
  test('5% на книги и 7% на электронику при subtotal ≥ 10000', () => {
    const cart = [
      { id: 'b1', title: 'Книга', price: 500, quantity: 2, category: 'books' },
      { id: 'e1', title: 'Ноутбук', price: 9000, quantity: 1, category: 'electronics' },
      { id: 'c1', title: 'Футболка', price: 1000, quantity: 1, category: 'clothing' },
    ];
    expect(getSubtotal(cart)).toBe(11000);
    expect(getCategoryDiscount(cart)).toBeCloseTo(680);
  });

  test('при subtotal < 10000 скидка только на книги', () => {
    const cart = [
      { id: 'b1', title: 'Книга', price: 500, quantity: 2, category: 'books' },
      { id: 'e1', title: 'Наушники', price: 5000, quantity: 1, category: 'electronics' },
    ];
    expect(getCategoryDiscount(cart)).toBeCloseTo(50);
  });
});

describe('getTotal', () => {
  test('не уходит в минус', () => {
    const cart = [
      { id: 'b1', title: 'Книга', price: 1000, quantity: 1000, category: 'books' },
      { id: 'r1', title: 'Возврат', price: -2000, quantity: 1000, category: 'clothing' },
    ];
    expect(getTotal(cart)).toBe(0);
  });

  test('обычная корзина: итог = subtotal − сумма скидок', () => {
    const cart = [
      { id: 'b1', title: 'Книга', price: 500, quantity: 3, category: 'books' },
      { id: 'e1', title: 'Ноутбук', price: 10000, quantity: 1, category: 'electronics' },
    ];
    const subtotal = getSubtotal(cart);
    const discounts =
      cart.reduce((s, i) => s + getQuantityDiscount(i), 0) +
      getCategoryDiscount(cart) +
      getBulkDiscount(cart);

    expect(subtotal).toBe(11500);
    expect(discounts).toBeCloseTo(850);
    expect(getTotal(cart)).toBeCloseTo(subtotal - discounts);
  });
});
