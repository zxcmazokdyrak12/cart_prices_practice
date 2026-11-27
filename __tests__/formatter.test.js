const { formatPrice, pluralizeItems } = require('../src/formatter');

describe('formatPrice', () => {
  test('форматирует число с копейками', () => {
    expect(formatPrice(1234.5)).toBe('1 234,50 ₽');
  });

  test('бросает ошибку для не-числа', () => {
    expect(() => formatPrice('100')).toThrow('Amount must be a number');
  });
});

describe('pluralizeItems', () => {
  test.each([
    [1, '1 товар'],
    [3, '3 товара'],
    [11, '11 товаров'],
    [5, '5 товаров'],
    [21, '21 товар'],
    [22, '22 товара'],
  ])('%i → "%s"', (count, expected) => {
    expect(pluralizeItems(count)).toBe(expected);
  });
});
