const nodemailer = require('nodemailer')
const config = require('../config')
const LOG = require('../loaders/winston')

const getTransport = async () =>  {
  console.log(config.mail)
  const configTransport = Object.assign({}, config.mail, { auth: JSON.parse(config.mail.auth)})
  delete configTransport.from

  if (!configTransport.auth) {
    configTransport.auth = await nodemailer.createTestAccount()
  }

  return nodemailer.createTransport(configTransport, { from: `"MUSE" <${config.mail.from}>` })
}

class EmailService {
  static async sendVerifyEmail (link, userMail, token) {
    try {
      const transport = await getTransport()
      const status = await transport.sendMail({
        to: userMail,
        subject: 'Verificação de e-mail',
        text: `Clique no link abaixo para verificar seu e-mail ${config.host + link}?token=${token}`,
        html: `Clique no link abaixo para verificar seu e-mail <a href='${config.host + link}?token=${token}'>Verificar e-mail</a>`,
      })
  
      LOG.registerInfo(status)
    } catch (e) {
      LOG.registerError(e)
    }
  }

  static async sendResetPassword (link, userMail, token) {
    try {
      const transport = await getTransport()
      const status = await transport.sendMail({
        to: userMail,
        subject: 'Reset de senha',
        text: `Acesse o link para resetar a sua senha ${config.host + link}?token=${token}`,
        html: `Clique no link para resetar sua senha <br/><a href='${config.host + link}?token=${token}'>Resetar senha</a>`,
      })

      LOG.registerInfo(status)
    } catch (e) {
      LOG.registerError(e)
    }
  }
}

module.exports = () => EmailService
