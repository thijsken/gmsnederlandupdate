const express = require('express');
const cors = require('cors');
const path = require('path');

const meldingenRoutes = require('./api/meldingen');
const unitsRoutes = require('./api/units');
// ... importeer hier meer routes

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Dashboard root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Gebruik routers per path
app.use('/api/meldingen', meldingenRoutes);
app.use('/api/units', unitsRoutes);
// ... voeg meer routes toe zoals /api/luchtalarm, /api/posten etc

app.listen(PORT, () => {
  console.log(`🚀 Server draait op http://localhost:${PORT}`);
});
