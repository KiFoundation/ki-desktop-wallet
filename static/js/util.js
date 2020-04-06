class Util {
  async init() {
    return false;
  }

  timestampToDate(timestamp) {
    var date = new Date(timestamp);
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
    var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return Y + M + D + h + m + s;
  }

  stringToCapitalize(str) {
    var arr = str.toLowerCase().split('_');
    arr = arr.map(function(val) {
      if (val == 'new') {
        val = 'place'
      }
      val = val.slice(0, 1).toUpperCase() + val.slice(1);
      return val
    })
    return arr.join(' ')
  }

  /**
   * cookie
   */
  isElectron() {
    // Renderer process
    if (typeof window !== 'undefined' && typeof window.process === 'object' && window.process.type === 'renderer') {
      return true;
    }

    // Main process
    if (typeof process !== 'undefined' && typeof process.versions === 'object' && !!process.versions.electron) {
      return true;
    }

    // Detect the user agent when the `nodeIntegration` option is set to true
    if (typeof navigator === 'object' && typeof navigator.userAgent === 'string' && navigator.userAgent.indexOf('Electron') >= 0) {
      return true;
    }

    return false;
  }

  setCookie(name, value, options) {
    if (value === null) {
      value = '';
      options.expires = -1;
    }
    var expires = '';
    if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
      var date;
      if (typeof options.expires == 'number') {
        date = new Date();
        date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
      } else {
        date = options.expires;
      }
      expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
    }
    var path = options.path ? '; path=' + options.path : '';
    var domain = options.domain ? '; domain=' + options.domain : '';
    var s = [cookie, expires, path, domain, secure].join('');
    var secure = options.secure ? '; secure' : '';
    var c = [name, '=', encodeURIComponent(value)].join('');
    var cookie = [c, expires, path, domain, secure].join('')

    if (!this.isElectron()) {
      options = options || {};
      document.cookie = cookie;
    } else {
      const electron = window.require('electron');

      const cookissse = { url: "http://localhost:8484", name: name, value: value }

      electron.remote.session.defaultSession.cookies.set(cookissse)
        .then(() => {
          //
        }, (error) => {
          console.error(error)
        })
    }
  }


  async getCookie(name) {
    var cookieValue = null;

    if (!this.isElectron()) {
    if (document.cookie && document.cookie != '') {
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) == (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          // console.log(cookieValue);
          break;
        }
      }
    }
  }
  else  {
    const electron = window.require('electron');
    cookieValue = await electron.remote.session.defaultSession.cookies.get({url: "http://localhost:8484", name: name})
      .then((cookies) => {
          // console.log(cookies[0].value)
         return cookies[0].value
      }, (error) => {
        console.error(error)

      })
    }
    // console.log("???", cookieValue);
    return cookieValue;

  }

  addCommas(nStr, n = 2) {
    if (typeof(nStr) == 'string') {
      nStr = parseFloat(nStr);
    }
    if (typeof(nStr) == 'number') {
      nStr = nStr.toFixed(n);
    }
    nStr += '';
    let x = nStr.split('.');
    let x1 = x[0];
    let x2 = x.length > 1 ? '.' + x[1] : '';
    let rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
  }

  getFullNum(num) {
    if (isNaN(num)) {
      return num
    };

    var str = '' + num;
    if (!/e/i.test(str)) {
      return num;
    };

    return (num).toFixed(18).replace(/\.?0+$/, "");
  }
}

let util = new Util;

export default util;
