test('Testar se o JEST funciona!', () => {
  let number = null;
  expect(number).toBeNull();
  number = 10;
  expect(number).not.toBeNull();
  expect(number).toBe(10);
  expect(number).toEqual(10);
  expect(number).toBeGreaterThan(9);
  expect(number).toBeLessThan(11);
});

test('Testes com objetos', () => {
  const obj = { name: 'Smart Gym', mail: 'ginasio@smartgym.pt' };
  expect(obj).toHaveProperty('name');
  expect(obj).toHaveProperty('name', 'Smart Gym');
  expect(obj.name).toBe('Smart Gym');

  const obj2 = { name: 'Smart Gym', mail: 'ginasio@smartgym.pt' };
  expect(obj).toEqual(obj2);
});
