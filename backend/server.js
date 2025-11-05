const express = require('express');
const cors = require('cors');
require('dotenv').config();

const auth = require('./routes/auth');
const resume = require('./routes/resume');
const jobs = require('./routes/jobs');

const app = express();


app.use(cors({
  origin: "*"
}));

const cors = require("cors");
app.use(express.json());

// API Routes
app.use('/auth', auth);
app.use('/resume', resume);
app.use('/jobs', jobs);

// Start Server (Render provides PORT automatically)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
