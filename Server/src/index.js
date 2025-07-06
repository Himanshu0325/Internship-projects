import connectDB from "./DB/index.js";
import dotenv from "dotenv"
import { app } from "./app.js";

dotenv.config({
  path: "./.env"
})

connectDB()
  .then(() => {
    app.on("err", (err) => {
      console.log("ERRR: ", err);
      throw err
    })

    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port : ${process.env.PORT || 8000}`)
    })
  })
  .catch((err) => {
     console.log("MONGO DB connection failed !!!", err)
   })