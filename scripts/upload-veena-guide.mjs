import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

cloudinary.config({ 
  cloud_name: 'dwmilzocy', 
  api_key: '174537359341356', 
  api_secret: 'erU6O-iwXS324YIOp94awbFRSTQ' 
});

const guidePath = path.join(process.cwd(), 'public', 'printing-guide', 'guide-1.png');

async function run() {
  if (!fs.existsSync(guidePath)) {
    console.error("Frame size guide image not found!");
    return;
  }
  
  console.log("Uploading frame size guide image to Cloudinary...");
  try {
    const result = await cloudinary.uploader.upload(guidePath, {
      folder: 'kalakasturi_products',
      resource_type: 'image'
    });
    const optimizedUrl = result.secure_url.replace('/upload/', '/upload/q_auto,f_auto/');
    console.log("Upload Success! Cloudinary URL:", optimizedUrl);
  } catch (err) {
    console.error("Upload failed:", err);
  }
}

run();
