const express = require("express")
require("dotenv").config({ path: "./.env" })
const mongoose = require("mongoose")
mongoose.connect(process.env.MONGO_URL)
const app = express()

app.use(express.json())//body parser

app.use("/api/user", require("./routes/userRoutes"))

const PORT = process.env.PORT || 5000

mongoose, mongoose.connection.once("open", () => {
	console.log("DB CONNECTED")
	app.listen(PORT, console.log(`http://localhost:${PORT}`))
})
