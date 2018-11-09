
export function setCookie(name, value) {
  var cookie = [name, '=', JSON.stringify(value), '; domain=', window.location.host.toString().split(':')[0] + '; path=/;'].join('');
  document.cookie = cookie;
}

export function getCookie(name) {
  var result = document.cookie.match(new RegExp(name + '=([^;]+)'));
  result && (result = JSON.parse(result[1]));
  return result;
}
