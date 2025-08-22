const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  return res.status(200).json("Welcome to EXOSKY" );
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
