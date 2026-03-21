(() => {
  const originalProto = Audio.prototype;
  ["play"].forEach((method) => {
    const originalMethod = Audio.prototype[method];
    Audio.prototype[method] = function () {
      Audio.prototype = originalProto;
      if (!document.contains(this)) document.body.appendChild(this);
      return originalMethod.apply(this, arguments);
    };
  });
})();