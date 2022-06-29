import {
  Secp256k1Wallet,
  encodeSecp256k1Pubkey,
} from "@cosmjs/amino";
import {
  SigningStargateClient,
} from '@cosmjs/stargate'
import {
  TxRaw
} from "cosmjs-types/cosmos/tx/v1beta1/tx";

class Util {

  async init() {
    return false;
  }
  
  async singleSign(signingInstruction, key, prefix) {
    const wallet = await Secp256k1Wallet.fromKey(key, prefix);
    const pubkey = encodeSecp256k1Pubkey((await wallet.getAccounts())[0].pubkey);
    const address = (await wallet.getAccounts())[0].address;
    const signingClient = await SigningStargateClient.offline(wallet);
    const signerData = {
      accountNumber: signingInstruction.accountNumber,
      sequence: signingInstruction.sequence,
      chainId: signingInstruction.chainId,
    };
    try {
      const signedTx = await signingClient.sign(
        address,
        signingInstruction.msgs,
        signingInstruction.fee,
        signingInstruction.memo,
        signerData,
      );

      const txBytes = TxRaw.encode(signedTx).finish();
      const txBytesBase64 = Buffer.from(txBytes).toString('base64')
  
      return txBytesBase64

    } catch (err) {
      console.log(err);
    }
  }

  translateTx(msg){
    switch (msg.type) {
      case 'cosmos-sdk/MsgSend':
        return {
          typeUrl: '/cosmos.bank.v1beta1.MsgSend',
          value: {
            fromAddress: msg.value.from_address,
            toAddress: msg.value.to_address,
            amount: msg.value.amount
          }
        }

      break;

      case 'cosmos-sdk/MsgDelegate':
        return {
          typeUrl: '/cosmos.staking.v1beta1.MsgDelegate',
          value: {
            delegatorAddress: msg.value.delegator_address,
            validatorAddress: msg.value.validator_address,
            amount: msg.value.amount
          }
        }

      break;

      case 'cosmos-sdk/MsgUndelegate':
        return {
          typeUrl: '/cosmos.staking.v1beta1.MsgUndelegate',
          value: {
            delegatorAddress: msg.value.delegator_address,
            validatorAddress: msg.value.validator_address,
            amount: msg.value.amount
          }
        }

      break;

      case 'cosmos-sdk/MsgBeginRedelegate':
        return {
          typeUrl: '/cosmos.staking.v1beta1.MsgBeginRedelegate',
          value: {
            delegatorAddress: msg.value.delegator_address,
            validatorSrcAddress: msg.value.validator_src_address,
            validatorDstAddress: msg.value.validator_dst_address,
            amount: msg.value.amount
          }
        }

      break;

      case 'cosmos-sdk/MsgWithdrawDelegationReward':
        return {
          typeUrl: '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
          value: {
            delegatorAddress: msg.value.delegator_address,
            validatorAddress: msg.value.validator_address,
          }
        }
      break;

      case 'cosmos-sdk/MsgWithdrawValidatorCommission':
        return {
          typeUrl: '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
          value: {
            delegatorAddress: msg.value.delegator_address,
            validatorAddress: msg.value.validator_address,
          }
        }
      break;

      default:
        return 'The file does not seem to contain a valid transaction structure.';
    }
  }

  timestampToDate(timestamp) {
    var date = new Date(timestamp);
    var Y = date.getFullYear() + '-';
    var M =
      (date.getMonth() + 1 < 10 ?
        '0' + (date.getMonth() + 1) :
        date.getMonth() + 1) + '-';
    var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
    var h =
      (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var m =
      (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) +
      ':';
    var s =
      date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return Y + M + D + h + m + s;
  }

  stringToCapitalize(str) {
    var arr = str.toLowerCase().split('_');
    arr = arr.map(function (val) {
      if (val == 'new') {
        val = 'place';
      }
      val = val.slice(0, 1).toUpperCase() + val.slice(1);
      return val;
    });
    return arr.join(' ');
  }

  /**
   * cookie
   */
  isElectron() {
    // Renderer process
    if (
      typeof window !== 'undefined' &&
      typeof window.process === 'object' &&
      window.process.type === 'renderer'
    ) {
      return true;
    }

    // Main process
    if (
      typeof process !== 'undefined' &&
      typeof process.versions === 'object' &&
      !!process.versions.electron
    ) {
      return true;
    }

    // Detect the user agent when the `nodeIntegration` option is set to true
    if (
      typeof navigator === 'object' &&
      typeof navigator.userAgent === 'string' &&
      navigator.userAgent.indexOf('Electron') >= 0
    ) {
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
    if (
      options.expires &&
      (typeof options.expires == 'number' || options.expires.toUTCString)
    ) {
      var date;
      if (typeof options.expires == 'number') {
        date = new Date();
        date.setTime(date.getTime() + options.expires * 24 * 60 * 60 * 1000);
      } else {
        date = options.expires;
      }
      expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
    }
    var path = options.path ? '; path=' + options.path : '';
    var domain = options.domain ? '; domain=' + options.domain : '';
    // var s = [cookie, expires, path, domain, secure].join("");
    var secure = options.secure ? '; secure' : '';
    var c = [name, '=', encodeURIComponent(value)].join('');
    var cookie = [c, expires, path, domain, secure].join('');

    if (!this.isElectron()) {
      options = options || {};
      document.cookie = cookie;
    } else {
      const electron = window.require('electron');

      const cookissse = {
        url: 'http://localhost:8484',
        name: name,
        value: value,
      };

      electron.remote.session.defaultSession.cookies.set(cookissse).then(
        () => {
          //
        },
        error => {
          console.error(error);
        },
      );
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
          if (cookie.substring(0, name.length + 1) == name + '=') {
            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
            break;
          }
        }
      }
    } else {
      const electron = window.require('electron');
      cookieValue = await electron.remote.session.defaultSession.cookies
        .get({
          url: 'http://localhost:8484',
          name: name
        })
        .then(
          cookies => {
            if (cookies && cookies.length) {
              return cookies[0].value;
            }
            return null;
          },
          error => {
            console.error(error);
          },
        );
    }
    return cookieValue;
  }

  addCommas(nStr, n = 2) {
    if (typeof nStr == 'string') {
      nStr = parseFloat(nStr);
    }
    if (typeof nStr == 'number') {
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
      return num;
    }

    var str = '' + num;
    if (!/e/i.test(str)) {
      return num;
    }

    return num.toFixed(18).replace(/\.?0+$/, '');
  }

  populate(a, account, index) {
    let seeds = account.match(/.{1,3}/g);
    var hexValues = [
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      'a',
      'b',
      'c',
      'd',
      'e',
    ];

    for (var i = 6 * (index - 1); i < 6 * index; i++) {
      Math.seedrandom(seeds[i]);
      var x = Math.round(Math.random() * 14);
      var y = hexValues[x];
      a += y;
    }
    return a;
  }

  shadeColor(color, percent) {
    var R = parseInt(color.substring(1, 3), 16);
    var G = parseInt(color.substring(3, 5), 16);
    var B = parseInt(color.substring(5, 7), 16);

    R = parseInt((R * (100 + percent)) / 100);
    G = parseInt((G * (100 + percent)) / 100);
    B = parseInt((B * (100 + percent)) / 100);

    R = R < 255 ? R : 255;
    G = G < 255 ? G : 255;
    B = B < 255 ? B : 255;

    var RR = R.toString(16).length == 1 ? '0' + R.toString(16) : R.toString(16);
    var GG = G.toString(16).length == 1 ? '0' + G.toString(16) : G.toString(16);
    var BB = B.toString(16).length == 1 ? '0' + B.toString(16) : B.toString(16);

    return '#' + RR + GG + BB;
  }

  pickGradient(account) {
    /* let colors = [
      'E0BBE4',
      '957DAD',
      'D291BC',
      'FEC8D8',
      'FFDFD3',
      'FCE2C2',
      'B3C8C8',
      '6CB2D1',
      '4F9EC4',
      '58949C',
      'DF9881',
      'F2D7B4',
      '7CAA98',
      '8FC1A9',
      'C8D6B9',
      'F9665E',
      'FEC9C9',
      'EEF1E6',
      'AFC7D0',
      '95B4CC',
    ]; */

    let colors = ['052480', '0A47FF', '031240', '0940E6', 'B38100', 'FFBB0A'];
    // let colors = ['2c363f','2c363f']

    let seeds = account.match(/.{1,3}/g);
    Math.seedrandom(seeds[seeds.length - 2]);
    var x = Math.round(Math.random() * colors.length);

    return '#' + colors[x];
  }

  generateWalletGradient(address) {
    const newColor1 = util.pickGradient(address);
    const newColor2 = util.shadeColor(newColor1, 0);
    const angle = 90;

    const gradient =
      'linear-gradient(' + angle + 'deg, ' + newColor1 + ', ' + newColor2 + ')';
    return gradient;
  }

  download(filename, doc, data) {
    let href =
      'data:text/plain;charset=utf-8,' +
      encodeURIComponent(data);

    var element = doc.createElement('a');
    element.setAttribute('href', href);
    element.setAttribute('download', filename);

    element.style.display = 'none';
    doc.body.appendChild(element);

    element.click();
    doc.body.removeChild(element);
  }

  getFormatedDate() {
    var date_today = new Date();
    var date_today_s;
    date_today_s = ('0' + date_today.getDate()).slice(-2) +
      ('0' + (date_today.getMonth() + 1)).slice(-2) +
      date_today.getFullYear();
    return date_today_s
  }

  shortenAddress(address_) {
    return address_.slice(0, 9) + "..." + address_.slice(-5, address_.length);
  }
}

let util = new Util();

export default util;