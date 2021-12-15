const countDown = data => new CountDown(data);
class CountDown {
  constructor(data) {
    this.data = data;
    this.timeZone = data['timeZone'] ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
    this.data['results'] = data['results'] ?? false;
    this.data['events'] = data['events'] ?? false;
    if (this.data['events']?.length > 0) {
      setInterval(() => {
        this.getAllTimesDifference();
      }, 1000);
    }
  }
  getAllTimesDifference() {
    var now = new Date(new Date().toLocaleString('en', {timeZone: this.timeZone}));
    var nextTimes = [];
    this.data['events'].map((time, index)  => {
      var theTime = this.time(index, now.getDate()) - now;
      theTime = theTime <= 0 ? this.time(index, now.getDate() + 1) - now : theTime;
      theTime > 0 && nextTimes.push(theTime);
    });
    var minimum = Math.min.apply( Math, nextTimes ),
      labelsArr = this.data['results']['eventLabel']?.length ? [...this.data['results']['eventLabel']] : [this.data['results']['eventLabel']]
    if (this.data['results']['eventLabel']) labelsArr.map(item => item.innerHTML = this.data['events'][nextTimes.indexOf(minimum)].label);
    nextTimes.length > 0 && this.convertMilliSeconds(minimum);
  }

  convertMilliSeconds(diff) {
    var msec = diff;
    var yy = Math.floor(msec / 1000 / 60 / 60 / 24 / 30 / 12);
    msec -= yy * 1000 * 60 * 60 * 24 * 30 * 12;
    var mo = Math.floor(msec / 1000 / 60 / 60 / 24 / 30);
    msec -= mo * 1000 * 60 * 60 * 24 * 30;
    var dd = Math.floor(msec / 1000 / 60 / 60 / 24);
    msec -= dd * 1000 * 60 * 60 * 24;
    var hh = Math.floor(msec / 1000 / 60 / 60);
    msec -= hh * 1000 * 60 * 60;
    var mm = Math.floor(msec / 1000 / 60);
    msec -= mm * 1000 * 60;
    var ss = Math.floor(msec / 1000);
    msec -= ss * 1000;
    var yearsArr = this.data['results']['years']?.length ? [...this.data['results']['years']] : [this.data['results']['years']],
      monthsArr = this.data['results']['months']?.length ? [...this.data['results']['months']] : [this.data['results']['months']],
      daysArr = this.data['results']['days']?.length ? [...this.data['results']['days']] : [this.data['results']['days']],
      hoursArr = this.data['results']['hours']?.length ? [...this.data['results']['hours']] : [this.data['results']['hours']],
      minutesArr = this.data['results']['minutes']?.length ? [...this.data['results']['minutes']] : [this.data['results']['minutes']],
      secondsArr = this.data['results']['seconds']?.length ? [...this.data['results']['seconds']] : [this.data['results']['seconds']];
    if (this.data['results']['years']) yearsArr.map(item => item.innerHTML = yy < 10 ? `0${yy} - ` : `${yy} - `);
    if (this.data['results']['months']) monthsArr.map(item => item.innerHTML = mo < 10 ? `0${mo} - ` : `${mo} - `);
    if (this.data['results']['days']) daysArr.map(item => item.innerHTML = dd < 10 ? `0${dd} ` : `${dd} `);
    if (this.data['results']['hours']) hoursArr.map(item => item.innerHTML = hh < 10 ? ` 0${hh} : `: ` ${hh} : `);
    if (this.data['results']['minutes']) minutesArr.map(item => item.innerHTML = mm < 10 ? `0${mm} : `: `${mm} : `);
    if (this.data['results']['seconds']) secondsArr.map(item => item.innerHTML = ss < 10 ? `0${ss}`: `${ss}`);
  }
  parseISODate(dateStringInRange) {
    var t = dateStringInRange.split(/[- :]/);
    return t.length > 3 ? new Date(new Date(t[0], t[1]-1, t[2], t[3], t[4])) : new Date(new Date(t[0], t[1]-1, t[2])) ;
  }
  getTime(day, time) {
    return this.parseISODate(`${new Date().getFullYear()}-${new Date().getMonth() + 1}-${day} ${time}`);
  }
  time(index, day) {
    return this.parseISODate(this.data['events'][index].time) == 'Invalid Date' ? this.getTime(day, this.data['events'][index].time) : this.parseISODate(this.data['events'][index].time)
  }
}