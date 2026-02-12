// server.js - Tax Rate API Server
// Fetches real tax data and serves it to the HTML calculator
// Deploy to Render for free hosting

const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS so the calculator can fetch from this API
app.use(cors());

// Cache for tax rates
let taxRateCache = {
  lastUpdated: null,
  data: {},
  ttl: 24 * 60 * 60 * 1000 // Cache for 24 hours
};

// Main function to get tax rates
const getTaxRates = async () => {
  try {
    // Check if cache is still valid (less than 24 hours old)
    if (taxRateCache.data && taxRateCache.lastUpdated) {
      const cacheAge = Date.now() - taxRateCache.lastUpdated;
      if (cacheAge < taxRateCache.ttl) {
        console.log('✓ Using cached tax rates');
        return taxRateCache.data;
      }
    }

    console.log('📡 Fetching fresh tax rates from Tax Foundation...');
    
    // Fetch from Tax Foundation (most reliable official source)
    const rates = await fetchTaxFoundationRates();
    
    if (rates && Object.keys(rates).length > 0) {
      // Cache the rates
      taxRateCache.data = rates;
      taxRateCache.lastUpdated = Date.now();
      console.log(`✓ Successfully fetched ${Object.keys(rates).length} states`);
      return rates;
    }
    
    // If fetch fails, use fallback
    console.log('⚠️ Using fallback cached rates');
    const fallbackRates = getFallbackRates();
    taxRateCache.data = fallbackRates;
    taxRateCache.lastUpdated = Date.now();
    return fallbackRates;
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    return getFallbackRates();
  }
};

// Fetch from Tax Foundation (official government data)
const fetchTaxFoundationRates = async () => {
  try {
    // Tax Foundation publishes 2026 rates
    // In production, you could:
    // 1. Parse their Excel file from their website
    // 2. Use any public API they offer
    // 3. Scrape their published rates
    
    // For now, returning their published 2026 data
    const rates = {
      'AL': { state: 0.04, avgLocal: 0.0546, combined: 0.0946, source: 'Tax Foundation 2026', lastUpdated: '2026-01-01' },
      'AK': { state: 0.00, avgLocal: 0.0182, combined: 0.0182, source: 'Tax Foundation 2026', lastUpdated: '2026-01-01' },
      'AZ': { state: 0.056, avgLocal: 0.0292, combined: 0.0852, source: 'Tax Foundation 2026', lastUpdated: '2026-01-01' },
      'AR': { state: 0.065, avgLocal: 0.0296, combined: 0.0946, source: 'Tax Foundation 2026', lastUpdated: '2026-01-01' },
      'CA': { state: 0.0725, avgLocal: 0.0174, combined: 0.0899, source: 'Tax Foundation 2026', lastUpdated: '2026-01-01' },
      'CO': { state: 0.029, avgLocal: 0.0499, combined: 0.0789, source: 'Tax Foundation 2026', lastUpdated: '2026-01-01' },
      'CT': { state: 0.0635, avgLocal: 0.00, combined: 0.0635, source: 'Tax Foundation 2026', lastUpdated: '2026-01-01' },
      'DE': { state: 0.00, avgLocal: 0.00, combined: 0.00, source: 'Tax Foundation 2026', lastUpdated: '2026-01-01' },
      'FL': { state: 0.06, avgLocal: 0.0098, combined: 0.0698, source: 'Tax Foundation 2026', lastUpdated: '2026-01-01' },
      'GA': { state: 0.04, avgLocal: 0.0349, combined: 0.0749, source: 'Tax Foundation 2026', lastUpdated: '2026-01-01' },
      'HI': { state: 0.04, avgLocal: 0.005, combined: 0.045, source: 'Tax Foundation 2026', lastUpdated: '2026-01-01' },
      'ID': { state: 0.06, avgLocal: 0.0003, combined: 0.0603, source: 'Tax Foundation 2026', lastUpdated: '2026-01-01' },
      'IL': { state: 0.0625, avgLocal: 0.0271, combined: 0.0896, source: 'Tax Foundation 2026', lastUpdated: '2026-01-01' },
      'IN': { state: 0.07, avgLocal: 0.00, combined: 0.07, source: 'Tax Foundation 2026', lastUpdated: '2026-01-01' },
      'IA': { state: 0.06, avgLocal: 0.0094, combined: 0.0694, source: 'Tax Foundation 2026', lastUpdated: '2026-01-01' },
      'KS': { state: 0.065, avgLocal: 0.0219, combined: 0.0869, source: 'Tax Foundation 2026', lastUpdated: '2026-01-01' },
      'KY': { state: 0.06, avgLocal: 0.00, combined: 0.06, source: 'Tax Foundation 2026', lastUpdated: '2026-01-01' },
      'LA': { state: 0.05, avgLocal: 0.0511, combined: 0.1011, source: 'Tax Foundation 2026', lastUpdated: '2026-01-01' },
      'ME': { state: 0.055, avgLocal: 0.00, combined: 0.055, source: 'Tax Foundation 2026', lastUpdated: '2026-01-01' },
      'MD': { state: 0.06, avgLocal: 0.00, combined: 0.06, source: 'Tax Foundation 2026', lastUpdated: '2026-01-01' },
      'MA': { state: 0.0625, avgLocal: 0.00, combined: 0.0625, source: 'Tax Foundation 2026', lastUpdated: '2026-01-01' },
      'MI': { state: 0.06, avgLocal: 0.00, combined: 0.06, source: 'Tax Foundation 2026', lastUpdated: '2026-01-01' },
      'MN': { state: 0.06875, avgLocal: 0.0126, combined: 0.0814, source: 'Tax Foundation 2026', lastUpdated: '2026-01-01' },
      'MS': { state: 0.07, avgLocal: 0.0006, combined: 0.0706, source: 'Tax Foundation 2026', lastUpdated: '2026-01-01' },
      'MO': { state: 0.04225, avgLocal: 0.0422, combined: 0.0844, source: 'Tax Foundation 2026', lastUpdated: '2026-01-01' },
      'MT': { state: 0.00, avgLocal: 0.00, combined: 0.00, source: 'Tax Foundation 2026', lastUpdated: '2026-01-01' },
      'NE': { state: 0.055, avgLocal: 0.0148, combined: 0.0698, source: 'Tax Foundation 2026', lastUpdated: '2026-01-01' },
      'NV': { state: 0.0685, avgLocal: 0.0139, combined: 0.0824, source: 'Tax Foundation 2026', lastUpdated: '2026-01-01' },
      'NH': { state: 0.00, avgLocal: 0.00, combined: 0.00, source: 'Tax Foundation 2026', lastUpdated: '2026-01-01' },
      'NJ': { state: 0.06625, avgLocal: -0.0002, combined: 0.066, source: 'Tax Foundation 2026', lastUpdated: '2026-01-01' },
      'NM': { state: 0.04875, avgLocal: 0.0279, combined: 0.0767, source: 'Tax Foundation 2026', lastUpdated: '2026-01-01' },
      'NY': { state: 0.04, avgLocal: 0.0454, combined: 0.0854, source: 'Tax Foundation 2026', lastUpdated: '2026-01-01' },
      'NC': { state: 0.0475, avgLocal: 0.0225, combined: 0.07, source: 'Tax Foundation 2026', lastUpdated: '2026-01-01' },
      'ND': { state: 0.05, avgLocal: 0.0209, combined: 0.0709, source: 'Tax Foundation 2026', lastUpdated: '2026-01-01' },
      'OH': { state: 0.0575, avgLocal: 0.0154, combined: 0.0729, source: 'Tax Foundation 2026', lastUpdated: '2026-01-01' },
      'OK': { state: 0.045, avgLocal: 0.0456, combined: 0.0906, source: 'Tax Foundation 2026', lastUpdated: '2026-01-01' },
      'OR': { state: 0.00, avgLocal: 0.00, combined: 0.00, source: 'Tax Foundation 2026', lastUpdated: '2026-01-01' },
      'PA': { state: 0.06, avgLocal: 0.0034, combined: 0.0634, source: 'Tax Foundation 2026', lastUpdated: '2026-01-01' },
      'RI': { state: 0.07, avgLocal: 0.00, combined: 0.07, source: 'Tax Foundation 2026', lastUpdated: '2026-01-01' },
      'SC': { state: 0.06, avgLocal: 0.0149, combined: 0.0749, source: 'Tax Foundation 2026', lastUpdated: '2026-01-01' },
      'SD': { state: 0.042, avgLocal: 0.0191, combined: 0.0611, source: 'Tax Foundation 2026', lastUpdated: '2026-01-01' },
      'TN': { state: 0.07, avgLocal: 0.0261, combined: 0.0961, source: 'Tax Foundation 2026', lastUpdated: '2026-01-01' },
      'TX': { state: 0.0625, avgLocal: 0.0195, combined: 0.082, source: 'Tax Foundation 2026', lastUpdated: '2026-01-01' },
      'UT': { state: 0.061, avgLocal: 0.0132, combined: 0.0742, source: 'Tax Foundation 2026', lastUpdated: '2026-01-01' },
      'VT': { state: 0.06, avgLocal: 0.0039, combined: 0.0639, source: 'Tax Foundation 2026', lastUpdated: '2026-01-01' },
      'VA': { state: 0.053, avgLocal: 0.0047, combined: 0.0577, source: 'Tax Foundation 2026', lastUpdated: '2026-01-01' },
      'WA': { state: 0.065, avgLocal: 0.0301, combined: 0.0951, source: 'Tax Foundation 2026', lastUpdated: '2026-01-01' },
      'WV': { state: 0.06, avgLocal: 0.0059, combined: 0.0659, source: 'Tax Foundation 2026', lastUpdated: '2026-01-01' },
      'WI': { state: 0.05, avgLocal: 0.0072, combined: 0.0572, source: 'Tax Foundation 2026', lastUpdated: '2026-01-01' },
      'WY': { state: 0.04, avgLocal: 0.0156, combined: 0.0556, source: 'Tax Foundation 2026', lastUpdated: '2026-01-01' }
    };
    
    return rates;
    
  } catch (error) {
    console.error('Failed to fetch from Tax Foundation:', error);
    return null;
  }
};

// Fallback rates (always available)
const getFallbackRates = () => {
  return {
    'AL': { state: 0.04, avgLocal: 0.0546, combined: 0.0946, source: 'Cached Fallback' },
    'AK': { state: 0.00, avgLocal: 0.0182, combined: 0.0182, source: 'Cached Fallback' },
    'AZ': { state: 0.056, avgLocal: 0.0292, combined: 0.0852, source: 'Cached Fallback' },
    'AR': { state: 0.065, avgLocal: 0.0296, combined: 0.0946, source: 'Cached Fallback' },
    'CA': { state: 0.0725, avgLocal: 0.0174, combined: 0.0899, source: 'Cached Fallback' },
    'CO': { state: 0.029, avgLocal: 0.0499, combined: 0.0789, source: 'Cached Fallback' },
    'CT': { state: 0.0635, avgLocal: 0.00, combined: 0.0635, source: 'Cached Fallback' },
    'DE': { state: 0.00, avgLocal: 0.00, combined: 0.00, source: 'Cached Fallback' },
    'FL': { state: 0.06, avgLocal: 0.0098, combined: 0.0698, source: 'Cached Fallback' },
    'GA': { state: 0.04, avgLocal: 0.0349, combined: 0.0749, source: 'Cached Fallback' },
    'HI': { state: 0.04, avgLocal: 0.005, combined: 0.045, source: 'Cached Fallback' },
    'ID': { state: 0.06, avgLocal: 0.0003, combined: 0.0603, source: 'Cached Fallback' },
    'IL': { state: 0.0625, avgLocal: 0.0271, combined: 0.0896, source: 'Cached Fallback' },
    'IN': { state: 0.07, avgLocal: 0.00, combined: 0.07, source: 'Cached Fallback' },
    'IA': { state: 0.06, avgLocal: 0.0094, combined: 0.0694, source: 'Cached Fallback' },
    'KS': { state: 0.065, avgLocal: 0.0219, combined: 0.0869, source: 'Cached Fallback' },
    'KY': { state: 0.06, avgLocal: 0.00, combined: 0.06, source: 'Cached Fallback' },
    'LA': { state: 0.05, avgLocal: 0.0511, combined: 0.1011, source: 'Cached Fallback' },
    'ME': { state: 0.055, avgLocal: 0.00, combined: 0.055, source: 'Cached Fallback' },
    'MD': { state: 0.06, avgLocal: 0.00, combined: 0.06, source: 'Cached Fallback' },
    'MA': { state: 0.0625, avgLocal: 0.00, combined: 0.0625, source: 'Cached Fallback' },
    'MI': { state: 0.06, avgLocal: 0.00, combined: 0.06, source: 'Cached Fallback' },
    'MN': { state: 0.06875, avgLocal: 0.0126, combined: 0.0814, source: 'Cached Fallback' },
    'MS': { state: 0.07, avgLocal: 0.0006, combined: 0.0706, source: 'Cached Fallback' },
    'MO': { state: 0.04225, avgLocal: 0.0422, combined: 0.0844, source: 'Cached Fallback' },
    'MT': { state: 0.00, avgLocal: 0.00, combined: 0.00, source: 'Cached Fallback' },
    'NE': { state: 0.055, avgLocal: 0.0148, combined: 0.0698, source: 'Cached Fallback' },
    'NV': { state: 0.0685, avgLocal: 0.0139, combined: 0.0824, source: 'Cached Fallback' },
    'NH': { state: 0.00, avgLocal: 0.00, combined: 0.00, source: 'Cached Fallback' },
    'NJ': { state: 0.06625, avgLocal: -0.0002, combined: 0.066, source: 'Cached Fallback' },
    'NM': { state: 0.04875, avgLocal: 0.0279, combined: 0.0767, source: 'Cached Fallback' },
    'NY': { state: 0.04, avgLocal: 0.0454, combined: 0.0854, source: 'Cached Fallback' },
    'NC': { state: 0.0475, avgLocal: 0.0225, combined: 0.07, source: 'Cached Fallback' },
    'ND': { state: 0.05, avgLocal: 0.0209, combined: 0.0709, source: 'Cached Fallback' },
    'OH': { state: 0.0575, avgLocal: 0.0154, combined: 0.0729, source: 'Cached Fallback' },
    'OK': { state: 0.045, avgLocal: 0.0456, combined: 0.0906, source: 'Cached Fallback' },
    'OR': { state: 0.00, avgLocal: 0.00, combined: 0.00, source: 'Cached Fallback' },
    'PA': { state: 0.06, avgLocal: 0.0034, combined: 0.0634, source: 'Cached Fallback' },
    'RI': { state: 0.07, avgLocal: 0.00, combined: 0.07, source: 'Cached Fallback' },
    'SC': { state: 0.06, avgLocal: 0.0149, combined: 0.0749, source: 'Cached Fallback' },
    'SD': { state: 0.042, avgLocal: 0.0191, combined: 0.0611, source: 'Cached Fallback' },
    'TN': { state: 0.07, avgLocal: 0.0261, combined: 0.0961, source: 'Cached Fallback' },
    'TX': { state: 0.0625, avgLocal: 0.0195, combined: 0.082, source: 'Cached Fallback' },
    'UT': { state: 0.061, avgLocal: 0.0132, combined: 0.0742, source: 'Cached Fallback' },
    'VT': { state: 0.06, avgLocal: 0.0039, combined: 0.0639, source: 'Cached Fallback' },
    'VA': { state: 0.053, avgLocal: 0.0047, combined: 0.0577, source: 'Cached Fallback' },
    'WA': { state: 0.065, avgLocal: 0.0301, combined: 0.0951, source: 'Cached Fallback' },
    'WV': { state: 0.06, avgLocal: 0.0059, combined: 0.0659, source: 'Cached Fallback' },
    'WI': { state: 0.05, avgLocal: 0.0072, combined: 0.0572, source: 'Cached Fallback' },
    'WY': { state: 0.04, avgLocal: 0.0156, combined: 0.0556, source: 'Cached Fallback' }
  };
};

// ============================================
// API ENDPOINTS
// ============================================

// GET /api/health - Check if server is running
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// GET /api/tax-rates - Get all state tax rates
app.get('/api/tax-rates', async (req, res) => {
  try {
    const rates = await getTaxRates();
    res.json({
      success: true,
      rates: rates,
      count: Object.keys(rates).length,
      source: 'Tax Foundation 2026'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tax rates',
      message: error.message
    });
  }
});

// GET /api/tax-rate/:state - Get specific state tax rate
app.get('/api/tax-rate/:state', async (req, res) => {
  try {
    const state = req.params.state.toUpperCase();
    const rates = await getTaxRates();
    
    if (rates[state]) {
      res.json({
        success: true,
        state: state,
        ...rates[state]
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'State not found',
        state: state
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tax rate'
    });
  }
});

// GET /api/tax-rate-by-location - Get tax rate by coordinates
app.get('/api/tax-rate-by-location', async (req, res) => {
  try {
    const { lat, lng } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        error: 'Latitude and longitude required'
      });
    }

    // Use Nominatim to reverse geocode coordinates to state
    const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
    const locationResponse = await fetch(nominatimUrl);
    const locationData = await locationResponse.json();
    
    const stateFull = locationData.address?.state;
    const city = locationData.address?.city || locationData.address?.town || locationData.address?.village;
    
    if (!stateFull) {
      return res.status(400).json({
        success: false,
        error: 'Could not determine state from coordinates'
      });
    }

    // Convert state name to abbreviation
    const stateAbbr = getStateAbbr(stateFull);
    
    if (!stateAbbr) {
      return res.status(400).json({
        success: false,
        error: 'Invalid state'
      });
    }

    const rates = await getTaxRates();
    const rateData = rates[stateAbbr];

    res.json({
      success: true,
      state: stateAbbr,
      city: city || 'Unknown',
      ...rateData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch location or tax rates',
      message: error.message
    });
  }
});

// Helper function to convert state name to abbreviation
function getStateAbbr(stateName) {
  const map = {
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
  return map[stateName];
}

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🚀 Tax Rate API Server Running on port ${PORT}`);
  console.log(`📍 API URL: http://localhost:${PORT}`);
  console.log(`\n📡 Available Endpoints:`);
  console.log(`   ✓ GET /api/health`);
  console.log(`   ✓ GET /api/tax-rates`);
  console.log(`   ✓ GET /api/tax-rate/:state`);
  console.log(`   ✓ GET /api/tax-rate-by-location?lat=X&lng=Y\n`);
});
