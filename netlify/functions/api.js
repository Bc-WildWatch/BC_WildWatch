import serverlessHttp from "serverless-http";
import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "../../src/app.js";

dotenv.config();

const serverlessHandler = serverlessHttp(app);

export const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  // The Netlify redirect strips the /api prefix when using /:splat — restore it
  if (!event.path.startsWith("/api")) {
    event.path = "/api" + event.path;
  }

  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGO_URI);
  }

  return serverlessHandler(event, context);
};
