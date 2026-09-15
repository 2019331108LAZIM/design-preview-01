// Lightweight fidelity check for re-encoded images: a single-window
// (whole-image) SSIM over downsampled grayscale luminance. This is a
// coarse approximation of true windowed SSIM (which slides an 11x11
// Gaussian window across the image) — accurate enough to catch a genuinely
// botched re-encode (banding, color shift, heavy artifacting) without
// pulling in an image-quality dependency for a build-time sanity check.
import sharp from 'sharp';

const SAMPLE = 128; // both images resized to SAMPLE x SAMPLE before scoring
const C1 = (0.01 * 255) ** 2;
const C2 = (0.03 * 255) ** 2;

async function grayscaleSamples(input) {
  const { data } = await sharp(input)
    .resize(SAMPLE, SAMPLE, { fit: 'fill' })
    .grayscale()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return data;
}

export async function ssimScore(sourcePathOrBuffer, outputPathOrBuffer) {
  const [a, b] = await Promise.all([
    grayscaleSamples(sourcePathOrBuffer),
    grayscaleSamples(outputPathOrBuffer)
  ]);
  const n = a.length;
  let meanA = 0, meanB = 0;
  for (let i = 0; i < n; i++) { meanA += a[i]; meanB += b[i]; }
  meanA /= n; meanB /= n;

  let varA = 0, varB = 0, covAB = 0;
  for (let i = 0; i < n; i++) {
    const da = a[i] - meanA, db = b[i] - meanB;
    varA += da * da; varB += db * db; covAB += da * db;
  }
  varA /= (n - 1); varB /= (n - 1); covAB /= (n - 1);

  const numerator = (2 * meanA * meanB + C1) * (2 * covAB + C2);
  const denominator = (meanA * meanA + meanB * meanB + C1) * (varA + varB + C2);
  return numerator / denominator;
}
