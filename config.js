const fs = require('fs');
const settings = require('./appsettings.json');
const prodEnvironment = {
    ...settings.environments.values,
    ...settings.environments.production
};
const localEnvironment = {
    ...settings.environments.values,
    ...settings.environments.local
}
let content = '';
content = `
export const environment = {
    production: true,
${getEnv(prodEnvironment)}
}
`;

fs.writeFile('src/environments/environment.prod.ts', content ,(e, data) => {
    if (e) {
        return console.error(e);
    }
    console.log(data);
});
content = `
export const environment = {
    production: false,
${getEnv(localEnvironment)}
}
`;
fs.writeFile('src/environments/environment.ts', content ,(e, data) => {
    if (e) {
        return console.error(e);
    }
    console.log(data);
})

fs.writeFile('src/index.html', getBaseHTML(settings.displayName) ,(e, data) => {
    if (e) {
        return console.error(e);
    }
    console.log(data);
})

function getEnv(env) {
    let content = '';
    let content2 = '';
    for (const [k, v] of Object.entries(env)) {
        if (typeof v !== 'object') {
            content += `    ${k}:"${v}",\n`;
        } else {
            content2 += `    ${k}: {\n`;
            for (const [k2, v2] of Object.entries(v)) {
                content2 += `        ${k2}:"${v2}",\n`;
            }
            content2 += `    },\n`;
        }
    }
    content += content2;
    return content;
}

function getBaseHTML(displayName) {
    return `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>${displayName}</title>
    <base href="/">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" type="image/x-icon" href="favicon.ico">
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"/>
  </head>
  <body class="mat-typography">
    <app-root></app-root>
  </body>
</html>
`;
}
