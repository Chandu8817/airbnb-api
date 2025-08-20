import app from "./app";
import swaggerDocs from "./config/swagger";
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  swaggerDocs(app, Number(PORT));
});
