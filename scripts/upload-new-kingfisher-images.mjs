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

async function run() {
  console.log('Starting compression and upload for the new Kingfisher images...');
  
  const files = [
    'new_full_1.jpg',
    'new_full_2.jpg',
    'new_full_3.jpg',
    'new_full_4.jpg'
  ];

  let uploadedUrls = [];

  for (let i = 0; i < files.length; i++) {
    const fileName = files[i];
    const fullPath = path.join(kingfisherDir, fileName);
    if (!fs.existsSync(fullPath)) {
      console.error(`Error: File ${fileName} not found in ${kingfisherDir}`);
      continue;
    }

    const optFileName = `new_opt_${i+1}.jpg`;
    const optPath = path.join(kingfisherDir, optFileName);

    console.log(`[${i+1}/4] Compressing ${fileName}...`);
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

  if (uploadedUrls.length === 0) {
    console.error('No images were successfully uploaded.');
    return;
  }

  console.log('Uploads complete. Updating lib/data.ts with new Cloudinary URLs...');
  let dataTsContent = fs.readFileSync(dataTsPath, 'utf8');

  // Find the pied-kingfisher block
  const regex = /id:\s*"pied-kingfisher"[\s\S]*?images:\s*\[[\s\S]*?\]/i;
  const match = dataTsContent.match(regex);
  if (match) {
    const matchedBlock = match[0];
    
    // Construct new image and images strings
    const newImageStr = `image: "${uploadedUrls[0]}",`;
    const newImagesArrayStr = `images: [\n      ${uploadedUrls.map(u => `"${u}"`).join(',\n      ')}\n    ]`;
    
    // Replace in block
    let replacedBlock = matchedBlock.replace(/image:\s*"[^"]*"/i, newImageStr);
    replacedBlock = replacedBlock.replace(/images:\s*\[[\s\S]*?\]/i, newImagesArrayStr);
    
    dataTsContent = dataTsContent.replace(matchedBlock, replacedBlock);
    fs.writeFileSync(dataTsPath, dataTsContent, 'utf8');
    console.log('lib/data.ts updated successfully with the new image URLs!');
  } else {
    console.error('Error: Could not find pied-kingfisher block in lib/data.ts to update image URLs!');
  }

  // Clean up downloaded full-res files
  files.forEach(f => {
    const p = path.join(kingfisherDir, f);
    if (fs.existsSync(p)) {
      fs.unlinkSync(p);
      console.log(`Deleted temporary downloaded file: ${f}`);
    }
  });
}

run().catch(console.error);
