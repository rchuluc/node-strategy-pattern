class Route {
  static methodExtractor() {
    return Object.getOwnPropertyNames(this.prototype).filter(
      (method) => method !== 'constructor' && !method.startsWith('_')
    )
  }
}

module.exports = Route
