const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

const MONGODB_URI =
  'mongodb+srv://dominik:TbUzGgf4LLRi06IE@cluster0-dzuqr.mongodb.net/instapic';

app.use(bodyParser.json());

// app.use('/auth', authRoutes);
// app.use('/notes', notesRoutes);

mongoose
  .connect(MONGODB_URI)
  .then(() => app.listen(8080))
  .catch(err => console.log(err));
