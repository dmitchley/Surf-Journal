const asyncHandler = require("express-async-handler");
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

// Get all koel bay data
// public with get req
// route is /api/spots/koelbay

const url = "https://magicseaweed.com/Kogel-Bay-Surf-Report/4424/";

const getkoelbay = (req, res) => {
  // axios get to the url above
  // using cherrio to scrape that page for the data
  axios(url).then((response) => {
    const html = response.data;

    const $ = cheerio.load(html);
    const timearr = [];

    $(".nopadding-left small", html).each(function () {
      timearr.push($(this).text());
    });

    const waveHeightarr = [];

    $(".table-forecast-breaking-wave").each(function () {
      waveHeightarr.push($(this).text());
    });

    const waveDirection = [];

    $("td.text-center.msw-js-tooltip.background-gray-lighter").each(
      function () {
        waveDirection.push(this.attribs.title);
      }
    );

    const windDirection = [];

    $("td.text-center.last.msw-js-tooltip.td-square").each(function () {
      windDirection.push(this.attribs.title);
    });

    // format a new array
    const newArr = [];

    newArr.push([
      timearr.map((time, index) => ({
        time,
        waveHeight: waveHeightarr[index],
        waveDirectionSS: waveDirection[index],
        wind: windDirection[index],
      })),
    ]);
    res.json(newArr);
  });
};

const urlbikini =
  "https://magicseaweed.com/Bikini-Beach-Gordons-Bay-Surf-Report/3781/";

const getBikiniBeach = (req, res) => {
  // axios get to the url above
  // using cherrio to scrape that page for the data
  axios(urlbikini).then((response) => {
    const html = response.data;

    const $ = cheerio.load(html);
    const timearr = [];

    $(".nopadding-left small", html).each(function () {
      timearr.push($(this).text());
    });

    const waveHeightarr = [];

    $(".table-forecast-breaking-wave").each(function () {
      waveHeightarr.push($(this).text());
    });

    const waveDirection = [];

    $("td.text-center.msw-js-tooltip.background-gray-lighter").each(
      function () {
        waveDirection.push(this.attribs.title);
      }
    );

    const windDirection = [];

    $("td.text-center.last.msw-js-tooltip.td-square").each(function () {
      windDirection.push(this.attribs.title);
    });

    // format a new array
    const newArrBikini = [];

    newArrBikini.push([
      timearr.map((time, index) => ({
        time,
        waveHeight: waveHeightarr[index],
        waveDirectionSS: waveDirection[index],
        wind: windDirection[index],
      })),
    ]);
    res.json(newArrBikini);
  });
};

module.exports = { getkoelbay, getBikiniBeach };
