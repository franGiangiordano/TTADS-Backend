import app from "./app";

// Db connection
import connectDB from "./database";
connectDB;

// Settings
app.set("port", process.env.PORT || 3000);

// Starting the server
app.listen(app.get("port"), () => {
  console.log(`Server on port ${app.get("port")}`);
});
