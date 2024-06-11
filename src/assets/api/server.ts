import express, { Application, Request, Response } from "express";

const app: Application = express();
const PORT = 3000;

try {
  app.listen(PORT, () => {
    console.log(`server running at://localhost:${PORT}`);
  });
} catch (e) {
  if (e instanceof Error) {
    console.error(e.message);
  }
}
