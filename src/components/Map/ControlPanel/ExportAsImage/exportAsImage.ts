/* eslint-disable consistent-return */
/* eslint-disable linebreak-style */

import html2canvas from 'html2canvas';

const convertToPNG = (caseCurrentState) => {
  // const caseCurrentState = useAppSelector(selectCase);

  const mapCanvas: any = document.querySelector('.mapboxgl-canvas');
  html2canvas(mapCanvas, {
    useCORS: true,
    allowTaint: true,
  })
    .then((canvas) => {
      const img = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = img;
      const caseName = caseCurrentState.currentCase?.label.replace(/ /g, '_');
      link.download = `${caseName}_Carte`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
};

export default convertToPNG;
