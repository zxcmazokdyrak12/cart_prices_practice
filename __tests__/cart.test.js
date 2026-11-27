const { createCart, addItem, removeItem, countItems } = require('../src/cart');

const phone = { id: 'p1', title: 'Телефон', price: 20000, quantity: 1, category: 'electronics' };
const book = { id: 'b1', title: 'Книга', price: 500, quantity: 2, category: 'books' };

describe('createCart', () => {
  test('возвращает пустой массив', () => {
    expect(createCart()).toEqual([]);
  });
});

describe('addItem', () => {
  test('добавляет новый товар', () => {
    const cart = addItem(createCart(), phone);

    expect(cart).toHaveLength(1);
    expect(cart[0]).toEqual(phone);
  });

  test('увеличивает количество существующего товара', () => {
    let cart = addItem(createCart(), book);
    cart = addItem(cart, { ...book, quantity: 3 });

    expect(cart).toHaveLength(1);
    expect(cart[0].quantity).toBe(5);
  });
});

describe('removeItem', () => {
  test('удаляет товар по id', () => {
    const cart = addItem(addItem(createCart(), phone), book);
    const result = removeItem(cart, 'p1');

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(book);
  });
});

describe('countItems', () => {
  test('считает общее количество единиц', () => {
    const cart = addItem(addItem(createCart(), phone), book);
    expect(countItems(cart)).toBe(3);
  });

  test('для пустой корзины возвращает 0', () => {
    expect(countItems(createCart())).toBe(0);
  });
});
