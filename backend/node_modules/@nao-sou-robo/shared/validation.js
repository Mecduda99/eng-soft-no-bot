const validator = {
  isDID: (did) => {
    if (!did || typeof did !== 'string') return false;
    return /^did:[a-z0-9]+:[a-zA-Z0-9._-]+$/.test(did) && did.length >= 10 && did.length <= 100;
  },

  isVCID: (vcId) => {
    if (!vcId || typeof vcId !== 'string') return false;
    return /^vc:[a-zA-Z0-9._-]+$/.test(vcId) && vcId.length >= 5 && vcId.length <= 50;
  },

  sanitizeString: (str, maxLength = 255) => {
    if (!str || typeof str !== 'string') return '';
    return str.trim().substring(0, maxLength).replace(/[<>\"'&]/g, '');
  },

  isValidIP: (ip) => {
    const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    return ipv4Regex.test(ip) || ipv6Regex.test(ip);
  }
};

module.exports = validator;