const multer = require('multer')
const path = require('path')
const fs = require('fs')

const upload = (expressApp) => (filetypes, limits = { files: 1, fieldSize: 1024 * 1024 }) => {

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      let path = expressApp.appConfig.uploadPath

      if (req.user && req.user.role !== expressApp.helpers.autorizacao.roles.ADMIN) {
        const dir = `${path}/${req.user._id}`
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        path = `${path}/${req.user._id}`
      }

      cb(null, path);
    },
    filename: function (req, file, cb) {
      cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
  })

  return multer({ 
    storage,
    limits,
    fileFilter: (req, file, cb) => {
      const extname =  filetypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = filetypes.test(file.mimetype);

      if(mimetype && extname){
          return cb(null,true);
      } else {
          cb(new expressApp.helpers.error.NotAcceptable(`Tipo de arquivo inválido`));
      }
    }
  })}

module.exports = (expressApp) => upload(expressApp)
