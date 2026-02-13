// server.js - Tax Rate API Server (NO CACHING)
// Always returns fresh data, no caching
// Deploy to Render for free hosting

const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS so the calculator can fetch from this API
app.use(cors());

// City and ZIP code level tax rates (accurate combined rates)
const getCityTaxRates = () => {
  return {
    // Oklahoma cities
    'Moore': 0.085,           // 4.5% state + 0.25% county + 3.75% city = 8.5%
    'Norman': 0.0875,         // 4.5% state + 0.125% county + 4.125% city = 8.75%
    'Oklahoma City': 0.08625, // 4.5% state + 0% county + 4.125% city = 8.625%
    'Tulsa': 0.08517,         // 4.5% state + 0.367% county + 3.65% city = 8.517%
    'Broken Arrow': 0.08875,  // Tulsa County area = 8.875%
    'Edmond': 0.0875,         // Oklahoma County = 8.75%
    'Lawton': 0.0825,         // Comanche County = 8.25%
    'Stillwater': 0.0875,     // Payne County = 8.75%
    'Mustang': 0.085,         // Canadian County = 8.5%
    'Yukon': 0.085,           // Canadian County = 8.5%
    'Midwest City': 0.085,    // Oklahoma County = 8.5%
    'Del City': 0.085,        // Oklahoma County = 8.5%
    'Ardmore': 0.085,         // Carter County = 8.5%
    'Bartlesville': 0.085,    // Osage County = 8.5%
    'Muskogee': 0.0875,       // Muskogee County = 8.75%
    'Enid': 0.0825,           // Garfield County = 8.25%
    'Shawnee': 0.0825,        // Pottawatomie County = 8.25%
    'Durant': 0.0875,         // Bryan County = 8.75%
    'Chickasha': 0.0825,      // Grady County = 8.25%
    'Altus': 0.0825,          // Jackson County = 8.25%
    'McAlester': 0.0875,      // Pittsburg County = 8.75%
    'Ponca City': 0.085,      // Kay County = 8.5%
    'Pryor': 0.085,           // Mayes County = 8.5%
    'Tahlequah': 0.0875,      // Cherokee County = 8.75%
    'Wagoner': 0.085,         // Wagoner County = 8.5%
  };
};

// State tax rates (fallback if city not found)
const getStateTaxRates = () => {
  return {
    'AL': { state: 0.04, avgLocal: 0.0546, combined: 0.0946, source: 'Tax Foundation 2026' },
    'AK': { state: 0.00, avgLocal: 0.0182, combined: 0.0182, source: 'Tax Foundation 2026' },
    'AZ': { state: 0.056, avgLocal: 0.0292, combined: 0.0852, source: 'Tax Foundation 2026' },
    'AR': { state: 0.065, avgLocal: 0.0296, combined: 0.0946, source: 'Tax Foundation 2026' },
    'CA': { state: 0.0725, avgLocal: 0.0174, combined: 0.0899, source: 'Tax Foundation 2026' },
    'CO': { state: 0.029, avgLocal: 0.0499, combined: 0.0789, source: 'Tax Foundation 2026' },
    'CT': { state: 0.0635, avgLocal: 0.00, combined: 0.0635, source: 'Tax Foundation 2026' },
    'DE': { state: 0.00, avgLocal: 0.00, combined: 0.00, source: 'Tax Foundation 2026' },
    'FL': { state: 0.06, avgLocal: 0.0098, combined: 0.0698, source: 'Tax Foundation 2026' },
    'GA': { state: 0.04, avgLocal: 0.0349, combined: 0.0749, source: 'Tax Foundation 2026' },
    'HI': { state: 0.04, avgLocal: 0.005, combined: 0.045, source: 'Tax Foundation 2026' },
    'ID': { state: 0.06, avgLocal: 0.0003, combined: 0.0603, source: 'Tax Foundation 2026' },
    'IL': { state: 0.0625, avgLocal: 0.0271, combined: 0.0896, source: 'Tax Foundation 2026' },
    'IN': { state: 0.07, avgLocal: 0.00, combined: 0.07, source: 'Tax Foundation 2026' },
    'IA': { state: 0.06, avgLocal: 0.0094, combined: 0.0694, source: 'Tax Foundation 2026' },
    'KS': { state: 0.065, avgLocal: 0.0219, combined: 0.0869, source: 'Tax Foundation 2026' },
    'KY': { state: 0.06, avgLocal: 0.00, combined: 0.06, source: 'Tax Foundation 2026' },
    'LA': { state: 0.05, avgLocal: 0.0511, combined: 0.1011, source: 'Tax Foundation 2026' },
    'ME': { state: 0.055, avgLocal: 0.00, combined: 0.055, source: 'Tax Foundation 2026' },
    'MD': { state: 0.06, avgLocal: 0.00, combined: 0.06, source: 'Tax Foundation 2026' },
    'MA': { state: 0.0625, avgLocal: 0.00, combined: 0.0625, source: 'Tax Foundation 2026' },
    'MI': { state: 0.06, avgLocal: 0.00, combined: 0.06, source: 'Tax Foundation 2026' },
    'MN': { state: 0.06875, avgLocal: 0.0126, combined: 0.0814, source: 'Tax Foundation 2026' },
    'MS': { state: 0.07, avgLocal: 0.0006, combined: 0.0706, source: 'Tax Foundation 2026' },
    'MO': { state: 0.04225, avgLocal: 0.0422, combined: 0.0844, source: 'Tax Foundation 2026' },
    'MT': { state: 0.00, avgLocal: 0.00, combined: 0.00, source: 'Tax Foundation 2026' },
    'NE': { state: 0.055, avgLocal: 0.0148, combined: 0.0698, source: 'Tax Foundation 2026' },
    'NV': { state: 0.0685, avgLocal: 0.0139, combined: 0.0824, source: 'Tax Foundation 2026' },
    'NH': { state: 0.00, avgLocal: 0.00, combined: 0.00, source: 'Tax Foundation 2026' },
    'NJ': { state: 0.06625, avgLocal: -0.0002, combined: 0.066, source: 'Tax Foundation 2026' },
    'NM': { state: 0.04875, avgLocal: 0.0279, combined: 0.0767, source: 'Tax Foundation 2026' },
    'NY': { state: 0.04, avgLocal: 0.0454, combined: 0.0854, source: 'Tax Foundation 2026' },
    'NC': { state: 0.0475, avgLocal: 0.0225, combined: 0.07, source: 'Tax Foundation 2026' },
    'ND': { state: 0.05, avgLocal: 0.0209, combined: 0.0709, source: 'Tax Foundation 2026' },
    'OH': { state: 0.0575, avgLocal: 0.0154, combined: 0.0729, source: 'Tax Foundation 2026' },
    'OK': { state: 0.045, avgLocal: 0.0456, combined: 0.0906, source: 'Tax Foundation 2026' },
    'OR': { state: 0.00, avgLocal: 0.00, combined: 0.00, source: 'Tax Foundation 2026' },
    'PA': { state: 0.06, avgLocal: 0.0034, combined: 0.0634, source: 'Tax Foundation 2026' },
    'RI': { state: 0.07, avgLocal: 0.00, combined: 0.07, source: 'Tax Foundation 2026' },
    'SC': { state: 0.06, avgLocal: 0.0149, combined: 0.0749, source: 'Tax Foundation 2026' },
    'SD': { state: 0.042, avgLocal: 0.0191, combined: 0.0611, source: 'Tax Foundation 2026' },
    'TN': { state: 0.07, avgLocal: 0.0261, combined: 0.0961, source: 'Tax Foundation 2026' },
    'TX': { state: 0.0625, avgLocal: 0.0195, combined: 0.082, source: 'Tax Foundation 2026' },
    'UT': { state: 0.061, avgLocal: 0.0132, combined: 0.0742, source: 'Tax Foundation 2026' },
    'VT': { state: 0.06, avgLocal: 0.0039, combined: 0.0639, source: 'Tax Foundation 2026' },
    'VA': { state: 0.053, avgLocal: 0.0047, combined: 0.0577, source: 'Tax Foundation 2026' },
    'WA': { state: 0.065, avgLocal: 0.0301, combined: 0.0951, source: 'Tax Foundation 2026' },
    'WV': { state: 0.06, avgLocal: 0.0059, combined: 0.0659, source: 'Tax Foundation 2026' },
    'WI': { state: 0.05, avgLocal: 0.0072, combined: 0.0572, source: 'Tax Foundation 2026' },
    'WY': { state: 0.04, avgLocal: 0.0156, combined: 0.0556, source: 'Tax Foundation 2026' }
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
app.get('/api/tax-rates', (req, res) => {
  try {
    const rates = getStateTaxRates();
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
app.get('/api/tax-rate/:state', (req, res) => {
  try {
    const state = req.params.state.toUpperCase();
    const rates = getStateTaxRates();
    
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

// GET /api/tax-rate-by-location - Get tax rate by coordinates or city name
app.get('/api/tax-rate-by-location', async (req, res) => {
  try {
    const { lat, lng, city } = req.query;
    
    // If city name is provided, check city rates first
    if (city) {
      const cityRates = getCityTaxRates();
      const cityRate = cityRates[city];
      
      if (cityRate !== undefined) {
        return res.json({
          success: true,
          city: city,
          taxRate: cityRate,
          combined: cityRate,
          source: 'City-Level Rate (Fresh)'
        });
      }
    }
    
    // Otherwise use coordinates
    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        error: 'Latitude and longitude required, or city name'
      });
    }

    // Use Nominatim to reverse geocode coordinates to state/city
    const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
    const locationResponse = await fetch(nominatimUrl);
    const locationData = await locationResponse.json();
    
    const detectedCity = locationData.address?.city || locationData.address?.town || locationData.address?.village;
    const stateFull = locationData.address?.state;
    
    // First check if we have a specific city rate
    if (detectedCity) {
      const cityRates = getCityTaxRates();
      const cityRate = cityRates[detectedCity];
      
      if (cityRate !== undefined) {
        return res.json({
          success: true,
          city: detectedCity,
          state: stateFull,
          taxRate: cityRate,
          combined: cityRate,
          source: 'City-Level Rate (Fresh)'
        });
      }
    }
    
    // Fall back to state rate if no city rate found
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

    const rates = getStateTaxRates();
    const rateData = rates[stateAbbr];

    res.json({
      success: true,
      city: detectedCity || 'Unknown',
      state: stateAbbr,
      taxRate: rateData.combined,
      ...rateData,
      source: 'State Average Rate (Fresh, City Not Found)'
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
  console.log(`⚡ NO CACHING - Always returns fresh data`);
  console.log(`\n📡 Available Endpoints:`);
  console.log(`   ✓ GET /api/health`);
  console.log(`   ✓ GET /api/tax-rates`);
  console.log(`   ✓ GET /api/tax-rate/:state`);
  console.log(`   ✓ GET /api/tax-rate-by-location?lat=X&lng=Y`);
  console.log(`   ✓ GET /api/tax-rate-by-location?city=CityName\n`);
});
