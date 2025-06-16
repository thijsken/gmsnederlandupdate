const express = require('express');
const cors = require('cors');
const path = require('path');

const meldingenRoutes = require('./api/meldingen');
const unitsRoutes = require('./api/units');
const luchtalarmRoutes = require('./api/luchtalarm/palen');
const postenRoutes = require('./api/posten');
const luchtalarmactie = require('./api/luchtalarm/luchtalarm');
const postalarmactie = require('./api/posten')
const nlalertactie = require('./api/nlalert')
const ameberalertacties = require('./api/amber')

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Statische root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API-routes
app.use('/api/meldingen', meldingenRoutes);
app.use('/api/units', unitsRoutes);
app.use('/api/luchtalarm/palen', luchtalarmRoutes);
app.use('/api/posten', postenRoutes);
app.use('/api/luchtalarm/luchtalarm.js', luchtalarmactie);
app.use('/api/posten/alarm.js', postalarmactie);
app.use('/api/nlalert.js', nlalertactie);
app.use('/api/amber.js', ameberalertacties);

app.listen(PORT, () => {
  console.log(`🚀 Server draait op http://localhost:${PORT}`);
});
