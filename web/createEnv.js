const fs = require('fs');
let config = `window.env = {};`
if (process.env.NODE_ENV === 'production') {
    config += `\nwindow.env["API"] = "${process.env.API}";`;
    
}
fs.writeFileSync("./public/constants.js", config);