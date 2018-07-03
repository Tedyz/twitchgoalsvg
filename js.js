'use strict';

(function () {
  var TIME = {
    millennium: 1000 * 60 * 60 * 24 * 365 * Math.pow(10, 3),
    century: 1000 * 60 * 60 * 24 * 365 * Math.pow(10, 2),
    decade: 1000 * 60 * 60 * 24 * 365 * Math.pow(10, 1),
    year: 1000 * 60 * 60 * 24 * 365,
    month: 1000 * 60 * 60 * 24 * 30,
    week: 1000 * 60 * 60 * 24 * 7,
    day: 1000 * 60 * 60 * 24,
    hour: 1000 * 60 * 60,
    minute: 1000 * 60,
    second: 1000
  };
  var ORDERED_TIME_PERIODS = ['millennium', 'century', 'decade', 'year', 'month', 'week', 'day', 'hour', 'minute', 'second'];
  var PLURAL_REPLACEMENTS = {
    centurys: 'centuries',
    millenniums: 'millennia'
  };

  function getRelativeEndDate(date) {
    date = new Date(date);
    var diff = date.getTime() - Date.now();
    var unsigned = Math.abs(diff);
    var result = void 0;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = ORDERED_TIME_PERIODS[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var key = _step.value;

        var timePeriod = TIME[key];
        if (unsigned >= timePeriod) {
          var whole = Math.floor(unsigned / timePeriod);
          result = whole + ' ' + key + (whole === 1 ? ' ' : 's ');
          for (var toReplace in PLURAL_REPLACEMENTS) {
            result = result.replace(toReplace, PLURAL_REPLACEMENTS[toReplace]);
          }
          break;
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    if (!result) {
      result = 'Right now';
    } else {
      if (diff > 0) result += 'to go';else result = 'Ended ' + result + 'ago';
    }
    return result;
  }
  function formatGoalNumber(data) {
    var fixed = 0;
    var prefix = data.currency || '';
    if (!Number.isInteger(data.amount.start) || !Number.isInteger(data.amount.current) || !Number.isInteger(data.amount.target) || data.currency) fixed = 2;
    return {
      start: prefix + data.amount.start.toFixed(fixed),
      current: prefix + data.amount.current.toFixed(fixed),
      target: prefix + data.amount.target.toFixed(fixed)
    };
  }

  //var startLabel = document.querySelector('#goal-current');
  var goalLabel = document.querySelector('#goal-total');
  var goalStart = document.querySelector('#goal-start');
  var goalLeft = document.querySelector('#goal-left');
  var progress = document.querySelector('#goal-progress');
  //var title = document.querySelector('#title');
  //var timer = document.querySelector('#goal-end-date');

  function updateData(data) {
    var p = (data.amount.current - data.amount.start) / (data.amount.target - data.amount.start) * 100;
    var origP = p;
    if (p < 0) p = 0;
    if (p > 100) p = 100;

    //title.innerHTML = data.title;
    setEndDate(data.to_go.ends_at);

    var formatted = formatGoalNumber(data);
    //startLabel.textContent = formatted.start;
    goalLabel.textContent = kFormatter(formatted.target);

    goalStart.style.width = p + '%';
    goalLeft.style.width = 100 - p + '%';

    progress.textContent = kFormatter(formatted.current); // + ' (' + Math.floor(origP) + '%)';

    var width = goalStart.parentNode.getBoundingClientRect().width;
    var offset = width * p / 100;
    if (offset <= 16) goalStart.classList.add('close-to-beginning');else goalStart.classList.remove('close-to-beginning');
    if (width - offset <= 16) goalStart.classList.add('close-to-end');else goalStart.classList.remove('close-to-end');
  }
  function setEndDate(date) {
    //timer.textContent = getRelativeEndDate(date);
  }

  function kFormatter(num) {
    return num > 999 ? (num/1000).toFixed(1) + 'k' : num
}

  function eventListener(e) {
    updateData(e.detail);
  }
  document.addEventListener('goalLoad', eventListener);
  document.addEventListener('goalEvent', eventListener);
})();