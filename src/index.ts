const client = require('./client')
const server = require('./server')

module.exports = {
  useTheme: client.useTheme,
  ThemeProvder: client.ThemeProvider,
  ServerThemeProvider: server.ServerThemeProvider,
}
