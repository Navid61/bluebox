import express, { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

const app = express();
const PORT = process.env.PORT || 5003;

app.use(express.json());

const errorHandler: ErrorRequestHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
};

app.use(errorHandler);

app.get('/api/sample', (req, res) => {
  res.json({ message: 'Sample endpoint reached!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
