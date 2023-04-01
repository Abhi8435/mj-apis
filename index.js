import express from "express";
import { router as mjRouter } from "./router.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Bikes API
app.use("/mj", mjRouter);

app.use('*', (req, res) => {
  res.json("No Page Found").end()
})

// Start the server
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`index.js listening on ${port}`)
})
