import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

cloudinary.config({ 
  cloud_name: 'dwmilzocy', 
  api_key: '174537359341356', 
  api_secret: 'erU6O-iwXS324YIOp94awbFRSTQ' 
});

const kingfisherDir = path.join(process.cwd(), 'public', 'products', 'pied-kingfisher');
const dataTsPath = path.join(process.cwd(), 'lib', 'data.ts');

async function processUploads() {
  console.log('Scanning public/products/pied-kingfisher...');
  if (!fs.existsSync(kingfisherDir)) {
    console.error('Directory public/products/pied-kingfisher does not exist!');
    return;
  }

  const files = fs.readdirSync(kingfisherDir).filter(f => f.endsWith('.png'));
  console.log(`Found ${files.length} Kingfisher PNG files to compress and upload.`);

  let dataTsContent = fs.readFileSync(dataTsPath, 'utf8');
  let urlMapping = {};

  for (let i = 0; i < files.length; i++) {
    const fileName = files[i];
    const originalPath = path.join(kingfisherDir, fileName);
    // We will output a compressed JPG
    const jpgFileName = fileName.replace('.png', '_compressed.jpg');
    const compressedPath = path.join(kingfisherDir, jpgFileName);

    console.log(`[${i+1}/${files.length}] Processing ${fileName}...`);
    try {
      // Compress using FFmpeg: max width 1920, quality 3
      console.log(`  -> Running FFmpeg compression to JPEG...`);
      execSync(`ffmpeg -y -i "${originalPath}" -vf "scale='min(1920,iw)':-1" -q:v 3 "${compressedPath}"`, { stdio: 'pipe' });

      // Local path referenced in data.ts
      const localUrlPath = `/products/pied-kingfisher/${fileName}`;

      console.log(`  -> Uploading compressed file to Cloudinary...`);
      const result = await cloudinary.uploader.upload(compressedPath, {
        folder: 'kalakasturi_products',
        resource_type: 'auto'
      });

      const rawUrl = result.secure_url;
      const optimizedUrl = rawUrl.replace('/upload/', '/upload/q_auto,f_auto/');
      urlMapping[localUrlPath] = optimizedUrl;
      console.log(`  -> Success! Cloudinary URL: ${optimizedUrl}`);

      // Clean up compressed file locally
      fs.unlinkSync(compressedPath);
    } catch (err) {
      console.error(`  -> Failed to process ${fileName}`, err);
    }
  }

  console.log('All files processed. Updating lib/data.ts...');
  const sortedLocalPaths = Object.keys(urlMapping).sort((a, b) => b.length - a.length);

  for (const localPath of sortedLocalPaths) {
    const optimizedUrl = urlMapping[localPath];
    const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escapeRegExp(localPath), 'g');
    dataTsContent = dataTsContent.replace(regex, optimizedUrl);
  }

  fs.writeFileSync(dataTsPath, dataTsContent, 'utf8');
  console.log('lib/data.ts updated with Cloudinary URLs!');
}

processUploads().catch(console.error);
