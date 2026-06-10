import fs from 'fs';
import path from 'path';
import https from 'https';
import { execSync } from 'child_process';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({ 
  cloud_name: 'dwmilzocy', 
  api_key: '174537359341356', 
  api_secret: 'erU6O-iwXS324YIOp94awbFRSTQ' 
});

const stepsDir = 'C:\\Users\\dhava\\.gemini\\antigravity\\brain\\90411fbc-50c0-4a24-bcaa-c7fe1f7123d5\\.system_generated\\steps';
const tempInputPath = path.join(process.cwd(), 'public', 'products', 'pied-kingfisher', 'temp_video_input.mp4');
const tempOutputPath = path.join(process.cwd(), 'public', 'products', 'pied-kingfisher', 'temp_video_output.mp4');
const dataTsPath = path.join(process.cwd(), 'lib', 'data.ts');

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://photos.app.goo.gl/',
        'Accept': '*/*'
      }
    };
    https.get(url, options, (response) => {
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
  console.log('Finding latest content.md file...');
  if (!fs.existsSync(stepsDir)) {
    console.error('Steps directory not found:', stepsDir);
    return;
  }
  
  const subdirs = fs.readdirSync(stepsDir)
    .filter(f => fs.statSync(path.join(stepsDir, f)).isDirectory())
    .map(name => parseInt(name))
    .filter(num => !isNaN(num))
    .sort((a, b) => b - a); // Sort descending to get latest step
    
  let latestContentPath = null;
  for (const num of subdirs) {
    const p = path.join(stepsDir, num.toString(), 'content.md');
    if (fs.existsSync(p)) {
      latestContentPath = p;
      break;
    }
  }
  
  if (!latestContentPath) {
    console.error('No content.md found in steps.');
    return;
  }
  
  console.log('Reading latest content file:', latestContentPath);
  const html = fs.readFileSync(latestContentPath, 'utf8');
  
  // Find video download URL matching video-downloads.googleusercontent.com
  const regex = /https:\/\/video-downloads\.googleusercontent\.com\/[a-zA-Z0-9_\-\/]+/g;
  const matches = html.match(regex) || [];
  const uniqueVideoUrls = [...new Set(matches)];
  
  if (uniqueVideoUrls.length === 0) {
    console.error('No video download URLs found in the content file!');
    return;
  }
  
  const videoUrl = uniqueVideoUrls[0];
  console.log('Found video URL:', videoUrl);
  
  console.log('Downloading video...');
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
  const regexVideo = /id:\s*"pied-kingfisher"[\s\S]*?video:\s*(null|"[^"]*")/i;
  const match = dataTsContent.match(regexVideo);
  if (match) {
    const matchedBlock = match[0];
    const replacedBlock = matchedBlock.replace(/video:\s*(null|"[^"]*")/i, `video: "${optimizedUrl}"`);
    dataTsContent = dataTsContent.replace(matchedBlock, replacedBlock);
    fs.writeFileSync(dataTsPath, dataTsContent, 'utf8');
    console.log('lib/data.ts updated successfully with the video URL!');
  } else {
    console.error('Error: Could not find pied-kingfisher block to update video!');
  }
  
  // Cleanup
  try {
    if (fs.existsSync(tempInputPath)) fs.unlinkSync(tempInputPath);
    if (fs.existsSync(tempOutputPath)) fs.unlinkSync(tempOutputPath);
    console.log('Cleaned up temporary video files.');
  } catch (_) {}
}

run().catch(console.error);
