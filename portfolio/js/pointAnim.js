/* Written by Aaron Coox, inspired by the design at
  https://tympanus.net/Development/AnimatedHeaderBackgrounds/
*/
'use strict';

(function(factory) {
  if (typeof define === 'function' && define.amd) {
    //AMD support
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    //NodeJS support
    module.exports = factory(require('jquery'));
  } else if (jQuery) {
    //No module loaders
    window.pointAnim = factory(jQuery);
  } else {
    console.log('Could not detect jQuery. Exiting.');
  }
})(function($) {
  var canvas, ctx, points, focus, animTimer,
    active = false, //Currently running
    initialised = false, //Was ever started
    //Some constants
    constants = {
      pointColour: '0,204,204',
      lineColour: '0,204,204',
      distances: {
        4000: {
          op: 0.8,
          line: 0.4
        },
        20000: {
          op: 0.4,
          line: 0.2,
        },
        40000: {
          op: 0.2,
          line: 0.1
        }
      },
      pointDivider: 60,
      iePointDivider: 120
    },

    api = {
      stopAnimation: stopAnimation,
      resumeAnimation: resumeAnimation,
      isActive: isActive
    };

  $(document).ready(function() {
    if (!isTouch()) {
      active = true;
      initialised = true;
      initCanvas();
      initListeners();
      initPoints();
      movePoints();
      animation();
    }
  });

  function isTouch() {
    return ('ontouchstart' in document.documentElement || navigator.maxTouchPoints);
  }

  function isIE() {
    var oldUA = window.navigator.userAgent.indexOf('MSIE '),
      newUA = window.navigator.userAgent.indexOf('Trident/');
    return (oldUA > -1 || newUA > -1);
  }

  function initCanvas() {
    canvas = document.getElementById('canvas');
    scaleCanvas();
    focus = {
      x: canvas.width / 2,
      y: canvas.height / 2
    };
    ctx = canvas.getContext('2d');
  }

  function initListeners() {
    $(window).mousemove(mouseMoveEvent);
    $(window).blur(stopAnimation);
    $(window).focus(resumeAnimation);
    $(window).resize(reScaleCanvas);
  }


  function mouseMoveEvent(event) {
    focus.x = event.pageX;
    focus.y = event.pageY;
  }

  function stopAnimation() {
    if (active && initialised) {
      active = false;
      cancelAnimationFrame(animTimer);
      for (var i = 0; i < points.length; i++) {
        cancelAnimationFrame(points[i].anim.timer);
      }
    }
  }

  function resumeAnimation() {
    if (!active && initialised) {
      active = true;
      animTimer = requestAnimationFrame(animation);
      for (var i = 0; i < points.length; i++) {
        movePointRandom(points[i]);
      }
    }
  }

  function isActive() {
    return active;
  }

  function reScaleCanvas() {
    scaleCanvas();
  }

  function scaleCanvas() {
    canvas.width = $(window).width();
    canvas.height = $(window).height();
  }

  //Shared prototype for efficiency, contains common attributes
  var pointProto = {
    draw: function() {
      if (this.opacity !== 0) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = createRgbString(constants.pointColour, this.opacity);
        ctx.fill();
      }
    },

    drawLines: function() {
      if (this.lineOpacity !== 0) {
        for (var i = 0; i < this.closest.length; i++) {
          drawLine(this, this.closest[i]);
        }
      }
    },

    calcFocus: function() {
      var distance = pointDistance(this, focus);
      if (distance < 4000) {
        this.opacity = constants.distances[4000].op;
        this.lineOpacity = constants.distances[4000].line;
      } else if (distance < 20000) {
        this.opacity = constants.distances[20000].op;
        this.lineOpacity = constants.distances[20000].line;
      } else if (distance < 40000) {
        this.opacity = constants.distances[40000].op;
        this.lineOpacity = constants.distances[40000].line;
      } else {
        this.opacity = 0;
        this.lineOpacity = 0;
      }
    },

    lineOpacity: 0,
    opacity: 0
  };

  function Point(xIn, yIn) {
    var instance = Object.create(pointProto);
    instance.startX = xIn;
    instance.startY = yIn;
    instance.radius = 2 + (Math.random() * 2);
    instance.anim = {};
    instance.anim.startPos = {};

    instance.x = xIn + (canvas.width / 25) * (Math.random() - 0.5);
    instance.y = yIn + (canvas.height / 25) * (Math.random() - 0.5);

    return instance;
  }

  function distributePoints(toCall) {
    var widthSplit = Math.ceil(canvas.width / constants.POINTSX);
    var heightSplit = Math.ceil(canvas.height / constants.POINTSY);
    for (var i = 0; i < constants.POINTSX; i++) {
      for (var j = 0; j < constants.POINTSY; j++) {
        var x = widthSplit * i;
        var y = heightSplit * j;

        toCall(i, j, x, y);
      }
    }
  }

  function initPoints() {
    var divider;
    divider = isIE() ? constants.iePointDivider : constants.pointDivider;
    constants.POINTSX = Math.ceil(canvas.width / divider);
    constants.POINTSY = Math.ceil(canvas.height / divider);

    points = [];
    distributePoints(function(i, j, x, y) {
      var point = Point(x, y);
      points.push(point);
    });
    findClosest();
  }

  function findClosest() {
    for (var i = 0; i < points.length; i++) {
      var closest = [];
      for (var j = 0; j < points.length; j++) {
        if (points[i] === points[j]) {
          continue; //Cannot add itself to closest
        }
        var distance = pointDistance(points[i], points[j]);
        for (var k = 0; k < 5; k++) {
          if (closest[k] === undefined) {
            closest[k] = points[j];
            break;
          } else if (distance < pointDistance(closest[k], points[i])) {
            closest.splice(k, 0, points[j]);
            closest.pop();
            break;
          }
        }
      }
      points[i].closest = closest;
    }
  }

  function animation() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < points.length; i++) {
      var point = points[i];
      point.calcFocus();
      point.draw();
      point.drawLines();
    }
    animTimer = requestAnimationFrame(animation);
  }

  function drawLine(point1, point2) {
    ctx.beginPath();
    ctx.strokeStyle = createRgbString(constants.lineColour, point1.lineOpacity);
    ctx.moveTo(point1.x, point1.y);
    ctx.lineTo(point2.x, point2.y);
    ctx.stroke();
  }

  function createRgbString(colour, opacity) {
    return 'rgba(' + colour + ',' + opacity + ')';
  }

  function movePoints() {
    for (var i = 0; i < points.length; i++) {
      movePointRandom(points[i]);
    }
  }

  function movePointRandom(point) {
    var endPos = {
      x: point.startX + (Math.random() * 100 - 50),
      y: point.startY + (Math.random() * 100 - 50)
    };
    movePoint(point, endPos, 1000 * (1 + Math.random()));
  }

  function movePoint(point, endPos, duration) {
    var deltaPos = {
      x: endPos.x - point.x,
      y: endPos.y - point.y
    };

    point.anim.startPos.x = point.x;
    point.anim.startPos.y = point.y;

    point.anim.timer = requestAnimationFrame(function(timeStamp) {
      point.anim.startTime = timeStamp;
      moveStep(point, timeStamp, deltaPos, duration);
    });
  }

  function moveStep(point, timestamp, deltaPos, duration) {
    var delta = timestamp - point.anim.startTime,
      divided = delta / duration,
      percent;

    if (delta < duration) {
      percent = easeInOutCirc(divided);

      point.x = point.anim.startPos.x + (deltaPos.x * percent);
      point.y = point.anim.startPos.y + (deltaPos.y * percent);

      point.anim.timer = requestAnimationFrame(function(timeStamp) {
        moveStep(point, timeStamp, deltaPos, duration);
      });
    } else {
      percent = 1;
      point.x = point.anim.startPos.x + (deltaPos.x * percent);
      point.y = point.anim.startPos.y + (deltaPos.y * percent);
      movePointRandom(point);
    }
  }

  function easeInOutCirc(t) {
    var result;
    if (t <= 0.5) {
      result = 0.5 - Math.sqrt(0.25 - Math.pow(t, 2));
    } else {
      result = 0.5 + Math.sqrt(0.25 - Math.pow(t - 1, 2));
    }
    return result;
  }

  function pointDistance(point1, point2) {
    var deltaX = Math.pow(point2.x - point1.x, 2);
    var deltaY = Math.pow(point2.y - point1.y, 2);
    return deltaX + deltaY;
  }

  return api;
});