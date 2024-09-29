import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';

// reports cron job
import './jobs/cronJob';

const app = express();
const port = process.env.PORT || 5000;


app.use(cors({
  origin: '*',
  credentials: true,
}));

app.use(express.json());

// user endpoint
app.use("/api/user", require("./routes/userRoutes"));

// journal endpoint
app.use("/api/journals", require("./routes/journalRoutes"));

// spots endpoints

app.use("/api/spots", require("./routes/dataSourceRoute"));






app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

