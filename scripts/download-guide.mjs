import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import { finished } from 'stream/promises';

const urls = [
  "https://lh3.googleusercontent.com/pw/AP1GczOrxYVpVEorQSIeYdh_Qin3zsUsFB7n5N2pCW9PnjgCwrCRLqJZ5dj7VdkQRBx5muYbCQyXR9lDzq9tIe4ZosUb-WxlbEbQG1G45O_RO_iOGq6ueNg1",
  "https://lh3.googleusercontent.com/pw/AP1GczOWrJ0RYTUOw9PWT24R4DUHTVR9Hdsd30WIe7N-WgWxszmJikQ9PQ_137OVI3rpbU9MpUk-4QpfIZrEEoi_4f4GKGjzZSWCAGjbRBntWQH_PosLZBct",
  "https://lh3.googleusercontent.com/pw/AP1GczOc1TPg9KVyQqRB3k-t7HmkLL0RiEPI3pegPV6AcFDyUawnPGkKN7VygvS2ALo66FKGto3aJ6xdwL05-_qzjnLHQFTnLhw_S0gRuf3_CJhRFJhGNpPx"
];

const downloadDir = path.join(process.cwd(), 'public', 'printing-guide');
if (!fs.existsSync(downloadDir)) {
  fs.mkdirSync(downloadDir, { recursive: true });
}

async function downloadFile(url, fileName) {
  const filePath = path.join(downloadDir, fileName);
  console.log(`Downloading ${url} -> ${filePath}...`);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }
  const fileStream = fs.createWriteStream(filePath);
  await finished(Readable.fromWeb(response.body).pipe(fileStream));
  console.log(`Successfully downloaded ${fileName}!`);
}

async function start() {
  try {
    for (let i = 0; i < urls.length; i++) {
      await downloadFile(urls[i], `guide-${i + 1}.png`);
    }
    console.log("All guide images downloaded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Download failed:", error);
    process.exit(1);
  }
}

start();
