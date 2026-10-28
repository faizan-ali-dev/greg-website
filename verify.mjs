import {readFile,readdir,access} from 'node:fs/promises';
import path from 'node:path';
const files=(await readdir('dist')).filter(f=>f.endsWith('.html'));
let references=0;
for(const file of files){
 const html=await readFile('dist/'+file,'utf8');
 if((html.match(/<h1[ >]/g)||[]).length!==1)throw new Error(`${file}: expected one h1`);
 for(const match of html.matchAll(/(?:href|src)="(\/[^"#?]*)/g)){
  const target=match[1]==='/'?'index.html':match[1].slice(1);
  await access(path.join('dist',target)).catch(()=>{throw new Error(`${file}: missing ${target}`)});references++;
 }
 if(!html.includes('name="description"')||!html.includes('rel="canonical"'))throw new Error(`${file}: metadata missing`);
 const contentWithoutInputHints=html.replace(/placeholder="[^"]*"/g,'');
 if(/TODO|lorem ipsum|example\.com|YOUR_API_KEY/i.test(contentWithoutInputHints))throw new Error(`${file}: placeholder found`);
}
console.log(`PASS: ${files.length} pages; ${references} local asset/link references; headings, metadata and placeholder checks.`);
