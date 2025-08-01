// import "reflect-metadata";
import app from "./app";
import connectDB from "./configs/db";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server start error:", error);
  }
};
startServer();
