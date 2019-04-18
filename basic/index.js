/** 支持Unicode的cookie读写器 */
const Cookie = {
  /**
   * @method getItem 获取指定cookie值的方法
   * @param {string} key 获取指定键所对应的cookie值（可以是number类型，但应杜绝）
   * @returns {string|null} 返回所查找的cookie值
   */
  getItem(key) {
    if (!key) {
      return null;
    }

    const encodedKey = encodeURIComponent(key).replace(/[\-\.\+\*]/g, '\\$&');
    return (
      document.cookie
        .replace(
          new RegExp('(?:(?:^|.*;)\\s*' + encodedKey + '\\s*\\=\\s*([^;]*).*$)|^.*$'),
          '$1',
        )
    ) || null;
  },
  /**
   * @method setItem 设置指定cookie值的方法
   * @param {string} key 新增的cookie键
   * @param {string} value 新增的cookie值
   * @param {number|string|Date|null} expire 设定cookie的有效时限
   * @param {string|null} path 设定cookie的可见路径
   * @param {string|null} domain 设定cookie的可见域
   * @param {boolean|null} secure 是否 https only
   * @returns {boolean} 是否成功地设置cookie
   */
  setItem(key, value, expire, path, domain, secure) {
    if (!key || /^(?:expires|max\-age|path|domain|secure)$/i.test(key)) {
      return false;
    }

    let expireTime = '';

    if (expire) {
      switch(expire.constructor) {
        case Number:
          expireTime = expire === Infinity ? '; expires=Fri, 31 Dec 9999 23:59:59 GMT' : ('; max-age=' + expire);
          break;
        case String:
          expireTime = '; expires=' + expire;
          break;
        case Date:
          expireTime = '; expires=' + expire.toUTCString();
      }
    }

    document.cookie =
      encodeURIComponent(key)
      + '='
      + encodeURIComponent(value)
      + expireTime
      + (domain ? '; domain=' + domain : '')
      + (path ? '; path=' + path : '')
      + (secure ? '; secure' : '');

    return true;

  },
  /**
   * @method removeItem 移除指定cookie值的方法
   * @param {string} key 要移除的cookie键
   * @param {string} path 指定cookie所在路径
   * @param {string} domain 指定cookie所在域
   * @returns {boolean} 是否成功地移除cookie
   */
  removeItem(key, path, domain) {
    if (!this.hasItem(key)) {
      return false;
    }

    document.cookie =
      encodeURIComponent(key)
      + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      + (domain ? '; domain=' + domain : '')
      + (path ? '; path=' + path : ''); 
    
    return true;

  },
  /**
   * @method hasItem 判定是否有指定cookie的方法
   * @param {string} key 要查看的cookie
   * @returns {boolean} 是否有指定的cookie
   */
  hasItem(key) {
    if (!key || /^(?:expires|max\-age|path|domain|secure)$/i.test(key)) {
      return false;
    }

    return (
      new RegExp(
        '(?:^|;\\s*)'
        + encodeURIComponent(key).replace(/[\-\.\+\*]/g, '\\$&')
        + '\\s*\\='
      )
    ).test(document.cookie);
  },
  /**
   * @method keys 获取所有cookie键的方法
   * @returns {string} 所有的cookie键集合
   */
  keys() {
    const keys = 
      document.cookie
        .replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, '')
        .split(/\s*(?:\=[^;]*)?;\s*/);
    
    if (keys.length === 1 && !keys[0]) {
      return [];
    }

    for (let i = 0, len = keys.length; i < len; i++) {
      keys[i] = decodeURIComponent(keys[i]);
    }

    return keys;
  },
};
