import { UserStore } from '../../models/user';
import { v4 as uuidv4 } from 'uuid';


describe('Test user model', () => {
  const store = new UserStore();
  const id = uuidv4();
  const user = { id, name: 'Chuong Le', email: 'chuong.le.jp@gmail.com', password: 'Chuong123' };

  test('create a new user', async () => {
    const u = await store.create(user);
    expect(u.id).toBe(id);
    expect(u.name).toBe(user.name);
    expect(u.email).toBe(user.email);
  });

  test('get all user', async () => {
    const list = await store.list();
    expect(Array.isArray(list)).toBe(true);
  });

  test('change password', async () => {
    await expect(store.changePassword(id, 'newPassword')).resolves.toBe(true);
  });

  test('delete an user', async () => {
    await expect(store.delete(id)).resolves.toBe(true);
  });

});