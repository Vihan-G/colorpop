import html2canvas from "html2canvas";

export async function exportNodeToPng(
  node: HTMLElement,
  filename: string,
): Promise<void> {
  const canvas = await html2canvas(node, {
    backgroundColor: "#0c0c0c",
    scale: 2,
    useCORS: true,
    logging: false,
  });
  await new Promise<void>((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        resolve();
        return;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      resolve();
    }, "image/png");
  });
}
