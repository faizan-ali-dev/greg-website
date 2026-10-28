import {readFile,readdir,access} from 'node:fs/promises';
import path from 'node:path';
const files=(await readdir('dist')).filter(f=>f.endsWith('.html'));
const siteUrl=new URL((process.env.SITE_ORIGIN || 'http://localhost:8765').replace(/\/+$/,'')+'/');
let references=0;
for(const file of files){
 const html=await readFile('dist/'+file,'utf8');
 if((html.match(/<h1[ >]/g)||[]).length!==1)throw new Error(`${file}: expected one h1`);
 for(const match of html.matchAll(/(?:href|src)="([^"]*)"/g)){
  const url=match[1];
  if(!url||/^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(url))continue;
  const publishedUrl=new URL(url,new URL(file,siteUrl));
  if(!publishedUrl.pathname.startsWith(siteUrl.pathname))throw new Error(`${file}: link leaves deployment base path: ${url}`);
  const pathname=decodeURIComponent(publishedUrl.pathname.slice(siteUrl.pathname.length));
  const target=pathname===''?'index.html':pathname;
  const resolved=path.resolve('dist',target);
  const root=path.resolve('dist');
  if(resolved!==root&&!resolved.startsWith(root+path.sep))throw new Error(`${file}: reference escapes output directory`);
  await access(resolved).catch(()=>{throw new Error(`${file}: missing ${target}`)});references++;
 }
 if(!html.includes('name="description"')||!html.includes('rel="canonical"'))throw new Error(`${file}: metadata missing`);
 const canonical=html.match(/<link rel="canonical" href="([^"]+)"/)[1];
 const expectedCanonical=new URL(file==='index.html'?'':file,siteUrl).href;
 if(canonical!==expectedCanonical)throw new Error(`${file}: canonical URL does not match deployment URL`);
 const contentWithoutInputHints=html.replace(/placeholder="[^"]*"/g,'');
 if(/TODO|lorem ipsum|example\.com|YOUR_API_KEY/i.test(contentWithoutInputHints))throw new Error(`${file}: placeholder found`);
}
console.log(`PASS: ${files.length} pages; ${references} local asset/link references; headings, metadata and placeholder checks.`);
