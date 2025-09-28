import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import chatRoutes from "./routes/chatRoutes.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api", chatRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
