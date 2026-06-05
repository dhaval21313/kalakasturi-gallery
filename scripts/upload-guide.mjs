import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

cloudinary.config({ 
  cloud_name: 'dwmilzocy', 
  api_key: '174537359341356', 
  api_secret: 'erU6O-iwXS324YIOp94awbFRSTQ' 
});

const guideDir = path.join(process.cwd(), 'public', 'printing-guide');
const files = ['guide-1.png', 'guide-2.png', 'guide-3.png'];

async function upload() {
  console.log("Uploading printing guide images to Cloudinary...");
  const urls = [];
  try {
    for (const file of files) {
      const filePath = path.join(guideDir, file);
      if (fs.existsSync(filePath)) {
        console.log(`Uploading ${file}...`);
        const result = await cloudinary.uploader.upload(filePath, {
          folder: 'kalakasturi_guide',
          resource_type: 'image'
        });
        const optimizedUrl = result.secure_url.replace('/upload/', '/upload/q_auto,f_auto/');
        console.log(`Successfully uploaded ${file}! URL: ${optimizedUrl}`);
        urls.push(optimizedUrl);
      } else {
        console.warn(`File not found: ${filePath}`);
      }
    }
    console.log("\nFinished! Here are the Cloudinary URLs:");
    urls.forEach((url, i) => {
      console.log(`Guide ${i + 1} Cloudinary URL: ${url}`);
    });
    process.exit(0);
  } catch (err) {
    console.error("Upload failed:", err);
    process.exit(1);
  }
}

upload();
