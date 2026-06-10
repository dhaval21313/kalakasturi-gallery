import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import https from 'https';
import { execSync } from 'child_process';

cloudinary.config({ 
  cloud_name: 'dwmilzocy', 
  api_key: '174537359341356', 
  api_secret: 'erU6O-iwXS324YIOp94awbFRSTQ' 
});

const videoUrl = 'https://video-downloads.googleusercontent.com/ADGPM2mp-16kD3eSbXFgdZEA-3jZpsA7EcIvdPiVBhFNNx2Ewi9kp3fZY5jkM9a1suy1ykAL94YypqFA1ooQxAeqKeCCsotY3LBbcEjai8N60K77cdWFDRvjrboZCoqKvFiRxTQjycNhPD751BZ6ZnqNv53So2ZlYhdTod8JmMNf10NY0fPDQmNMTxD3rY_YXaMykSNbfnV7Se6ROWXRoBowTWOiXGU_Au4fKWittSQkV3jiM0MzPw9moaC5IsxVD1G3-Hn3Atoa';
const tempInputPath = path.join(process.cwd(), 'public', 'products', 'pied-kingfisher', 'temp_video_input.mp4');
const tempOutputPath = path.join(process.cwd(), 'public', 'products', 'pied-kingfisher', 'temp_video_output.mp4');
const dataTsPath = path.join(process.cwd(), 'lib', 'data.ts');

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download, status code: ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

async function run() {
  console.log('Downloading video from Google Photos...');
  try {
    await downloadFile(videoUrl, tempInputPath);
    console.log('Download complete. Compressing video with FFmpeg...');
    
    // Compress video
    execSync(`ffmpeg -y -i "${tempInputPath}" -vcodec libx264 -crf 28 -preset fast "${tempOutputPath}"`, { stdio: 'pipe' });
    console.log('Compression complete. Uploading to Cloudinary...');

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(tempOutputPath, {
      folder: 'kalakasturi_products',
      resource_type: 'video'
    });

    const rawUrl = result.secure_url;
    const optimizedUrl = rawUrl.replace('/upload/', '/upload/q_auto,f_auto/');
    console.log('Upload success. Cloudinary Video URL:', optimizedUrl);

    // Update data.ts
    let dataTsContent = fs.readFileSync(dataTsPath, 'utf8');
    
    // Find the pied-kingfisher block and replace video: null
    // Let's use regex directly to make sure it matches any spacing or formatting
    const regex = /id:\s*"pied-kingfisher"[\s\S]*?video:\s*null/i;
    const match = dataTsContent.match(regex);
    if (match) {
      const matchedBlock = match[0];
      const replacedBlock = matchedBlock.replace(/video:\s*null/i, `video: "${optimizedUrl}"`);
      dataTsContent = dataTsContent.replace(matchedBlock, replacedBlock);
      fs.writeFileSync(dataTsPath, dataTsContent, 'utf8');
      console.log('lib/data.ts updated successfully with the video URL!');
    } else {
      console.error('Error: Could not find pied-kingfisher block to update video!');
    }

  } catch (err) {
    console.error('An error occurred during video processing:', err);
  } finally {
    // Cleanup files
    try {
      if (fs.existsSync(tempInputPath)) fs.unlinkSync(tempInputPath);
      if (fs.existsSync(tempOutputPath)) fs.unlinkSync(tempOutputPath);
      console.log('Cleaned up temporary video files.');
    } catch (_) {}
  }
}

run().catch(console.error);
