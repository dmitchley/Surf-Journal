const asyncHandler = require("express-async-handler");
const express = require("express");

// Mock data generator for Kogel Bay with 8 time slots per day
const generateKogelBayData = () => {
  const times = [
    // Day 1 - Today (8 slots)
    "12am", "3am", "6am", "9am", "12pm", "3pm", "6pm", "9pm",
    // Day 2 - Tomorrow (8 slots)
    "12am", "3am", "6am", "9am", "12pm", "3pm", "6pm", "9pm",
    // Day 3 - Day after (8 slots)
    "12am", "3am", "6am", "9am", "12pm", "3pm", "6pm", "9pm"
  ];

  const waveHeights = [
    // Day 1 - Moderate conditions
    "1.0-1.2m", "1.1-1.4m", "1.2-1.8m", "1.5-2.1m", "1.8-2.4m", "2.0-2.6m", "1.8-2.4m", "1.5-2.1m",
    // Day 2 - Building swell  
    "1.8-2.4m", "2.0-2.6m", "2.1-2.7m", "2.4-3.0m", "2.7-3.3m", "3.0-3.6m", "2.7-3.3m", "2.4-3.0m",
    // Day 3 - Bigger day
    "2.7-3.3m", "2.9-3.5m", "3.0-3.6m", "3.3-3.9m", "3.6-4.2m", "3.3-3.9m", "3.0-3.6m", "2.7-3.3m"
  ];

  const waveDirections = [
    // Day 1 - SW swell
    "SW 225°", "SW 228°", "SW 225°", "SW 230°", "SW 235°", "SW 238°", "SW 235°", "SW 230°",
    // Day 2 - More westerly
    "WSW 240°", "WSW 245°", "WSW 240°", "W 250°", "W 255°", "W 258°", "W 255°", "W 250°",
    // Day 3 - Clean SW
    "SW 220°", "SW 218°", "SW 220°", "SW 225°", "SW 230°", "SW 232°", "SW 230°", "SW 225°"
  ];

  const windConditions = [
    // Day 1 - Varied conditions
    "5-8kph E (offshore)", "4-6kph E (offshore)", "8-12kph E (offshore)", "12-16kph SW (cross)", 
    "15-20kph SW (onshore)", "18-25kph SW (onshore)", "20-28kph SW (onshore)", "15-22kph SW (onshore)",
    // Day 2 - Stronger winds
    "8-12kph E (offshore)", "6-10kph E (offshore)", "12-18kph SE (offshore)", "16-22kph SW (cross)", 
    "20-28kph SW (onshore)", "25-32kph SW (onshore)", "28-35kph SW (onshore)", "22-30kph SW (onshore)",
    // Day 3 - Light and clean
    "4-8kph E (offshore)", "2-5kph E (offshore)", "6-10kph E (offshore)", "8-14kph SW (light)", 
    "10-15kph SW (light onshore)", "12-18kph SW (onshore)", "15-22kph SW (onshore)", "10-16kph SW (light onshore)"
  ];

  return { times, waveHeights, waveDirections, windConditions };
};

const generateBikiniBeachData = () => {
  const times = [
    // Day 1 - Today (8 slots)
    "12am", "3am", "6am", "9am", "12pm", "3pm", "6pm", "9pm",
    // Day 2 - Tomorrow (8 slots)
    "12am", "3am", "6am", "9am", "12pm", "3pm", "6pm", "9pm",
    // Day 3 - Day after (8 slots)
    "12am", "3am", "6am", "9am", "12pm", "3pm", "6pm", "9pm"
  ];

  const waveHeights = [
    // Day 1 - Smaller than Kogel Bay
    "0.6-0.9m", "0.7-1.0m", "0.8-1.2m", "1.0-1.5m", "1.2-1.8m", "1.4-2.0m", "1.2-1.8m", "1.0-1.5m",
    // Day 2 - Building but smaller
    "1.2-1.8m", "1.4-2.0m", "1.5-2.1m", "1.8-2.4m", "2.1-2.7m", "2.4-3.0m", "2.1-2.7m", "1.8-2.4m",
    // Day 3 - Good size for spot
    "2.1-2.7m", "2.2-2.8m", "2.4-3.0m", "2.7-3.3m", "3.0-3.6m", "2.7-3.3m", "2.4-3.0m", "2.1-2.7m"
  ];

  const waveDirections = [
    // Day 1 - SW swell
    "SW 210°", "SW 212°", "SW 210°", "SW 215°", "SW 220°", "SW 222°", "SW 220°", "SW 215°",
    // Day 2 - More westerly
    "WSW 225°", "WSW 228°", "WSW 225°", "W 235°", "W 240°", "W 242°", "W 240°", "W 235°",
    // Day 3 - Clean SW
    "SW 205°", "SW 203°", "SW 205°", "SW 210°", "SW 215°", "SW 217°", "SW 215°", "SW 210°"
  ];

  const windConditions = [
    // Day 1 - More sheltered
    "3-6kph E (offshore)", "2-4kph E (offshore)", "5-8kph E (light offshore)", "8-12kph SW (light)", 
    "12-18kph SW (light cross)", "15-22kph SW (moderate)", "18-25kph SW (onshore)", "12-20kph SW (moderate)",
    // Day 2 - Still protected
    "6-10kph E (offshore)", "4-8kph E (offshore)", "8-12kph SE (offshore)", "12-18kph SW (cross)", 
    "18-25kph SW (onshore)", "22-28kph SW (onshore)", "25-32kph SW (onshore)", "18-26kph SW (onshore)",
    // Day 3 - Light winds
    "2-5kph E (offshore)", "1-3kph E (offshore)", "4-8kph E (light offshore)", "6-10kph SW (very light)", 
    "8-12kph SW (very light)", "10-15kph SW (light)", "12-18kph SW (light onshore)", "8-14kph SW (light)"
  ];

  return { times, waveHeights, waveDirections, windConditions };
};

const getkoelbay = (req, res) => {
  const { times, waveHeights, waveDirections, windConditions } = generateKogelBayData();
  
  const newArr = [];
  newArr.push([
    times.map((time, index) => ({
      time,
      waveHeight: waveHeights[index],
      waveDirectionSS: waveDirections[index],
      wind: windConditions[index],
    })),
  ]);
  
  res.json(newArr);
};

const getBikiniBeach = (req, res) => {
  const { times, waveHeights, waveDirections, windConditions } = generateBikiniBeachData();
  
  const newArrBikini = [];
  newArrBikini.push([
    times.map((time, index) => ({
      time,
      waveHeight: waveHeights[index],
      waveDirectionSS: waveDirections[index],
      wind: windConditions[index],
    })),
  ]);
  
  res.json(newArrBikini);
};

module.exports = { getkoelbay, getBikiniBeach };