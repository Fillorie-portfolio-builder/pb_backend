// src/app.js
const express = require('express');
const cors = require('cors');
// const auth = require('./src/routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
// app.use('/api/auth', auth);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
