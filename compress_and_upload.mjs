import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

cloudinary.config({ 
  cloud_name: 'dwmilzocy', 
  api_key: '174537359341356', 
  api_secret: 'erU6O-iwXS324YIOp94awbFRSTQ' 
});

const filesToFix = [
  {
    localUrl: '/products/feminine energy/20260513_134028.mp4',
    type: 'video'
  },
  {
    localUrl: '/products/feminine energy/20260513_134151.jpg',
    type: 'image'
  },
  {
    localUrl: '/products/Vishwamitra/20260430_190039.mp4',
    type: 'video'
  }
];

const dataTsPath = path.join(process.cwd(), 'lib', 'data.ts');
let dataTsContent = fs.readFileSync(dataTsPath, 'utf8');

async function processFiles() {
  for (const file of filesToFix) {
    const absolutePath = path.join(process.cwd(), 'public', file.localUrl);
    const compressedPath = absolutePath.replace(/(\.mp4|\.jpg)$/i, '_compressed$1');

    console.log(`Processing ${file.localUrl}...`);

    try {
      if (file.type === 'video') {
        // Compress video to lower bitrate/crf to get it under 100MB
        console.log(`  -> Compressing video...`);
        execSync(`ffmpeg -y -i "${absolutePath}" -vcodec libx264 -crf 28 -preset fast "${compressedPath}"`, { stdio: 'pipe' });
      } else {
        // Compress image to 1920px max width and lower quality to get it under 10MB
        console.log(`  -> Compressing image...`);
        execSync(`ffmpeg -y -i "${absolutePath}" -vf "scale='min(1920,iw)':-1" -q:v 5 "${compressedPath}"`, { stdio: 'pipe' });
      }

      console.log(`  -> Uploading compressed file to Cloudinary...`);
      const result = await cloudinary.uploader.upload(compressedPath, {
        folder: 'kalakasturi_products',
        resource_type: 'auto'
      });

      const rawUrl = result.secure_url;
      const optimizedUrl = rawUrl.replace('/upload/', '/upload/q_auto,f_auto/');
      
      console.log(`  -> Success! Cloudinary URL: ${optimizedUrl}`);

      // Update data.ts
      const searchString = file.localUrl;
      const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escapeRegExp(searchString), 'g');
      
      dataTsContent = dataTsContent.replace(regex, optimizedUrl);

      // Clean up compressed file locally (optional, but good to save space)
      fs.unlinkSync(compressedPath);

    } catch (err) {
      console.error(`  -> Failed to process ${file.localUrl}`, err);
    }
  }

  fs.writeFileSync(dataTsPath, dataTsContent, 'utf8');
  console.log('All missing files uploaded and lib/data.ts updated!');
}

processFiles().catch(console.error);
