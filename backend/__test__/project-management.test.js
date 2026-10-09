// Integration tests for the Project Management API.
// Run with NODE_ENV=test after applying migrations to kanban_web_test.
process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../app');
const { sequelize, User, Project, Task } = require('../models');
const { hashPassword } = require('../helpers/bcrypt');
const { generateToken } = require('../helpers/jwt');

let user1;
let user2;
let token1;
let token2;
let project1;
let project2;
let task1;

beforeAll(async () => {
  await sequelize.authenticate();
  await Task.destroy({ where: {}, truncate: true, cascade: true, restartIdentity: true });
  await Project.destroy({ where: {}, truncate: true, cascade: true, restartIdentity: true });
  await User.destroy({ where: {}, truncate: true, cascade: true, restartIdentity: true });

  user1 = await User.create({
    name: 'Reynaldo Test',
    email: 'reynaldo.test@example.com',
    password: hashPassword('password123'),
  });
  user2 = await User.create({
    name: 'William Test',
    email: 'william.test@example.com',
    password: hashPassword('password123'),
  });

  token1 = generateToken({ id: user1.id, email: user1.email });
  token2 = generateToken({ id: user2.id, email: user2.email });

  project1 = await Project.create({ name: 'Project One', description: 'First project', UserId: user1.id });
  project2 = await Project.create({ name: 'Project Two', description: 'Second project', UserId: user2.id });
  task1 = await Task.create({
    title: 'Task One', description: 'First task', status: 'TODO', priority: 'MEDIUM',
    dueDate: new Date('2030-01-01T00:00:00.000Z'), ProjectId: project1.id,
  });
});

afterAll(async () => {
  await Task.destroy({ where: {}, truncate: true, cascade: true, restartIdentity: true });
  await Project.destroy({ where: {}, truncate: true, cascade: true, restartIdentity: true });
  await User.destroy({ where: {}, truncate: true, cascade: true, restartIdentity: true });
  await sequelize.close();
});

const auth = (token) => ({ Authorization: `Bearer ${token}` });

describe('Authentication endpoints', () => {
  test('POST /register - 400 when required fields are missing', async () => {
    const response = await request(app).post('/register').send({ email: 'new@example.com' });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Name, email, and password are required.');
  });

  test('POST /register - 400 for invalid email', async () => {
    const response = await request(app).post('/register').send({ name: 'New User', email: 'invalid-email', password: 'password123' });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Please provide a valid email address.');
  });

  test('POST /register - 201 creates a user without exposing password', async () => {
    const response = await request(app).post('/register').send({ name: 'New User', email: 'new.user@example.com', password: 'password123' });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'Registration successful.');
    expect(response.body.user).toHaveProperty('email', 'new.user@example.com');
    expect(response.body.user).not.toHaveProperty('password');
  });

  test('POST /register - 400 when email already exists', async () => {
    const response = await request(app).post('/register').send({ name: 'Duplicate', email: user1.email, password: 'password123' });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'An account with this email already exists.');
  });

  test('POST /login - 200 returns token and user without password', async () => {
    const response = await request(app).post('/login').send({ email: user1.email, password: 'password123' });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Login successful.');
    expect(response.body).toHaveProperty('token');
    expect(response.body.user).toHaveProperty('email', user1.email);
    expect(response.body.user).not.toHaveProperty('password');
  });

  test('POST /login - 401 for wrong credentials', async () => {
    const response = await request(app).post('/login').send({ email: user1.email, password: 'wrong-password' });
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'Invalid email or password.');
  });
});

describe('Authentication middleware and user endpoints', () => {
  test('GET /projects - 401 when not logged in', async () => {
    const response = await request(app).get('/projects');
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'Authentication required.');
  });

  test('GET /projects - 401 for invalid token', async () => {
    const response = await request(app).get('/projects').set(auth('invalid.token'));
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'Invalid or expired token');
  });

  test('GET /users/info - 200 returns current user info', async () => {
    const response = await request(app).get('/users/info').set(auth(token1));
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', user1.id);
    expect(response.body).toHaveProperty('name', user1.name);
    expect(response.body).toHaveProperty('email', user1.email);
    expect(response.body).not.toHaveProperty('password');
  });

  test('PATCH /users/telegram - 400 when chat ID is missing', async () => {
    const response = await request(app).patch('/users/telegram').set(auth(token1)).send({});
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Telegram Chat ID is required');
  });

  test('PATCH /users/telegram - 200 saves Telegram Chat ID', async () => {
    const response = await request(app).patch('/users/telegram').set(auth(token1)).send({ TelegramChatId: '123456789' });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Telegram Chat ID updated successfully');
    expect(response.body).toHaveProperty('TelegramChatId', '123456789');
  });
});

describe('/projects endpoint', () => {
  test('GET /projects - 200 returns only projects owned by logged-in user', async () => {
    const response = await request(app).get('/projects').set(auth(token1));
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toHaveProperty('id', project1.id);
    expect(response.body[0]).toHaveProperty('name', 'Project One');
    expect(response.body[0]).toHaveProperty('UserId', user1.id);
  });

  test('POST /projects - 400 when name is missing', async () => {
    const response = await request(app).post('/projects').set(auth(token1)).send({ description: 'No name' });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Project name is required.');
  });

  test('POST /projects - 201 creates a project for current user', async () => {
    const response = await request(app).post('/projects').set(auth(token1)).send({ name: 'Created Project', description: 'Created by test' });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('name', 'Created Project');
    expect(response.body).toHaveProperty('description', 'Created by test');
    expect(response.body).toHaveProperty('UserId', user1.id);
  });

  test('GET /projects/:id - 200 returns owned project', async () => {
    const response = await request(app).get(`/projects/${project1.id}`).set(auth(token1));
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', project1.id);
    expect(response.body).toHaveProperty('name', 'Project One');
  });

  test('GET /projects/:id - 404 when project does not exist', async () => {
    const response = await request(app).get('/projects/999999').set(auth(token1));
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Project not found.');
  });

  test('GET /projects/:id - 403 when project belongs to another user', async () => {
    const response = await request(app).get(`/projects/${project2.id}`).set(auth(token1));
    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty('message', 'Forbidden access.');
  });

  test('PATCH /projects/:id - 200 updates an owned project', async () => {
    const response = await request(app).patch(`/projects/${project1.id}`).set(auth(token1)).send({ name: 'Project One Updated', description: 'Updated description' });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('name', 'Project One Updated');
    expect(response.body).toHaveProperty('description', 'Updated description');
  });

  test('PATCH /projects/:id - 400 when name is empty', async () => {
    const response = await request(app).patch(`/projects/${project1.id}`).set(auth(token1)).send({ name: '' });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Project name is required.');
  });

  test('PATCH /projects/:id - 403 when updating another user project', async () => {
    const response = await request(app).patch(`/projects/${project2.id}`).set(auth(token1)).send({ name: 'Not allowed' });
    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty('message', 'Forbidden access.');
  });

  test('DELETE /projects/:id - 404 when project does not exist', async () => {
    const response = await request(app).delete('/projects/999999').set(auth(token1));
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Project not found.');
  });

  test('DELETE /projects/:id - 403 when deleting another user project', async () => {
    const response = await request(app).delete(`/projects/${project2.id}`).set(auth(token1));
    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty('message', 'Forbidden access.');
  });

  test('DELETE /projects/:id - 200 deletes an owned project', async () => {
    const project = await Project.create({ name: 'Project To Delete', description: 'Temporary', UserId: user1.id });
    const response = await request(app).delete(`/projects/${project.id}`).set(auth(token1));
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Project Project To Delete deleted successfully.');
  });
});

describe('/projects/:ProjectId/tasks and /tasks endpoints', () => {
  test('GET /projects/:ProjectId/tasks - 200 returns project tasks', async () => {
    const response = await request(app).get(`/projects/${project1.id}/tasks`).set(auth(token1));
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toHaveProperty('id', task1.id);
    expect(response.body[0]).toHaveProperty('title', 'Task One');
  });

  test('GET /projects/:ProjectId/tasks - 404 when project does not exist', async () => {
    const response = await request(app).get('/projects/999999/tasks').set(auth(token1));
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Project not found.');
  });

  test('GET /projects/:ProjectId/tasks - 403 for another user project', async () => {
    const response = await request(app).get(`/projects/${project2.id}/tasks`).set(auth(token1));
    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty('message', 'Forbidden access.');
  });

  test('POST /projects/:ProjectId/tasks - 400 when title is missing', async () => {
    const response = await request(app).post(`/projects/${project1.id}/tasks`).set(auth(token1)).send({ description: 'No title' });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Title is required.');
  });

  test('POST /projects/:ProjectId/tasks - 400 for invalid status', async () => {
    const response = await request(app).post(`/projects/${project1.id}/tasks`).set(auth(token1)).send({ title: 'Bad status', status: 'WAITING' });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Invalid status.');
  });

  test('POST /projects/:ProjectId/tasks - 400 for invalid priority', async () => {
    const response = await request(app).post(`/projects/${project1.id}/tasks`).set(auth(token1)).send({ title: 'Bad priority', priority: 'URGENT' });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Invalid priority.');
  });

  test('POST /projects/:ProjectId/tasks - 201 creates a task', async () => {
    const response = await request(app).post(`/projects/${project1.id}/tasks`).set(auth(token1)).send({
      title: 'Created Task', description: 'Task created by test', status: 'IN_PROGRESS', priority: 'HIGH', dueDate: '2030-02-01T00:00:00.000Z',
    });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('title', 'Created Task');
    expect(response.body).toHaveProperty('description', 'Task created by test');
    expect(response.body).toHaveProperty('status', 'IN_PROGRESS');
    expect(response.body).toHaveProperty('priority', 'HIGH');
    expect(response.body).toHaveProperty('ProjectId', project1.id);
  });

  test('POST /projects/:ProjectId/tasks - 403 for another user project', async () => {
    const response = await request(app).post(`/projects/${project2.id}/tasks`).set(auth(token1)).send({ title: 'Not allowed' });
    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty('message', 'Forbidden access.');
  });

  test('GET /tasks/:id - 200 returns task and its project', async () => {
    const response = await request(app).get(`/tasks/${task1.id}`).set(auth(token1));
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', task1.id);
    expect(response.body).toHaveProperty('title', 'Task One');
    expect(response.body).toHaveProperty('Project');
    expect(response.body.Project).toHaveProperty('id', project1.id);
  });

  test('GET /tasks/:id - 404 when task does not exist', async () => {
    const response = await request(app).get('/tasks/999999').set(auth(token1));
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Task not found.');
  });

  test('GET /tasks/:id - 403 for task belonging to another user', async () => {
    const otherTask = await Task.create({ title: 'Other User Task', ProjectId: project2.id });
    const response = await request(app).get(`/tasks/${otherTask.id}`).set(auth(token1));
    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty('message', 'Forbidden access.');
  });

  test('PATCH /tasks/:id - 200 updates task', async () => {
    const response = await request(app).patch(`/tasks/${task1.id}`).set(auth(token1)).send({ title: 'Task One Updated', status: 'DONE', priority: 'LOW' });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('title', 'Task One Updated');
    expect(response.body).toHaveProperty('status', 'DONE');
    expect(response.body).toHaveProperty('priority', 'LOW');
  });

  test('PATCH /tasks/:id - 400 when title is empty', async () => {
    const response = await request(app).patch(`/tasks/${task1.id}`).set(auth(token1)).send({ title: '' });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Title is required.');
  });

  test('PATCH /tasks/:id - 400 for invalid status', async () => {
    const response = await request(app).patch(`/tasks/${task1.id}`).set(auth(token1)).send({ status: 'WAITING' });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Invalid status.');
  });

  test('PATCH /tasks/:id - 400 for invalid priority', async () => {
    const response = await request(app).patch(`/tasks/${task1.id}`).set(auth(token1)).send({ priority: 'URGENT' });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Invalid priority.');
  });

  test('PATCH /tasks/:id - 404 when task does not exist', async () => {
    const response = await request(app).patch('/tasks/999999').set(auth(token1)).send({ title: 'Missing task' });
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Task not found.');
  });

  test('PATCH /tasks/:id - 403 for another user task', async () => {
    const otherTask = await Task.create({ title: 'Another Task', ProjectId: project2.id });
    const response = await request(app).patch(`/tasks/${otherTask.id}`).set(auth(token1)).send({ title: 'Trying update' });
    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty('message', 'Forbidden access.');
  });

  test('DELETE /tasks/:id - 404 when task does not exist', async () => {
    const response = await request(app).delete('/tasks/999999').set(auth(token1));
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Task not found.');
  });

  test('DELETE /tasks/:id - 403 for another user task', async () => {
    const otherTask = await Task.create({ title: 'Task Not Owned', ProjectId: project2.id });
    const response = await request(app).delete(`/tasks/${otherTask.id}`).set(auth(token1));
    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty('message', 'Forbidden access.');
  });

  test('DELETE /tasks/:id - 200 deletes owned task', async () => {
    const task = await Task.create({ title: 'Task To Delete', ProjectId: project1.id });
    const response = await request(app).delete(`/tasks/${task.id}`).set(auth(token1));
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Task Task To Delete deleted successfully.');
  });
});
