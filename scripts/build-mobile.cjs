const fs=require('fs'),path=require('path');const {buildSync}=require('esbuild');const root=path.resolve(__dirname,'..'),out=path.join(root,'dist');fs.mkdirSync(out,{recursive:true});
for(const f of ['assets','index.html','manifest.webmanifest','favicon.ico','privacy.html'])fs.cpSync(path.join(root,f),path.join(out,f),{recursive:true});
const endpoint=process.env.AMEGOO_API_BASE_URL||'https://amegoo.vercel.app';if(new URL(endpoint).protocol!=='https:')throw Error('Backend URL must use HTTPS');
fs.writeFileSync(path.join(out,'assets/runtime.js'),'window.APP_RUNTIME='+JSON.stringify({native:true,apiBaseUrl:endpoint,version:require('../package.json').version})+';');
buildSync({entryPoints:[path.join(root,'mobile/native-bridge.js')],outfile:path.join(out,'assets/native-bridge.js'),bundle:true,format:'iife',target:'es2020',minify:true});
let html=fs.readFileSync(path.join(out,'index.html'),'utf8');html=html.replace('</head>','<script src="assets/runtime.js"></script><script src="assets/native-bridge.js" defer></script></head>');fs.writeFileSync(path.join(out,'index.html'),html);
console.log('Packaged offline content, native bridge and HTTPS backend:',endpoint);
