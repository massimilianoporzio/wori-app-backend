import express from "express";
import { json } from "body-parser";
//import autoRoute from
const app = express();
app.use(json());

//app.use('')
app.get("/", (req, res) => {
  console.log("test");
  res.send("yes, it works (anche da ufficio)!");
});
const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
export default app;
