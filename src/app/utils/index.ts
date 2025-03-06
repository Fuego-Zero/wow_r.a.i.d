import { toPng } from "html-to-image";

async function htmlToPngDownload(el: HTMLElement, name: string) {
  const dataUrl = await toPng(el, { cacheBust: true });

  const link = document.createElement("a");
  link.download = `团本安排_${name}.png`;
  link.href = dataUrl;
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export { htmlToPngDownload };
