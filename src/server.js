import app from "./app.js";
import env from "./config/env.js";

app.listen(env.port, "0.0.0.0", () => {
  console.log(`Server is running on http://localhost:${env.port}`);
  console.log(`Environment: ${env.nodeEnv}`);
});