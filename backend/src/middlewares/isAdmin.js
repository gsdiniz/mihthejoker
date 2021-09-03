const isAdmin = (expressApp) => (req, res, next) => {
  
  if (req.user.role !== 0) {
    next(new expressApp.helpers.error.Forbidden(`You shall not pass!`))
    return
  }

  next()
} 

module.exports = (expressApp) => isAdmin(expressApp)
