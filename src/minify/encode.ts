import { IMimeBundle, IOutput } from '@jupyterlab/nbformat';

async function requestImageAsBase64String(src: string) {
  const img = new Image();
  img.crossOrigin = 'Anonymous';

  const base64String = new Promise<string>((resolve, reject) => {
    img.onload = function ol() {
      const canvas: HTMLCanvasElement = document.createElement('canvas') as HTMLCanvasElement;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        // eslint-disable-next-line no-console
        console.error('Could not get canvas context');
        return reject();
      }
      canvas.height = (this as HTMLImageElement).naturalHeight;
      canvas.width = (this as HTMLImageElement).naturalWidth;
      ctx.drawImage(this as HTMLImageElement, 0, 0);
      const dataURL = canvas.toDataURL('image/png');
      const [_, base64] = dataURL.split(';base64,');
      resolve(base64);
    };

    // trigger the load
    img.src = `${document.referrer.slice(0, -1)}${src}`;
  });

  return base64String;
}

export async function fetchAndEncodeOutputImages(outputs: IOutput[]) {
  return Promise.all(
    outputs.map(async (output) => {
      if (!('data' in output)) return output;
      const imageMimetypes = Object.keys(output.data as IMimeBundle).filter((mimetype) =>
        mimetype.startsWith('image/'),
      );
      if (imageMimetypes.length === 0) return output;
      // this is an async fetch, so we need to await the result
      const images = await Promise.all(
        imageMimetypes.map(async (mimetype) =>
          requestImageAsBase64String((output.data as IMimeBundle)[mimetype] as string),
        ),
      );

      imageMimetypes.forEach((mimetype, i) => {
        // eslint-disable-next-line no-param-reassign
        (output.data as IMimeBundle)[mimetype] = images[i];
      });

      return output;
    }),
  );
}
