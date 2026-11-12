/** Grab a JPEG frame (~1s in) from a local video file in the browser for share previews. */
export function captureVideoFrame(file: File, maxWidth = 1200): Promise<Blob | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    const done = (b: Blob | null) => { URL.revokeObjectURL(url); resolve(b); };
    video.muted = true; video.playsInline = true; video.preload = 'auto'; video.src = url;
    video.onerror = () => done(null);
    video.onloadedmetadata = () => { video.currentTime = Math.min(1, (video.duration || 2) / 2); };
    video.onseeked = () => {
      const scale = Math.min(1, maxWidth / (video.videoWidth || maxWidth));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round((video.videoWidth || 1280) * scale);
      canvas.height = Math.round((video.videoHeight || 720) * scale);
      const ctx = canvas.getContext('2d');
      if (!ctx) return done(null);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(done, 'image/jpeg', 0.82);
    };
    setTimeout(() => done(null), 15000);
  });
}

/** Stored news.image values that are private thumbnail paths rather than full URLs. */
export const isThumbPath = (image: string) => !!image && !/^(https?:|data:|\/)/.test(image);
