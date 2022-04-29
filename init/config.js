const fs = require('fs');
const readline = require('readline');
const settings = require('./appsettings.json');

setEnvironments();
setIndex();
setFirebase();
edit('package.json');
edit('angular.json');

function write(path, contents) {
    fs.writeFile(path, contents, (error, data) => (error) ? console.log(error) : console.log('Seteado'));
}

function setEnvironments() {
    const getEnv = (env) => {
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
        appName: "${settings.appName}",
    ${getEnv(prodEnvironment)}
    }
    `;
    
    write('src/environments/environment.prod.ts', content);
    content = `
    export const environment = {
        production: false,
        appName: "${settings.appName}",
    ${getEnv(localEnvironment)}
    }
    `;
    write('src/environments/environment.ts', content);
}

function setIndex() {

const getBaseHTML = (appName) => {
    return `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>${appName}</title>
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
    write('src/index.html', getBaseHTML(settings.appName));
}

function setFirebase() {
    const projectId = settings.environments.values.firebase.projectId;
    const firebaserc = `{
    "projects": {
        "default": "${projectId}"
    },
    "targets": {
        "${projectId}": {
            "hosting": {
                "${settings.target}": [
                    "${settings.hostingName}"
                ]
            }
        }
    }
}`;
    write('.firebaserc', firebaserc);
    const firebase = `{
        "hosting": [{
            "public": "dist/satoru-project",
            "headers": [{
                "source": "/**",
                "headers": [{
                    "key": "Cache-Control",
                    "value": "no-cache, no-store, must-revalidate"
                }]
            }],
            "target": "${settings.target}",
            "ignore": [
                "firebase.json",
                "**/.*",
                "**/node_modules/**"
            ],
            "rewrites": [{
                "source": "**",
                "destination": "/index.html"
            }]
        }]
    }`;
    write('firebase.json', firebase);
}

function edit(file) {
    fs.readFile(file, {encoding: 'utf8'}, function (err,data) {
        let formatted = data.replace(/satoru-project/g, settings.projectName)
            .replace(/TARGET/g, settings.target)
            .replace(/PROJECTID/g, settings.environments.values.firebase.projectId);
        fs.writeFile(file, formatted, 'utf8', function (err) {
            if (err) return console.log(err);
        });
    });
}

