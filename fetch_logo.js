import https from 'https';
import fs from 'fs';

function downloadFile(remotePath, localPath) {
  const options = {
    hostname: 'www.onecorepharma.in',
    port: 443,
    path: remotePath,
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
    },
    rejectUnauthorized: false
  };

  const req = https.request(options, (res) => {
    console.log(remotePath, 'Status:', res.statusCode, 'Type:', res.headers['content-type']);
    if (res.statusCode === 200) {
      const file = fs.createWriteStream(localPath);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log('Saved', localPath, 'size:', fs.statSync(localPath).size);
      });
    }
  });

  req.on('error', (e) => console.error(remotePath, 'error:', e));
  req.end();
}

downloadFile('/images/favicon.png', 'public/assets/favicon.png');
downloadFile('/images/logo-dark.png', 'public/assets/onecore-logo-dark.png');
downloadFile('/images/logo-white.png', 'public/assets/onecore-logo-white.png');
downloadFile('/images/logo-2.png', 'public/assets/onecore-logo-2.png');

