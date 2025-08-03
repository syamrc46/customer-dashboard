// deploy.js
const shell = require('shelljs');

// Stop if any command fails
shell.set('-e');

// 1. Build the React App
console.log('🔨 Building React app...');
if (shell.exec('npm run build').code !== 0) {
  shell.echo('❌ Build failed!');
  shell.exit(1);
}

// 2. Deploy to Netlify
console.log('🚀 Deploying to Netlify...');
if (shell.exec('npx netlify deploy --prod --dir=build').code !== 0) {
  shell.echo('❌ Deployment failed!');
  shell.exit(1);
}

console.log('✅ Deployment completed successfully!');
