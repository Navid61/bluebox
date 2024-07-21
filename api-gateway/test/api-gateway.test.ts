import {beforeAll,afterAll,afterEach, expect, test,assert } from 'vitest';
import { http,HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { getUserData } from '../src/grpc_client'; // Replace with actual path

const server = setupServer(
  http.post('localhost:50051/GetUserData', (req, res, ctx) => {
    // Mock successful response
    return res(ctx.json({ someData: 'Mocked Data' }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('getUserData fetches user data successfully', async () => {
  const userId = 'test-user-id';
  const response = await getUserData(userId);
  expect(response).toEqual({ someData: 'Mocked Data' });
});

test('getUserData rejects on error', async () => {
  // Mock error response
  server.use(
    http.post('localhost:50051/GetUserData', (req:Request, res:Response, ctx:any) =>
      res(ctx.status(500))
    )
  );

  const userId = 'test-user-id';
  try {
    await getUserData(userId);
   assert.fail('Expected getUserData to reject');
  } catch (error) {
    expect(error).toBeInstanceOf(Error);
  }
});
