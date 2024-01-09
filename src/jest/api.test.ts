import supertest from 'supertest';
import app from '../index';

describe('Test all APIs', () => {
  const request = supertest(app);
  let jwt = '', id = '';
  const user = { name: 'Chuong Le', email: 'chuong.le.jp@gmail.com', password: 'Chuong123' };

  // get homepage test
  test('/, get homepage', async () => {
    const res = await request.get('/');
    expect(res.status).toBe(200);
  });

  // getJWT test
  test('/getJWT, get a valid JWT', async () => {
    const res = await request.get('/getJWT');
    jwt = res.text;
    expect(res.status).toBe(200);
  });

  // add a new user test
  test('/user/add, add a new user without JWT', async () => {
    const res = await request.post('/user/add')
      .send(user);
    expect(res.status).toBe(401);
  });
  test('/user/add, add a new user with invalid input', async () => {
    const res = await request.post('/user/add')
      .set('Authorization', `Bearer ${jwt}`)
      .send({ name: '', email: '', password: 'Chuong' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('failed');
    expect(res.body.message).toBe('Validation failed. Please check your input.');
  });
  test('/user/add, add a new user with valid input', async () => {
    const res = await request.post('/user/add')
      .set('Authorization', `Bearer ${jwt}`)
      .send(user);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data.email).toBe(user.email);
    id = res.body.data.id;
  });

  // get all users test
  test('/users, get all users without JWT', async () => {
    const res = await request.get('/users');
    expect(res.status).toBe(401);
  });
  test('/users, get all users', async () => {
    const res = await request.get('/users').set('Authorization', `Bearer ${jwt}`);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  // get an user test
  test(`/user/${id}, get an user without JWT`, async () => {
    const res = await request.get(`/user/${id}`);
    expect(res.status).toBe(401);
  });
  test(`/user/${id}`, async () => {
    const res = await request.get(`/user/${id}`).set('Authorization', `Bearer ${jwt}`);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data.email).toBe(user.email);
  });
  test(`/user/invalid-user-id`, async () => {
    const res = await request.get(`/user/invalid-user-id`).set('Authorization', `Bearer ${jwt}`);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('failed');
    expect(res.body.message).toBe('User does not exist.');
  });

  // change password test
  test(`/user/change-password/:id, get an user without JWT`, async () => {
    const res = await request.put(`/user/change-password/${id}`);
    expect(res.status).toBe(401);
  });
  test(`/user/change-password/:id, invalid input`, async () => {
    const res = await request.put(`/user/change-password/${id}`)
    .set('Authorization', `Bearer ${jwt}`)
    .send({ newPassword: '', currentPassword: '' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('failed');
    expect(res.body.message).toBe('Validation failed. Please check your input.');
  });
  test(`/user/change-password/:id, failed due to the new password is same as current password`, async () => {
    const res = await request.put(`/user/change-password/${id}`)
    .set('Authorization', `Bearer ${jwt}`)
    .send({ newPassword: user.password, currentPassword: user.password });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('failed');
    expect(res.body.message).toBe('Validation failed. Please check your input.');
  });
  test(`/user/change-password/:id, failed due to user does not exist`, async () => {
    const res = await request.put(`/user/change-password/user-not-exist`)
    .set('Authorization', `Bearer ${jwt}`)
    .send({ newPassword: user.password + 'New', currentPassword: user.password });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('failed');
    expect(res.body.message).toBe('User does not exist.');
  });
  test(`/user/change-password/:id, failed due to password does not match`, async () => {
    const res = await request.put(`/user/change-password/${id}`)
    .set('Authorization', `Bearer ${jwt}`)
    .send({ newPassword: user.password + 'New', currentPassword: user.password + 'Old' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('failed');
    expect(res.body.message).toBe('The current password does not match.');
  });
  test(`/user/change-password/:id, success`, async () => {
    const res = await request.put(`/user/change-password/${id}`)
    .set('Authorization', `Bearer ${jwt}`)
    .send({ newPassword: user.password + 'New', currentPassword: user.password });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
  });

  // delete an user test
  test(`/user/delete/:id, delete an user without JWT`, async () => {
    const res = await request.delete(`/user/delete/${id}`);
    expect(res.status).toBe(401);
  });
  test(`/user/delete/:id, success`, async () => {
    const res = await request.delete(`/user/delete/user-not-exist`).set('Authorization', `Bearer ${jwt}`);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('failed');
    expect(res.body.message).toBe('User does not exist.');
  });
  test(`/user/delete/:id, success`, async () => {
    const res = await request.delete(`/user/delete/${id}`).set('Authorization', `Bearer ${jwt}`);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
  });

});
