/* Importing modules */
import * as http from "http";
import * as app from "./app";
import * as dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

/* Creating the server */
const server: http.Server = http.createServer(app.default);

/* Connecting to the database */
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1/echo-era')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

/* Setting up the server */
const port: number = Number(process.env.PORT) || 8001;

/* Starting the server */
server.listen(port, () => {
  console.log(`Echo Era server started on port ${port} at ${new Date()}!`);
});