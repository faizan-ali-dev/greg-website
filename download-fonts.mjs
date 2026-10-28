import {writeFile,mkdir} from 'node:fs/promises';
const root='dist/assets';
await mkdir(root,{recursive:true});
const response=await fetch('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap',{headers:{'User-Agent':'Mozilla/5.0'}});
if(!response.ok)throw new Error('Font stylesheet: '+response.status);
let css=await response.text();
const urls=[...new Set([...css.matchAll(/url\((https:[^)]+)\)/g)].map(m=>m[1]))];
for(let i=0;i<urls.length;i++){
 const result=await fetch(urls[i]);if(!result.ok)throw new Error('Font download: '+result.status);
 const extension=new URL(urls[i]).pathname.split('.').pop();
 const name=`font-${i}.${extension}`;
 await writeFile(`${root}/${name}`,Buffer.from(await result.arrayBuffer()));
 css=css.replaceAll(urls[i],name);
}
await writeFile(root+'/fonts.css',css);
console.log(`Saved ${urls.length} font files for local delivery.`);
