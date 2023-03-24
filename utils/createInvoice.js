const fs = require('fs')
const PDFDocument = require('pdfkit')
const now = require('./formatDate.js')

function createInvoice(invoice, path) {
	let doc = new PDFDocument({ size: "A4", margin: 50 })

	generateHeader(doc)
	generateHr(doc, 100)
    generateCustomerInformation(doc, invoice)
    generateInvoiceTable(doc, invoice)
	generateHr(doc, 755)
	generateFooter(doc)
	
	doc.end()
	doc.pipe(fs.createWriteStream(path));
}

	function generateHeader(doc) {
		doc.image('./public/src/images/LogoACME.jpg', 50, 45, { width: 50 })
			.fillColor('#444444')
			.fontSize(18)
			.text('ACME Inc.', 110, 57)
			.fontSize(10)
			.text('123 Main Street', 200, 65, { align: 'right' })
			.text('Córdoba, CBA, 5005', 200, 85, { align: 'right' })
			.moveDown();
	}

	function generateCustomerInformation(doc, invoice) {
	const shipping = invoice.shipping;
	doc
    	.fillColor("#444444")
    	.fontSize(18)
    	.text("Invoice", 50, 140)
		.fontSize(11)
		.text(`Invoice Number: ${invoice.invoice_nr}`, 50, 180)
		.text(`Invoice Date: ${now}`, 50, 200)
		.text(`Customer Information:`, 50, 220)
		.text(`Name: ${shipping.name}`, 70, 240)
		.text(`LastName: ${shipping.lastName}`, 70, 260)
		.text(`Em@il: ${shipping.email}`, 70, 280)
		.text(`Username: ${shipping.username}`, 70, 300)
		.text(`Date: ${formatDate(new Date())}`, 440, 115)
		.moveDown();
	}	

	function generateInvoiceTable(doc, invoice) {
		let i;
		const invoiceTableTop = 340;
		
		doc.font("Helvetica-Bold")
		generateTableRow(
		doc,
		invoiceTableTop,
		"Item Id",
		"Description",
		"Unit Cost",
		"Quantity",
		"Line Total"
		);
		generateHr(doc, invoiceTableTop + 20);
		doc.font("Helvetica")
	
		for (i = 0; i < invoice.items.length; i++) {
		const item = invoice.items[i]
		const position = invoiceTableTop + (i + 1) * 30;
		generateTableRow(
			doc,
			position,
			item.productId,
			item.name,
			formatCurrency(item.price),
			item.quantity,
			formatCurrency(item.total)
		);
		generateHr(doc, position + 20);
		}
	
		const subtotalPosition = invoiceTableTop + (i + 1) * 30;
		generateTableRow(
		doc,
		subtotalPosition,
		"",
		"",
		"Subtotal",
		"",
		formatCurrency(invoice.subTotal)
		);
	
		const paidToDatePosition = subtotalPosition + 25;
		generateTableRow(
		doc,
		paidToDatePosition,
		"",
		"",
		"Paid To Date",
		"",
		"",
		);

		const duePosition = paidToDatePosition + 25;
		doc.font("Helvetica-Bold");
		generateTableRow(
		doc,
		duePosition,
		"",
		"",
		"Balance Due",
		"",
		formatCurrency(invoice.subTotal)
		);
		doc.font("Helvetica")
	}

	function generateFooter(doc) {
		doc.fontSize(
			10,
		).text(
			'Payment is due within 15 days. Thank you for your business.',
			50,
			780,
			{ align: 'center', width: 500 },
		)
	}
    
	function generateTableRow(
		doc,
		y,
		item,
		description,
		price,
		quantity,
		subtotal,
		) {	
		doc
		.fontSize(7)
		.text(item, 50, y)
		.fontSize(9)
		.text(description, 160, y)
		.text(price, 280, y, { width: 90, align: "right" })
		.text(quantity, 370, y, { width: 90, align: "right" })
		.text(subtotal, 0, y, { align: "right" });
	}

	function generateHr(doc, y) {
		doc
		.strokeColor("#aaaaaa")
		.lineWidth(1)
		.moveTo(50, y)
		.lineTo(550, y)
		.stroke();
	}

	function formatDate(date) {
		const day = date.getDate();
		const month = date.getMonth() + 1;
		const year = date.getFullYear();
		return day + "/" + month + "/" + year;
	}

	function formatCurrency(price) {
		return "$" + (price).toFixed(2);
	}

module.exports = {
	createInvoice
};