const orderNumberElement = document.getElementById('orderNumber').value

const orderNumber = orderNumberElement.replace(/\s/g, "")

const filename = `Invoice_${orderNumber}.pdf`

const downloadBtn = document.getElementById('download-btn')

function downloadPdf() {
  // Replace "pdf-file-name.pdf" with the name of your PDF file
  const pdfUrl = `../../../src/images/output/Invoice_${orderNumber}.pdf`
  
  // Create a new anchor element
  const link = document.createElement("a");
  //link.href = pdfUrl;
  link.setAttribute('href', pdfUrl);
 
  // Set the download attribute to force download
  link.setAttribute("download", filename);
  
  // Append the anchor element to the document body
  document.body.appendChild(link);
  
  // Trigger the click event to initiate download
  link.click();
  
  // Remove the anchor element from the document body
  document.body.removeChild(link);
}

downloadBtn.addEventListener('click', () => {
    downloadPdf()
})