const nodemailer = require('nodemailer')
const config = require('../config')
const LOG = require('../loaders/winston')

const getTransport = async () =>  {
  const configTransport = Object.assign({}, config.mail, { auth: JSON.parse(config.mail.auth)})
  delete configTransport.from

  if (!configTransport.auth) {
    configTransport.auth = await nodemailer.createTestAccount()
  }

  return nodemailer.createTransport(configTransport, { from: `"App Personal" <${config.mail.from}>` })
}

class EmailService {
  static async sendVerifyEmail (link, userMail, token) {
    const transport = await getTransport()
    const status = await transport.sendMail({
      to: userMail,
      subject: 'Verificacção de e-mail',
      text: `Clique no link abaixo para verificar seu e-mail ${config.host + link}?token=${token}`,
      html: `Clique no link abaixo para verificar seu e-mail <a href='${config.host + link}?token=${token}'>Verificar e-mail</a>`,
    })

    LOG.registerInfo(status)
    if (!config.isProduction) {
      console.log('URL => ' + nodemailer.getTestMessageUrl(status))
    }
  }

  static async sendResetPassword (link, userMail, token) {
    const transport = await getTransport()
    const status = await transport.sendMail({
      to: userMail,
      subject: 'Reset de senha',
      text: `Acesse o link para resetar a sua senha ${config.host + link}?token=${token}`,
      html: `Clique no link para resetar sua senha <br/><a href='${config.host + link}?token=${token}'>Resetar senha</a>`,
    })

    LOG.registerInfo(status)
    if (!config.isProduction) {
      console.log('URL => ' + nodemailer.getTestMessageUrl(status))
    }
  }
}

module.exports = () => EmailService
