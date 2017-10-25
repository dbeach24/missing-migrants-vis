/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__pianoRoll__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__streamGraph__ = __webpack_require__(2);



const xInfo = {
  value: d => d.lon,
  scale: d3.scaleLinear(),
  label: ''
};

const yInfo = {
  value: d => d.date,
  scale: d3.scaleTime(),
  label: ''
};

const widthInfo = {
  scale: d3.scaleLinear().domain([0,1200]).range([0, 200]),
  label: ''
};

const colorInfo = {
  value: d => d.causes[0],
  scale: d3.scaleOrdinal(),
  label: 'Cause'
};

colorInfo.scale
  .domain(['Drowning/Asphyxiation', 'Exposure', 'Vehicular/Mechanical', 'Violence/Homicide', 'Medical/Illness', 'Unknown'])
  .range(['#60B0FF', '#ff8c0a', '#5e5e5e', '#cc0000', '#81c100', '#d8c6ff']);

const sizeInfo = {
  value: d => d.dead + d.missing,
  label: 'Dead/Missing',
  scale: d3.scaleSqrt().range([0, 30])
};

const margin = { left: 120, right: 300, top: 20, bottom: 120 };

const visualization = d3.select('#visualization');
const visualizationDiv = visualization.node();
const svg = visualization.select('svg');

function row(d) {
  d.missing = +d.missing;
  d.dead = +d.dead;
  
  d.date = new Date(d.date);
  
  d.lat = +d.lat;
  d.lon = +d.lon;

  // compute region (Americas / EMEA / Asia)
  var regionId, regionName;
  if(d.lon < -50) {
    regionId = 0;
    regionName = 'Americas';
  } else if(d.lon < 75) {
    regionId = 1;
    regionName = 'EMEA';
  } else {
    regionId = 2;
    regionName = 'Asia';
  }
  d.regionId = regionId;
  d.regionName = regionName;
  d.causes = eval(d.causes);
  
  return d;
}

d3.csv('data/clean/migrants.csv', row, data => {

  xInfo.scale.domain([-150, 150]);
  //xInfo.scale.domain(d3.extent(data, xInfo.value));
  yInfo.scale.domain(d3.extent(data, yInfo.value));
  sizeInfo.scale.domain(d3.extent(data, sizeInfo.value));


  const render = () => {

    // Extract the width and height that was computed by CSS.
    svg
      .attr('width', visualizationDiv.clientWidth)
      .attr('height', visualizationDiv.clientHeight);

    // Render the scatter plot.
    Object(__WEBPACK_IMPORTED_MODULE_0__pianoRoll__["a" /* default */])({
      data, xInfo, yInfo, colorInfo, sizeInfo,
      margin
    });

    Object(__WEBPACK_IMPORTED_MODULE_1__streamGraph__["a" /* default */])({
      data, yInfo, colorInfo, widthInfo, margin
    });

  }

  // Draw for the first time to initialize.
  render();

  // Redraw based on the new size whenever the browser window is resized.
  window.addEventListener('resize', render);
});


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

const svg = d3.select("svg");

const xAxis = d3.axisBottom()
   .ticks(0);

const yAxis = d3.axisLeft()
  .ticks(5)
  .tickPadding(15);

const colorLegend = d3.legendColor()
  .classPrefix('color')
  .shape('circle');

const sizeLegend = d3.legendSize()
  .shape('circle')
  .shapePadding(10)
  .classPrefix('size')
  .cells([50, 100, 200, 400, 600])
  .labels(['50', '100', '200', '400', '600']);

const zoom = d3.zoom()
  .scaleExtent([1, 20]);

/* harmony default export */ __webpack_exports__["a"] = (function (props) {
  const {
    data,
    xInfo,
    yInfo,
    colorInfo,
    sizeInfo,
    margin
  } = props;

  xAxis.scale(xInfo.scale);
  yAxis.scale(yInfo.scale);
  colorLegend.scale(colorInfo.scale);
  sizeLegend.scale(sizeInfo.scale);

  const width = svg.attr('width');
  const height = svg.attr('height');
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  xAxis.tickSize(-innerHeight);
  yAxis.tickSize(-innerWidth);

  let g = svg.selectAll('.container').data([null]);

  const gEnter = g.enter().append('g').attr('class', 'container');
  g = gEnter
    .merge(g)
      .attr('transform', `translate(${margin.left},${margin.top})`);

  const xAxisGEnter = gEnter.append('g').attr('class', 'x-axis');
  const xAxisG = xAxisGEnter
    .merge(g.select('.x-axis'))
      .attr('transform', `translate(0, ${innerHeight})`);

  const yAxisGEnter = gEnter.append('g').attr('class', 'y-axis');
  const yAxisG = yAxisGEnter.merge(g.select('.y-axis'));

  const marksGEnter = gEnter.append('g').attr('class', 'marksg');
  const marksG = marksGEnter.merge(g.select('.marksg'));

  const colorLegendGEnter = gEnter.append('g').attr('class', 'color-legend');
  const colorLegendG = colorLegendGEnter
    .merge(g.select('.color-legend'))
      .attr('transform', `translate(${innerWidth + 60}, 50)`);

  const sizeLegendGEnter = gEnter.append('g').attr('class', 'size-legend');
  const sizeLegendG = sizeLegendGEnter
    .merge(g.select('.size-legend'))
      .attr('transform', `translate(${innerWidth + 60}, 250)`);

  const zoomCatcherGEnter = gEnter.append('rect').attr('class', 'zoom-catcher');
  const zoomCatcher = zoomCatcherGEnter
    .merge(g.select('.zoom-catcher'))
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .call(zoom);

  zoom
    .extent([[0, 0], [innerWidth, innerHeight]])
    .translateExtent([[0, 0], [innerWidth, innerHeight]])
    .on("zoom", zoomed);

  xAxisGEnter
    .append('text')
      .attr('class', 'axis-label')
      .attr('y', 100)
    .merge(xAxisG.select('.axis-label'))
      .attr('x', innerWidth / 2)
      .text(xInfo.label);

  yAxisGEnter
    .append('text')
      .attr('class', 'axis-label')
      .attr('y', -60)
      .style('text-anchor', 'middle')
    .merge(yAxisG.select('.axis-label'))
      .attr('x', -innerHeight / 2)
      .attr('transform', `rotate(-90)`)
      .text(yInfo.label);

  colorLegendGEnter
    .append('text')
      .attr('class', 'legend-label')
      .attr('x', -30)
      .attr('y', -20)
    .merge(colorLegendG.select('legend-label'))
      .text(colorInfo.label);

  sizeLegendGEnter
    .append('text')
      .attr('class', 'legend-label')
      .attr('x', -30)
      .attr('y', -20)
    .merge(sizeLegendG.select('legend-label'))
      .text(sizeInfo.label);

  xInfo.scale
    .range([0, innerWidth]);

  yInfo.scale
    .range([innerHeight, 0])
    .nice();

  function updateMarkers(xScale, yScale) {

    const circles = marksG.selectAll('.mark').data(data);
    circles
      .enter().append('circle')
        .attr('class', 'mark')
        .attr('fill-opacity', 0.5)
      .merge(circles)
        .attr('cx', d => xScale(xInfo.value(d)))
        .attr('cy', d => yScale(yInfo.value(d)))
        .attr('fill', d => colorInfo.scale(colorInfo.value(d)))
        .attr('r', d => sizeInfo.scale(sizeInfo.value(d)));

  }

  updateMarkers(xInfo.scale, yInfo.scale);

  xAxisG.call(xAxis);
  yAxisG.call(yAxis);
  colorLegendG.call(colorLegend)
    .selectAll('.cell text')
      .attr('dy', '0.05em');
  sizeLegendG.call(sizeLegend)
    .selectAll('.cell text')
      .attr('dy', '0.05em');


  function zoomed() {
    const t = d3.event.transform;
    //const zoomXscale = t.rescaleX(xInfo.scale);
    const zoomYscale = t.rescaleY(yInfo.scale);
    
    //xAxisG.call(xAxis.scale(zoomXscale));
    yAxisG.call(yAxis.scale(zoomYscale));
    updateMarkers(xInfo.scale, zoomYscale);
  }

});


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

const startDate = new Date(2014, 0, 1);
const endDate = new Date(2017, 6, 1);

function dateidx(date) {
	return date.getYear() * 12 + date.getMonth();
}

function getDates() {
  var date = new Date(startDate);
  date.setDate(15);
  var result = [];
  var i = 0;
  while(date < endDate) {
    result[i++] = new Date(date);
    date.setMonth(date.getMonth() + 1);
  }
  return result;
}

function getCounts(data, layers) {
  var items = getDates().map(d => {
    var item = {date: d};
    layers.forEach(l => {item[l] = 0});
    return item;
  });
  var itemMap = {};
  items.forEach(item => {itemMap[dateidx(item.date)] = item});
  data
    .filter(d => d.date != null)
    .forEach(d => {
      var item = itemMap[dateidx(d.date)];
      if(!item) { return; }
      const ncauses = d.causes.length;
	  const value = (d.dead + d.missing) / ncauses;
	  d.causes.forEach(c => (item[c] += value));
  });
  return items;
}

const svg = d3.select("svg");

const streamG = svg.append("g");

/* harmony default export */ __webpack_exports__["a"] = (function (props) {
  const {
    data,
    yInfo,
    colorInfo,
    widthInfo,
    margin
  } = props;

  var layers = colorInfo.scale.domain();
  console.info(layers);

  var counts = getCounts(data, layers);

  var stack = d3.stack()
    .keys(layers)
    .offset(d3.stackOffsetWiggle);

  var layers0 = stack(counts);

  var area = d3.area()
    .y(d => yInfo.scale(d.data.date))
    .x0(d => widthInfo.scale(d[0]))
    .x1(d => widthInfo.scale(d[1]))
    .curve(d3.curveBasis);

  streamG.attr('transform', `translate(${margin.left}, ${margin.top})`);

  streamG.selectAll('path')
    .data(layers0)
    .enter()
      .append('path')
      .attr('d', area)
      .attr('fill', (d, i) => colorInfo.scale(layers[i]))
      .attr('stroke', 'white')
      .attr('opacity', 0.75);



});



/***/ })
/******/ ]);