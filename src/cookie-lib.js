
export function setCookie(name, value) {
  const cookie = [
    name, '=', JSON.stringify(value).replace(';', '&#59#&'), '; domain=',
    window.location.host.toString().split(':')[0] + '; path=/;'
  ].join('');
  document.cookie = cookie;
}

export function getCookie(name) {
  const regex_match = document.cookie.match(new RegExp(name + '=(([^;])+)'));

  if (!regex_match) {
    return null;
  }

  if (regex_match.length < 2) {
    return null;
  }

  console.log(regex_match[1]);
  let result = regex_match[1].replace('&#59#&', ';');
  console.log(result);
  result = JSON.parse(result);
  return result;
}
