 
'use client';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FileText } from 'lucide-react';

type Props = {
  text: string;
};

function Download({ text }: Props) {
  const downloadReceipt = () => {
    const element = document.getElementById('receipt');
    if (!element) {
      console.error("Element with id 'receipt' not found.");
      return;
    } 
    html2canvas(element, {
      scale: 2,
      width: element.scrollWidth,
      height: element.scrollHeight,
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const doc = new jsPDF('p', 'pt', 'a4');

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * pageWidth) / canvas.width;

      let position = 0;

      // Multi-page support
      if (imgHeight < pageHeight) {
        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      } else {
        while (position < imgHeight) {
          doc.addImage(imgData, 'PNG', 0, position * -1, imgWidth, imgHeight);
          position += pageHeight;
          if (position < imgHeight) doc.addPage();
        }
      }

      doc.save(`${text}.pdf`);
    });

  };

  return (
    <div className=' flex  justify-end'>
      <button
        onClick={downloadReceipt}
        className="mt-4 px-6 py-3 buttonbg max-md:text-sm max-md:px-3 max-md:py-1 text-white flex items-center gap-3 rounded-lg"
      >
        Download <FileText />
      </button>
    </div>
  );
}

export default Download;
