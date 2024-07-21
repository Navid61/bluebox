import express, { Request, Response } from "express";
import { getUserData, saveUser } from './grpc_client.js';



const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

// Route to get user data
app.get("/user/:id", async (req: Request, res: Response) => {
  const userId = req.params.id;
  try {
    const response = await getUserData(userId);
    res.json(response);
  } catch (error) {
    if(error instanceof Error)
    res.status(500).json({ error: error.message });
  }
});

// Route to save user data
app.post("/user", async (req: Request, res: Response) => {
  const { name, age } = req.body;
  try {
    const response = await saveUser(name, age);
    res.json(response);
  } catch (error) {
    if(error instanceof Error)
    res.status(500).json({ error: error.message });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



export default app