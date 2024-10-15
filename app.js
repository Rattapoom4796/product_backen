const express = require('express'); 
const mongoose = require('mongoose'); 
const dotenv = require('dotenv');
dotenv.config();
const app = express();
app.use(express.json())

// ConnectDB
mongoose.connect(process.env.MONGO_DB_URI, {
  })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

  const productRoutes = require("./routes/product");
  app.use("/api",productRoutes)

  const authRoutes = require("./routes/auth");
  app.use("/api/user",authRoutes)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on http://localhost: ${PORT}`));