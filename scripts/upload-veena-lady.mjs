import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

cloudinary.config({ 
  cloud_name: 'dwmilzocy', 
  api_key: '174537359341356', 
  api_secret: 'erU6O-iwXS324YIOp94awbFRSTQ' 
});

const veenaDir = path.join(process.cwd(), 'public', 'products', 'veena-lady');

async function run() {
  console.log('Starting compression and upload for Veena Lady images...');
  
  const files = [
    'Untitled design (1).png',
    'Untitled design (2).png',
    'Untitled design (3).png'
  ];

  let uploadedUrls = [];

  for (let i = 0; i < files.length; i++) {
    const fileName = files[i];
    const fullPath = path.join(veenaDir, fileName);
    if (!fs.existsSync(fullPath)) {
      console.error(`Error: File ${fileName} not found in ${veenaDir}`);
      continue;
    }

    const optFileName = `opt_${i+1}.jpg`;
    const optPath = path.join(veenaDir, optFileName);

    console.log(`[${i+1}/${files.length}] Compressing ${fileName}...`);
    try {
      // Compress using FFmpeg
      execSync(`ffmpeg -y -i "${fullPath}" -vf "scale='min(1920,iw)':-1" -q:v 3 "${optPath}"`, { stdio: 'pipe' });
      
      console.log(`  -> Uploading to Cloudinary...`);
      const result = await cloudinary.uploader.upload(optPath, {
        folder: 'kalakasturi_products',
        resource_type: 'auto'
      });

      const rawUrl = result.secure_url;
      const optimizedUrl = rawUrl.replace('/upload/', '/upload/q_auto,f_auto/');
      uploadedUrls.push(optimizedUrl);
      console.log(`  -> Success! Cloudinary URL: ${optimizedUrl}`);

      // Clean up opt file
      fs.unlinkSync(optPath);
    } catch (err) {
      console.error(`  -> Failed to process ${fileName}`, err);
    }
  }

  console.log('\nUpload complete! Copy these URLs for lib/data.ts:');
  uploadedUrls.forEach((url, index) => {
    console.log(`Image ${index+1}: ${url}`);
  });
}

run().catch(console.error);
