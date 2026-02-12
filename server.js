// tax-api-server.js
// Node.js/Express server that provides tax rate data via API
// Can be deployed to services like Heroku, Replit, or your own server

const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS for the calculator to fetch from this API
app.use(cors());

// Cache for tax rates (in production, use Redis or similar)
let taxRateCache = {
  lastUpdated: null,
  data: {}
};

// Tax rate data structure - can be updated from various sources
// This is initialized with 2026 Tax Foundation data
const getTaxRates = async () => {
  // In production, you would:
  // 1. Fetch from Tax Foundation API/RSS
  // 2. Fetch from state revenue department APIs
  // 3. Fetch from a tax data service like TaxJar or Avalara
  // 4. Cache the results with timestamps
  
  const stateRates = {
    'AL': { state: 0.04, avgLocal: 0.0546, combined: 0.0946, lastUpdated: '2026-01-01' },
    'AK': { state: 0.00, avgLocal: 0.0182, combined: 0.0182, lastUpdated: '2026-01-01' },
    'AZ': { state: 0.056, avgLocal: 0.0292, combined: 0.0852, lastUpdated: '2026-01-01' },
    'AR': { state: 0.065, avgLocal: 0.0296, combined: 0.0946, lastUpdated: '2026-01-01' },
    'CA': { state: 0.0725, avgLocal: 0.0174, combined: 0.0899, lastUpdated: '2026-01-01' },
    'CO': { state: 0.029, avgLocal: 0.0499, combined: 0.0789, lastUpdated: '2026-01-01' },
    'CT': { state: 0.0635, avgLocal: 0.00, combined: 0.0635, lastUpdated: '2026-01-01' },
    'DE': { state: 0.00, avgLocal: 0.00, combined: 0.00, lastUpdated: '2026-01-01' },
    'FL': { state: 0.06, avgLocal: 0.0098, combined: 0.0698, lastUpdated: '2026-01-01' },
    'GA': { state: 0.04, avgLocal: 0.0349, combined: 0.0749, lastUpdated: '2026-01-01' },
    'HI': { state: 0.04, avgLocal: 0.005, combined: 0.045, lastUpdated: '2026-01-01' },
    'ID': { state: 0.06, avgLocal: 0.0003, combined: 0.0603, lastUpdated: '2026-01-01' },
    'IL': { state: 0.0625, avgLocal: 0.0271, combined: 0.0896, lastUpdated: '2026-01-01' },
    'IN': { state: 0.07, avgLocal: 0.00, combined: 0.07, lastUpdated: '2026-01-01' },
    'IA': { state: 0.06, avgLocal: 0.0094, combined: 0.0694, lastUpdated: '2026-01-01' },
    'KS': { state: 0.065, avgLocal: 0.0219, combined: 0.0869, lastUpdated: '2026-01-01' },
    'KY': { state: 0.06, avgLocal: 0.00, combined: 0.06, lastUpdated: '2026-01-01' },
    'LA': { state: 0.05, avgLocal: 0.0511, combined: 0.1011, lastUpdated: '2026-01-01' },
    'ME': { state: 0.055, avgLocal: 0.00, combined: 0.055, lastUpdated: '2026-01-01' },
    'MD': { state: 0.06, avgLocal: 0.00, combined: 0.06, lastUpdated: '2026-01-01' },
    'MA': { state: 0.0625, avgLocal: 0.00, combined: 0.0625, lastUpdated: '2026-01-01' },
    'MI': { state: 0.06, avgLocal: 0.00, combined: 0.06, lastUpdated: '2026-01-01' },
    'MN': { state: 0.06875, avgLocal: 0.0126, combined: 0.0814, lastUpdated: '2026-01-01' },
    'MS': { state: 0.07, avgLocal: 0.0006, combined: 0.0706, lastUpdated: '2026-01-01' },
    'MO': { state: 0.04225, avgLocal: 0.0422, combined: 0.0844, lastUpdated: '2026-01-01' },
    'MT': { state: 0.00, avgLocal: 0.00, combined: 0.00, lastUpdated: '2026-01-01' },
    'NE': { state: 0.055, avgLocal: 0.0148, combined: 0.0698, lastUpdated: '2026-01-01' },
    'NV': { state: 0.0685, avgLocal: 0.0139, combined: 0.0824, lastUpdated: '2026-01-01' },
    'NH': { state: 0.00, avgLocal: 0.00, combined: 0.00, lastUpdated: '2026-01-01' },
    'NJ': { state: 0.06625, avgLocal: -0.0002, combined: 0.066, lastUpdated: '2026-01-01' },
    'NM': { state: 0.04875, avgLocal: 0.0279, combined: 0.0767, lastUpdated: '2026-01-01' },
    'NY': { state: 0.04, avgLocal: 0.0454, combined: 0.0854, lastUpdated: '2026-01-01' },
    'NC': { state: 0.0475, avgLocal: 0.0225, combined: 0.07, lastUpdated: '2026-01-01' },
    'ND': { state: 0.05, avgLocal: 0.0209, combined: 0.0709, lastUpdated: '2026-01-01' },
    'OH': { state: 0.0575, avgLocal: 0.0154, combined: 0.0729, lastUpdated: '2026-01-01' },
    'OK': { state: 0.045, avgLocal: 0.0456, combined: 0.0906, lastUpdated: '2026-01-01' },
    'OR': { state: 0.00, avgLocal: 0.00, combined: 0.00, lastUpdated: '2026-01-01' },
    'PA': { state: 0.06, avgLocal: 0.0034, combined: 0.0634, lastUpdated: '2026-01-01' },
    'RI': { state: 0.07, avgLocal: 0.00, combined: 0.07, lastUpdated: '2026-01-01' },
    'SC': { state: 0.06, avgLocal: 0.0149, combined: 0.0749, lastUpdated: '2026-01-01' },
    'SD': { state: 0.042, avgLocal: 0.0191, combined: 0.0611, lastUpdated: '2026-01-01' },
    'TN': { state: 0.07, avgLocal: 0.0261, combined: 0.0961, lastUpdated: '2026-01-01' },
    'TX': { state: 0.0625, avgLocal: 0.0195, combined: 0.082, lastUpdated: '2026-01-01' },
    'UT': { state: 0.061, avgLocal: 0.0132, combined: 0.0742, lastUpdated: '2026-01-01' },
    'VT': { state: 0.06, avgLocal: 0.0039, combined: 0.0639, lastUpdated: '2026-01-01' },
    'VA': { state: 0.053, avgLocal: 0.0047, combined: 0.0577, lastUpdated: '2026-01-01' },
    'WA': { state: 0.065, avgLocal: 0.0301, combined: 0.0951, lastUpdated: '2026-01-01' },
    'WV': { state: 0.06, avgLocal: 0.0059, combined: 0.0659, lastUpdated: '2026-01-01' },
    'WI': { state: 0.05, avgLocal: 0.0072, combined: 0.0572, lastUpdated: '2026-01-01' },
    'WY': { state: 0.04, avgLocal: 0.0156, combined: 0.0556, lastUpdated: '2026-01-01' }
  };

  return stateRates;
};

// API Endpoint: Get tax rate for a specific state
app.get('/api/tax-rate/:state', async (req, res) => {
  try {
    const state = req.params.state.toUpperCase();
    const rates = await getTaxRates();
    
    if (rates[state]) {
      res.json({
        state: state,
        ...rates[state],
        source: 'Tax Foundation 2026',
        success: true
      });
    } else {
      res.status(404).json({
        error: 'State not found',
        success: false
      });
    }
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch tax rates',
      success: false
    });
  }
});

// API Endpoint: Get all tax rates
app.get('/api/tax-rates', async (req, res) => {
  try {
    const rates = await getTaxRates();
    res.json({
      rates: rates,
      source: 'Tax Foundation 2026',
      lastUpdated: '2026-01-01',
      success: true
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch tax rates',
      success: false
    });
  }
});

// API Endpoint: Get tax rate by coordinates (city/state detection)
app.get('/api/tax-rate-by-location', async (req, res) => {
  try {
    const { lat, lng } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({
        error: 'Latitude and longitude required',
        success: false
      });
    }

    // Fetch location from Nominatim
    const nominatimResponse = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );
    const locationData = await nominatimResponse.json();
    
    const stateFull = locationData.address?.state;
    const city = locationData.address?.city || locationData.address?.town || locationData.address?.village;
    
    if (!stateFull) {
      return res.status(400).json({
        error: 'Could not determine state from coordinates',
        success: false
      });
    }

    // Convert state name to abbreviation
    const stateAbbr = getStateAbbreviationFromName(stateFull);
    
    if (!stateAbbr) {
      return res.status(400).json({
        error: 'Invalid state',
        success: false
      });
    }

    const rates = await getTaxRates();
    const rateData = rates[stateAbbr];

    res.json({
      state: stateAbbr,
      city: city || 'Unknown',
      ...rateData,
      source: 'Tax Foundation 2026',
      success: true
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch location or tax rates',
      success: false
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Helper function to convert state name to abbreviation
function getStateAbbreviationFromName(stateName) {
  const stateMap = {
    'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR', 'California': 'CA',
    'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE', 'Florida': 'FL', 'Georgia': 'GA',
    'Hawaii': 'HI', 'Idaho': 'ID', 'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA',
    'Kansas': 'KS', 'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD',
    'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS', 'Missouri': 'MO',
    'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV', 'New Hampshire': 'NH', 'New Jersey': 'NJ',
    'New Mexico': 'NM', 'New York': 'NY', 'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH',
    'Oklahoma': 'OK', 'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
    'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT', 'Vermont': 'VT',
    'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV', 'Wisconsin': 'WI', 'Wyoming': 'WY'
  };
  return stateMap[stateName];
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Tax Rate API server running on port ${PORT}`);
  console.log(`Available endpoints:`);
  console.log(`  GET /api/tax-rates - Get all state tax rates`);
  console.log(`  GET /api/tax-rate/:state - Get specific state tax rate`);
  console.log(`  GET /api/tax-rate-by-location?lat=X&lng=Y - Get tax rate by coordinates`);
  console.log(`  GET /api/health - Health check`);
});
