import express, { json, urlencoded, Response as ExResponse, Request as ExRequest } from "express";
import { RegisterRoutes } from "../build/routes";
import mongoose from "mongoose";
import swaggerUi from "swagger-ui-express";
import multer from "multer";
import path from "path";
import { UserModel } from "./models/user";
var cors = require('cors')

const app = express();

mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://ranjanab321:123678@cluster0.xvfeq7b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => {
    console.log('Connected to MongoDB');
  }).catch(err => {
    console.error('MongoDB connection error:', err);
  });

app.use(cors());

app.use(
  urlencoded({
    extended: true,
  })
);
app.use(json());
app.use("/docs", swaggerUi.serve, async (_req: ExRequest, res: ExResponse) => {
  return res.send(
    swaggerUi.generateHTML(await import("../build/swagger.json"))
  );
});
app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true,
}));

// Set up storage for Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Appending extension
  },
});

const upload = multer({ storage: storage });

// Serve the uploads folder statically
app.use('/uploads', express.static('uploads'));

app.post('/users/:userId/videos', upload.single('video'), async (req, res) => {
  try {
    const userId = req.params.userId;
    const { title, description } = req.body;

    if (!req.file) {
      return res.status(400).send({ message: 'No file uploaded' });
    }

    const video = {
      url: `/uploads/${req.file.filename}`,
      size: req.file.size,
      title,
      description,
    };

    const user = await UserModel.findByIdAndUpdate(
      userId,
      { $push: { videos: video } },
      { new: true }
    );

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    res.status(200).send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'An error occurred while uploading the video' });
  }
});

app.put('/users/:userId/profile-picture', upload.single('profilePicture'), async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!req.file) {
      return res.status(400).send({ message: 'No file uploaded' });
    }

    const profilePicture = `/uploads/${req.file.filename}`;

    const user = await UserModel.findByIdAndUpdate(
      userId,
      { profilePicture },
      { new: true }
    );

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    res.status(200).send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'An error occurred while uploading the profile picture' });
  }
});

RegisterRoutes(app);

export { app };