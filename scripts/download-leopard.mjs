import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import { finished } from 'stream/promises';

const urls = [
  "https://lh3.googleusercontent.com/pw/AP1GczN_fHJEdB4Wy66qOzkMVKmeLNJ080OacyKS7p01Q10chiNX6_6NRsV93OOfTSW97Rwm1Dcqmbi8Z9WuTsyP6vqFVSgF0Q01QP10AhaTyfZWjRSw6fwi",
  "https://lh3.googleusercontent.com/pw/AP1GczMVXezOvkuevF_p_vUUlqSgj1fFRGeRvzOu0_1GdIbGjuEveuTA1QOGmIsIHRRVqKRPkXhtv52IVT4ohBbKIxkrs-zdYnHC7x2x5ZO-z_0-wtWLMOhO",
  "https://lh3.googleusercontent.com/pw/AP1GczPzFxepmwc6AwKnmqHImeUISmKt1T_vzay7NWWQ6qc5zqN9fFUdmcid4etUrxAhXd5ZEg-2255R7iTadWUQfkRkF7oPF8UC9N9QYTJbi59hSiewvkuv",
  "https://lh3.googleusercontent.com/pw/AP1GczNHchwFyBh6Yut4u-AjYJF6ODut7oQuQiOHl4h1Y3993lcktC6uQCRPpfue0uENcP8Dqq7Wo7HlcGFGXstPyeCjEZZXfkg60cbcdLNExiM5x-4iBiEh",
  "https://lh3.googleusercontent.com/pw/AP1GczOCdbecySKmiDzlqrL70z77YWpW3XPdDmaKmAkeFgE5Ym9QaAFXe2K9D4i7n7QdMC3VJNMHmEw3v7A3QxrGyiRyFFtx_jl4QKkPefsDVzvnCcBPUHRj",
  "https://lh3.googleusercontent.com/pw/AP1GczPkissNPKkrI2O6t5_jUl4fGOvbSI8aj-JAeSNwpP-QnoOq045MUICsBeqeRqzTAY1sPAuAbgV2YrpMGly7s6MJvDzM7kltb-YayflYmrF9daU9IWKr"
];

const downloadDir = path.join(process.cwd(), 'public', 'products', 'leopards-gaze');
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
      await downloadFile(urls[i], `${i + 1}.png`);
    }
    console.log("All Leopard's Gaze images downloaded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Download failed:", error);
    process.exit(1);
  }
}

start();
