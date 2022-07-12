import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'
import { Bill } from '../models/bill';
import { Company } from '../models/company';
import { Invoice } from '../models/invoice';
import { InvoiceCustomization } from '../models/invoice-customization';
import { Proposal } from '../models/proposal';
import { DateService } from './date.service';

@Injectable({
  providedIn: 'root'
})
export class PdfBuilderService {

  constructor(private translate: TranslateService, private dateService: DateService) { }

  buildInvoicePdfStandard(invoice: Invoice, invoiceCustomization: InvoiceCustomization, company: Company, output: string){
    const doc = new jsPDF( );
    // let finalY = (doc as any).lastAutoTable.finalY;
    let termsAndNotes: string = '';
    let totalPrice: string = '';
    let creditNote: string = '';
    let tax: string = '';
    let discount: string = '';
    let subTotal: string = '';
    let productsAndServices: string = '';
    let amountDue: string = '';
    let from: string = '';
    let shippingAddress: string = '';
    let invoicedTo: string = '';
    let dueDate: string = '';
    let number: string = '';
    let date: string = '';
    let reference: string = '';
    let invoiceLabel: string = '';
    let itemsLabel: string = '';
    let category: string = '';
    let quantity: string = '';
    let price: string = '';
    let shipTo: string = '';

    this.translate.get('general.noteAndTerms').subscribe(val => termsAndNotes = val);
    this.translate.get('general.totalPrice').subscribe(val => totalPrice = val);
    this.translate.get('general.creditNote').subscribe(val => creditNote = val);
    this.translate.get('general.tax').subscribe(val => tax = val);
    this.translate.get('general.discount').subscribe(val => discount = val);
    this.translate.get('general.subTotal').subscribe(val => subTotal = val);
    this.translate.get('invoice.detail.productsAndServices').subscribe(val => productsAndServices = val);
    this.translate.get('general.amountDue').subscribe(val => amountDue = val);
    this.translate.get('general.from').subscribe(val => from = val);
    this.translate.get('address.shippingAddress').subscribe(val => shippingAddress = val);
    this.translate.get('general.invoicedTo').subscribe(val => invoicedTo = val);
    this.translate.get('invoice.index.dueDate').subscribe(val => dueDate = val);
    this.translate.get('general.number').subscribe(val => number = val);
    this.translate.get('general.date').subscribe(val => date = val);
    this.translate.get('general.reference').subscribe(val => reference = val);
    this.translate.get('general.invoice').subscribe(val => invoiceLabel = val);
    this.translate.get('invoice.detail.items').subscribe(val => itemsLabel = val);
    this.translate.get('invoice.detail.category').subscribe(val => category = val);
    this.translate.get('general.quantity').subscribe(val => quantity = val);
    this.translate.get('invoice.detail.price').subscribe(val => price = val);
    this.translate.get('general.shipTo').subscribe(val => shipTo = val);

    autoTable(doc, {
      body: [
        [
          {
            content: company?.name,
            styles: {
              halign: 'left',
              fontSize:18,
              textColor:"#ffffff"
            }
          },

          {
            content: invoiceCustomization?.invoiceTitle ? invoiceCustomization?.invoiceTitle: invoiceLabel,
            styles: {
              halign: 'right',
              fontSize:18,
              textColor:"#ffffff"
            }
          },
        ],
      ],
      theme:"plain",
      styles:{
        fillColor: '#3366ff'
      }
    }
    );

    autoTable(doc, {
      body: [
        [
          {
            content:  reference+': '+invoice?.reference
            +' \n'+date+': '
            +this.dateService.formatDateTime(invoice?.invoiceDate)
            +' \n'+number+': '
            +invoice?.invoiceNumber,
            styles: {
              halign: 'right',
            }
          },
        ],
      ],
      theme:"plain",
    }
    );

    autoTable(doc, {
      body: [
        [
          {
            content: invoicedTo+": \n"
            + invoice?.customer?.name
            +"\n"
            +invoice?.customer?.billingAddress?.addressLine1
            +"\n"
            +invoice?.customer?.billingAddress?.addressLine2
            +"\n"
            +invoice?.customer?.billingAddress?.zipCode+" - "+invoice?.customer.billingAddress?.city
            +"\n"
            +invoice?.customer?.billingAddress?.country,
            styles: {
              halign: 'left'
            }
          },
          {
            content: shipTo+": \n"
            + invoice?.customer?.name
            +"\n"
            +invoice?.customer?.shippingAddress?.addressLine1
            +"\n"
            +invoice?.customer?.shippingAddress?.addressLine2
            +"\n"
            +invoice?.customer?.shippingAddress?.zipCode+" - "+invoice?.customer.billingAddress?.city
            +"\n"
            +invoice?.customer?.shippingAddress?.country,
            styles: {
              halign: 'left'
            }
          },
          {
            content: company?.name
            +"\n"
            +company?.billingAddress?.addressLine1
            +"\n"
            +company?.billingAddress?.addressLine2
            +"\n"
            +company?.billingAddress?.zipCode+" - "+company.billingAddress?.city
            +"\n"
            +company?.billingAddress?.country,
            styles: {
              halign: 'right',
            }
          }
        ]
      ],
      theme:"plain",
    }
    );

    autoTable(doc, {
      body: [
        [
          {
            content: '',
            styles: {
              halign: 'left',
            }
          },

          {
            content: invoiceCustomization?.price,
            styles: {
              halign: 'right',
              fontSize:14
            }
          },
        ],
        [
          {
            content: '',
            styles: {
              halign: 'left',
            }
          },
          {
            content: invoice?.currency?.symbol+invoice?.totalAmount,
            styles: {
              halign: 'right',
              fontSize:18,
              textColor:'#3366ff'
            }
          },
        ],
        [
          {
            content: '',
            styles: {
              halign: 'left',
            }
          },
          {
            content: dueDate+': '+this.dateService.formatDateTime(invoice?.issueDate),
            styles: {
              halign: 'right',
            }
          },
        ],
      ],
      theme:"plain"
    }
    );

    autoTable(doc, {
      body: [
        [
          {
            content: invoiceCustomization?.items ? invoiceCustomization?.items: productsAndServices,
            styles: {
              halign: 'left',
              fontSize:14
            }
          },
        ],
      ],
      theme:"plain"
    }
    );

    if (invoice !=null && invoice.invoiceLineItems?.length > 0){
      let head: string[] = [];
      head.push(invoiceCustomization?.items ? invoiceCustomization?.items: itemsLabel);
      if (!invoiceCustomization.hideCategory){
        head.push(category);
      }
      if (!invoiceCustomization?.hideQuantity){
        head.push(quantity);
      }
      if (!invoiceCustomization?.hidePrice){
        head.push(invoiceCustomization?.price ? invoiceCustomization?.price : price);
      }
      if (!invoiceCustomization?.hideTax){
        head.push(tax);
      }
      if (!invoiceCustomization?.hideDiscount){
        head.push(discount);
      }
      head.push(invoiceCustomization?.amount ? invoiceCustomization?.amount : totalPrice);

      let items: string[][] = [];
      invoice.invoiceLineItems.forEach(x => {
        let item: string[] = [];
        if (x.product != null){
          item.push(x.product.name+"\n"+x.description);
        }else if (x.service != null){
          item.push(x.service.name+"\n"+x.description);
        }
        if (!invoiceCustomization?.hideCategory){
          item.push(x.category);
        }
        if (!invoiceCustomization?.hideQuantity){
          item.push(x.quantity.toString());
        }

        if (x.product != null){
          if (!invoiceCustomization?.hidePrice){
            item.push(invoice.currency?.symbol+x.product.salePrice);
          }
          if (!invoiceCustomization?.hideTax){
            item.push(x.product?.tax?.name+" ("+x.product?.tax?.rate+"%)");
          }
        }else if (x.service != null){
          if (!invoiceCustomization?.hidePrice){
            item.push(invoice.currency?.symbol+x.service.salePrice);
          }
          if (!invoiceCustomization?.hideTax){
            item.push(x.service?.tax?.name+" ("+x.service?.tax?.rate+"%)");
          }
        }
        if (!invoiceCustomization?.hideDiscount){
          item.push(x.discount+"%");
        }
        item.push(invoice.currency?.symbol+x.totalPrice);
        items.push(item);
      });

      autoTable(doc, {
        head: [head],
        body: items,
        theme:"striped",
        headStyles:{
          fillColor:"#343a40"
        }
      }
      );
    }

    autoTable(doc, {
      body: [
        [
          {
            content: '',
          },
          {
            content: '',
          },
          {
            content: subTotal+':',
            styles: {
              halign: 'right',
            }
          },
          {
            content: invoice?.currency?.symbol+invoice?.subTotalPrice,
            styles: {
              halign: 'right',
            }
          },
        ],
        [
          {
            content: '',
          },
          {
            content: '',
          },
          {
            content: discount+':',
            styles: {
              halign: 'right',
            }
          },
          {
            content: invoice?.currency?.symbol+invoice?.totalDiscount,
            styles: {
              halign: 'right',
            }
          },
        ],
        [
          {
            content: '',
          },
          {
            content: '',
          },
          {
            content: tax+':',
            styles: {
              halign: 'right',
            }
          },
          {
            content: invoice?.currency?.symbol+invoice?.totalTax,
            styles: {
              halign: 'right',
            }
          },
        ],
        [
          {
            content: '',
          },
          {
            content: '',
          },
          {
            content: creditNote+':',
            styles: {
              halign: 'right',
            }
          },
          {
            content: invoice?.currency?.symbol+invoice?.totalCreditNote,
            styles: {
              halign: 'right',
            }
          },
        ],
        [
          {
            content: '',
          },
          {
            content: '',
          },
          {
            content: totalPrice+':',
            styles: {
              halign: 'right',
            }
          },
          {
            content: invoice?.currency?.symbol+invoice?.totalAmount,
            styles: {
              halign: 'right',
            }
          },
        ],
      ],
      theme:"plain"
    }
    );

    if (invoice?.description || invoiceCustomization?.invoiceNotes){
      autoTable(doc, {
        body: [
          [
            {
              content: termsAndNotes,
              styles: {
                halign: 'left',
                fontSize:14
              }
            },
            {
              content: '',
              styles: {
                halign: 'right',
              }
            },
          ],
          [
            {
              content: invoice?.description ? invoice?.description : invoiceCustomization?.invoiceNotes,
              styles: {
                halign: 'left',
              }
            },
          ],
        ],
        theme:"plain"
      }
      );
    }

    autoTable(doc, {
      body: [
        [
          {
            content: invoiceCustomization?.invoiceFooter,
            styles: {
              halign: 'center',
            }
          },
        ],
      ],
      theme:"plain"
    }
    );
    //print

    if (output === "print"){
      doc.autoPrint();
      return doc.output('dataurlnewwindow');
    }else if (output === "save") {
      return doc.save(invoice.reference);
    }else if ("embed") {
      return doc.output('datauristring');
    }

  }

  buildInvoicePdfTrappist1(invoice: Invoice, invoiceCustomization: InvoiceCustomization, company: Company, output: string){
    const doc = new jsPDF();
    // let finalY = (doc as any).lastAutoTable.finalY;
    let termsAndNotes: string = '';
    let totalPrice: string = '';
    let creditNote: string = '';
    let tax: string = '';
    let discount: string = '';
    let subTotal: string = '';
    let productsAndServices: string = '';
    let amountDue: string = '';
    let from: string = '';
    let shippingAddress: string = '';
    let invoicedTo: string = '';
    let dueDate: string = '';
    let number: string = '';
    let date: string = '';
    let reference: string = '';
    let invoiceLabel: string = '';
    let itemsLabel: string = '';
    let category: string = '';
    let quantity: string = '';
    let price: string = '';
    let shipTo: string = '';

    this.translate.get('general.noteAndTerms').subscribe(val => termsAndNotes = val);
    this.translate.get('general.totalPrice').subscribe(val => totalPrice = val);
    this.translate.get('general.creditNote').subscribe(val => creditNote = val);
    this.translate.get('general.tax').subscribe(val => tax = val);
    this.translate.get('general.discount').subscribe(val => discount = val);
    this.translate.get('general.subTotal').subscribe(val => subTotal = val);
    this.translate.get('invoice.detail.productsAndServices').subscribe(val => productsAndServices = val);
    this.translate.get('general.amountDue').subscribe(val => amountDue = val);
    this.translate.get('general.from').subscribe(val => from = val);
    this.translate.get('address.shippingAddress').subscribe(val => shippingAddress = val);
    this.translate.get('general.invoicedTo').subscribe(val => invoicedTo = val);
    this.translate.get('invoice.index.dueDate').subscribe(val => dueDate = val);
    this.translate.get('general.number').subscribe(val => number = val);
    this.translate.get('general.date').subscribe(val => date = val);
    this.translate.get('general.reference').subscribe(val => reference = val);
    this.translate.get('general.invoice').subscribe(val => invoiceLabel = val);
    this.translate.get('invoice.detail.items').subscribe(val => itemsLabel = val);
    this.translate.get('invoice.detail.category').subscribe(val => category = val);
    this.translate.get('general.quantity').subscribe(val => quantity = val);
    this.translate.get('invoice.detail.price').subscribe(val => price = val);
    this.translate.get('general.shipTo').subscribe(val => shipTo = val);

    autoTable(doc, {
      body: [
        [
          {
            content: invoiceCustomization?.invoiceTitle ? invoiceCustomization?.invoiceTitle: invoiceLabel,
            styles: {
              halign: 'left',
              fontSize:20,
              textColor:"#ffffff"
            }
          },
        ],
      ],
      theme:"plain",
      styles:{
        fillColor:'#3366ff'
      }
    }
    );

    autoTable(doc, {
      body: [
        [
          {
            content: company?.name
            +"\n"
            +company.billingAddress?.addressLine1
            +"\n"
            +company.billingAddress?.addressLine2
            +"\n"
            +company.billingAddress?.zipCode+" - "+company.billingAddress?.city
            +"\n"
            +company.billingAddress?.country,
            styles: {
              halign: 'left',
            }
          }
        ]
      ],
      theme:"plain",
    }
    );

    autoTable(doc, {
      body: [
        [
          {
            content: invoicedTo+": \n"
            + invoice?.customer?.name
            +"\n"
            +invoice?.customer.billingAddress?.addressLine1
            +"\n"
            +invoice?.customer.billingAddress?.addressLine2
            +"\n"
            +invoice?.customer.billingAddress?.zipCode+" - "+invoice?.customer.billingAddress?.city
            +"\n"
            +invoice?.customer.billingAddress?.country,
            styles: {
              halign: 'left'
            }
          },
          {
            content: shipTo+": \n"
            + invoice?.customer?.name
            +invoice?.customer.shippingAddress?.addressLine1
            +"\n"
            +invoice?.customer.shippingAddress?.addressLine2
            +"\n"
            +invoice?.customer.shippingAddress?.zipCode+" - "+invoice?.customer.billingAddress?.city
            +"\n"
            +invoice?.customer.shippingAddress?.country,
            styles: {
              halign: 'left'
            }
          },
          {
            content:  reference+': '+invoice?.reference
            +' \n'+date+': '
            +this.dateService.formatDateTime(invoice?.invoiceDate)
            +' \n'+number+': '
            +invoice?.invoiceNumber
            +' \n'+dueDate+': '+this.dateService.formatDateTime(invoice?.issueDate),
            styles: {
              halign: 'right',
            }
          },
        ],
      ],
      theme:"plain",
    }
    );

    autoTable(doc, {
      body: [
        [
          {
            content: invoiceCustomization?.items ? invoiceCustomization?.items: productsAndServices,
            styles: {
              halign: 'left',
              fontSize:14
            }
          },
        ],
      ],
      theme:"plain"
    }
    );

    if (invoice !=null && invoice.invoiceLineItems.length > 0){
      let head: string[] = [];
      head.push(invoiceCustomization?.items ? invoiceCustomization?.items: itemsLabel);
      if (!invoiceCustomization.hideCategory){
        head.push(category);
      }
      if (!invoiceCustomization.hideQuantity){
        head.push(quantity);
      }
      if (!invoiceCustomization.hidePrice){
        head.push(invoiceCustomization?.price ? invoiceCustomization?.price : price);
      }
      if (!invoiceCustomization.hideTax){
        head.push(tax);
      }
      if (!invoiceCustomization.hideDiscount){
        head.push(discount);
      }
      head.push(invoiceCustomization?.amount ? invoiceCustomization?.amount : totalPrice);

      let items: string[][] = [];
      invoice.invoiceLineItems.forEach(x => {
        let item: string[] = [];
        if (x.product != null){
          item.push(x.product.name+"\n"+x.description);
        }else if (x.service != null){
          item.push(x.service.name+"\n"+x.description);
        }
        if (!invoiceCustomization.hideCategory){
          item.push(x.category);
        }
        if (!invoiceCustomization.hideQuantity){
          item.push(x.quantity.toString());
        }

        if (x.product != null){
          if (!invoiceCustomization.hidePrice){
            item.push(invoice.currency?.symbol+x.product.salePrice);
          }
          if (!invoiceCustomization.hideTax){
            item.push(x.product?.tax?.name+" ("+x.product?.tax?.rate+"%)");
          }
        }else if (x.service != null){
          if (!invoiceCustomization.hidePrice){
            item.push(invoice.currency?.symbol+x.service.salePrice);
          }
          if (!invoiceCustomization.hideTax){
            item.push(x.service?.tax?.name+" ("+x.service?.tax?.rate+"%)");
          }
        }
        if (!invoiceCustomization.hideDiscount){
          item.push(x.discount+"%");
        }
        item.push(invoice.currency?.symbol+x.totalPrice);
        items.push(item);
      });

      autoTable(doc, {
        head: [head],
        body: items,
        theme:"striped",
        headStyles:{
          fillColor:"#343a40"
        }
      }
      );
    }

    autoTable(doc, {
      body: [
        [
          {
            content: '',
          },
          {
            content: '',
          },
          {
            content: subTotal+':',
            styles: {
              halign: 'right',
            }
          },
          {
            content: invoice?.currency?.symbol+invoice?.subTotalPrice,
            styles: {
              halign: 'right',
            }
          },
        ],
        [
          {
            content: '',
          },
          {
            content: '',
          },
          {
            content: discount+':',
            styles: {
              halign: 'right',
            }
          },
          {
            content: invoice?.currency?.symbol+invoice?.totalDiscount,
            styles: {
              halign: 'right',
            }
          },
        ],
        [
          {
            content: '',
          },
          {
            content: '',
          },
          {
            content: tax+':',
            styles: {
              halign: 'right',
            }
          },
          {
            content: invoice?.currency?.symbol+invoice?.totalTax,
            styles: {
              halign: 'right',
            }
          },
        ],
        [
          {
            content: '',
          },
          {
            content: '',
          },
          {
            content: creditNote+':',
            styles: {
              halign: 'right',
            }
          },
          {
            content: invoice?.currency?.symbol+invoice?.totalCreditNote,
            styles: {
              halign: 'right',
            }
          },
        ],
        [
          {
            content: '',
          },
          {
            content: '',
          },
          {
            content: totalPrice+':',
            styles: {
              halign: 'right',
              textColor: '#3366ff',
              fontSize:18
            }
          },
          {
            content: invoice?.currency?.symbol+invoice?.totalAmount,
            styles: {
              halign: 'right',
              textColor: '#3366ff',
              fontSize:18
            }
          },
        ],
      ],
      theme:"plain"
    }
    );

    if (invoice?.description || invoiceCustomization?.invoiceNotes){
      autoTable(doc, {
        body: [
          [
            {
              content: termsAndNotes,
              styles: {
                halign: 'left',
                fontSize:14
              }
            },
            {
              content: '',
              styles: {
                halign: 'right',
              }
            },
          ],
          [
            {
              content: invoice?.description ? invoice?.description : invoiceCustomization?.invoiceNotes,
              styles: {
                halign: 'left',
              }
            },
          ],
        ],
        theme:"plain"
      }
      );
    }

    autoTable(doc, {
      body: [
        [
          {
            content: invoiceCustomization?.invoiceFooter,
            styles: {
              halign: 'center',
            }
          },
        ],
      ],
      theme:"plain"
    }
    );

    if (output === "print"){
      doc.autoPrint();
      return doc.output('dataurlnewwindow');
    }else if (output === "save") {
      return doc.save(invoice.reference);
    }else {
      return doc.output('datauristring');
    }
  }

  buildEstimatePdfStandard(estimate: Proposal, invoiceCustomization: InvoiceCustomization, company: Company, output: string){
    const doc = new jsPDF( );
    // let finalY = (doc as any).lastAutoTable.finalY;
    let termsAndNotes: string = '';
    let totalPrice: string = '';
    let creditNote: string = '';
    let tax: string = '';
    let discount: string = '';
    let subTotal: string = '';
    let productsAndServices: string = '';
    let amountDue: string = '';
    let from: string = '';
    let shippingAddress: string = '';
    let sentTo: string = '';
    let dueDate: string = '';
    let number: string = '';
    let date: string = '';
    let reference: string = '';
    let estimateLabel: string = '';
    let itemsLabel: string = '';
    let category: string = '';
    let quantity: string = '';
    let price: string = '';
    let shipTo: string = '';

    this.translate.get('general.noteAndTerms').subscribe(val => termsAndNotes = val);
    this.translate.get('general.totalPrice').subscribe(val => totalPrice = val);
    this.translate.get('general.creditNote').subscribe(val => creditNote = val);
    this.translate.get('general.tax').subscribe(val => tax = val);
    this.translate.get('general.discount').subscribe(val => discount = val);
    this.translate.get('general.subTotal').subscribe(val => subTotal = val);
    this.translate.get('invoice.detail.productsAndServices').subscribe(val => productsAndServices = val);
    this.translate.get('general.amountDue').subscribe(val => amountDue = val);
    this.translate.get('general.from').subscribe(val => from = val);
    this.translate.get('address.shippingAddress').subscribe(val => shippingAddress = val);
    this.translate.get('general.sentTo').subscribe(val => sentTo = val);
    this.translate.get('invoice.index.dueDate').subscribe(val => dueDate = val);
    this.translate.get('general.number').subscribe(val => number = val);
    this.translate.get('general.date').subscribe(val => date = val);
    this.translate.get('general.reference').subscribe(val => reference = val);
    this.translate.get('general.estimate').subscribe(val => estimateLabel = val);
    this.translate.get('invoice.detail.items').subscribe(val => itemsLabel = val);
    this.translate.get('invoice.detail.category').subscribe(val => category = val);
    this.translate.get('general.quantity').subscribe(val => quantity = val);
    this.translate.get('invoice.detail.price').subscribe(val => price = val);
    this.translate.get('general.shipTo').subscribe(val => shipTo = val);

    autoTable(doc, {
      body: [
        [
          {
            content: company?.name,
            styles: {
              halign: 'left',
              fontSize:18,
              textColor:"#ffffff"
            }
          },

          {
            content: invoiceCustomization?.estimateTitle ? invoiceCustomization?.estimateTitle: estimateLabel,
            styles: {
              halign: 'right',
              fontSize:18,
              textColor:"#ffffff"
            }
          },
        ],
      ],
      theme:"plain",
      styles:{
        fillColor: '#3366ff'
      }
    }
    );

    autoTable(doc, {
      body: [
        [
          {
            content:  reference+': '+estimate?.reference
            +' \n'+date+': '
            +this.dateService.formatDateTime(estimate?.proposalDate)
            +' \n'+number+': '
            +estimate?.proposalNumber,
            styles: {
              halign: 'right',
            }
          },
        ],
      ],
      theme:"plain",
    }
    );

    autoTable(doc, {
      body: [
        [
          {
            content: sentTo+": \n"
            + estimate?.customer?.name
            +"\n"
            +estimate?.customer?.billingAddress?.addressLine1
            +"\n"
            +estimate?.customer?.billingAddress?.addressLine2
            +"\n"
            +estimate?.customer?.billingAddress?.zipCode+" - "+estimate?.customer?.billingAddress?.city
            +"\n"
            +estimate?.customer?.billingAddress?.country,
            styles: {
              halign: 'left'
            }
          },
          {
            content: shipTo+": \n"
            + estimate?.customer?.name
            +"\n"
            +estimate?.customer?.shippingAddress?.addressLine1
            +"\n"
            +estimate?.customer?.shippingAddress?.addressLine2
            +"\n"
            +estimate?.customer?.shippingAddress?.zipCode+" - "+estimate?.customer?.billingAddress?.city
            +"\n"
            +estimate?.customer?.shippingAddress?.country,
            styles: {
              halign: 'left'
            }
          },
          {
            content: company?.name
            +"\n"
            +company?.billingAddress?.addressLine1
            +"\n"
            +company?.billingAddress?.addressLine2
            +"\n"
            +company?.billingAddress?.zipCode+" - "+company?.billingAddress?.city
            +"\n"
            +company?.billingAddress?.country,
            styles: {
              halign: 'right',
            }
          }
        ]
      ],
      theme:"plain",
    }
    );

    autoTable(doc, {
      body: [
        [
          {
            content: '',
            styles: {
              halign: 'left',
            }
          },

          {
            content: invoiceCustomization?.price,
            styles: {
              halign: 'right',
              fontSize:14
            }
          },
        ],
        [
          {
            content: '',
            styles: {
              halign: 'left',
            }
          },
          {
            content: estimate?.currency?.symbol+estimate?.totalAmount,
            styles: {
              halign: 'right',
              fontSize:18,
              textColor:'#3366ff'
            }
          },
        ],
        [
          {
            content: '',
            styles: {
              halign: 'left',
            }
          },
          {
            content: dueDate+': '+this.dateService.formatDateTime(estimate?.issueDate),
            styles: {
              halign: 'right',
            }
          },
        ],
      ],
      theme:"plain"
    }
    );

    autoTable(doc, {
      body: [
        [
          {
            content: invoiceCustomization?.items ? invoiceCustomization?.items: productsAndServices,
            styles: {
              halign: 'left',
              fontSize:14
            }
          },
        ],
      ],
      theme:"plain"
    }
    );

    if (estimate !=null && estimate.proposalLineItems?.length > 0){
      let head: string[] = [];
      head.push(invoiceCustomization?.items ? invoiceCustomization?.items: itemsLabel);
      if (!invoiceCustomization?.hideCategory){
        head.push(category);
      }
      if (!invoiceCustomization?.hideQuantity){
        head.push(quantity);
      }
      if (!invoiceCustomization.hidePrice){
        head.push(invoiceCustomization?.price ? invoiceCustomization?.price : price);
      }
      if (!invoiceCustomization?.hideTax){
        head.push(tax);
      }
      if (!invoiceCustomization?.hideDiscount){
        head.push(discount);
      }
      head.push(invoiceCustomization?.amount ? invoiceCustomization?.amount : totalPrice);

      let items: string[][] = [];
      estimate.proposalLineItems.forEach(x => {
        let item: string[] = [];
        if (x.product != null){
          item.push(x.product.name+"\n"+x.description);
        }else if (x.service != null){
          item.push(x.service.name+"\n"+x.description);
        }
        if (!invoiceCustomization?.hideCategory){
          item.push(x.category);
        }
        if (!invoiceCustomization?.hideQuantity){
          item.push(x.quantity.toString());
        }

        if (x.product != null){
          if (!invoiceCustomization?.hidePrice){
            item.push(estimate.currency?.symbol+x.product.salePrice);
          }
          if (!invoiceCustomization?.hideTax){
            item.push(x.product?.tax?.name+" ("+x.product?.tax?.rate+"%)");
          }
        }else if (x.service != null){
          if (!invoiceCustomization?.hidePrice){
            item.push(estimate.currency?.symbol+x.service.salePrice);
          }
          if (!invoiceCustomization?.hideTax){
            item.push(x.service?.tax?.name+" ("+x.service?.tax?.rate+"%)");
          }
        }
        if (!invoiceCustomization?.hideDiscount){
          item.push(x.discount+"%");
        }
        item.push(estimate.currency?.symbol+x.totalPrice);
        items.push(item);
      });

      autoTable(doc, {
        head: [head],
        body: items,
        theme:"striped",
        headStyles:{
          fillColor:"#343a40"
        }
      }
      );
    }

    autoTable(doc, {
      body: [
        [
          {
            content: '',
          },
          {
            content: '',
          },
          {
            content: subTotal+':',
            styles: {
              halign: 'right',
            }
          },
          {
            content: estimate?.currency?.symbol+estimate?.subTotalPrice,
            styles: {
              halign: 'right',
            }
          },
        ],
        [
          {
            content: '',
          },
          {
            content: '',
          },
          {
            content: discount+':',
            styles: {
              halign: 'right',
            }
          },
          {
            content: estimate?.currency?.symbol+estimate?.totalDiscount,
            styles: {
              halign: 'right',
            }
          },
        ],
        [
          {
            content: '',
          },
          {
            content: '',
          },
          {
            content: tax+':',
            styles: {
              halign: 'right',
            }
          },
          {
            content: estimate?.currency?.symbol+estimate?.totalTax,
            styles: {
              halign: 'right',
            }
          },
        ],
        [
          {
            content: '',
          },
          {
            content: '',
          },
          {
            content: creditNote+':',
            styles: {
              halign: 'right',
            }
          },
          {
            content: estimate?.currency?.symbol+estimate?.totalCreditNote,
            styles: {
              halign: 'right',
            }
          },
        ],
        [
          {
            content: '',
          },
          {
            content: '',
          },
          {
            content: totalPrice+':',
            styles: {
              halign: 'right',
            }
          },
          {
            content: estimate?.currency?.symbol+estimate?.totalAmount,
            styles: {
              halign: 'right',
            }
          },
        ],
      ],
      theme:"plain"
    }
    );

    if (estimate?.description || invoiceCustomization?.estimateNotes){
      autoTable(doc, {
        body: [
          [
            {
              content: termsAndNotes,
              styles: {
                halign: 'left',
                fontSize:14
              }
            },
            {
              content: '',
              styles: {
                halign: 'right',
              }
            },
          ],
          [
            {
              content: estimate?.description ? estimate?.description : invoiceCustomization?.estimateNotes,
              styles: {
                halign: 'left',
              }
            },
          ],
        ],
        theme:"plain"
      }
      );
    }

    autoTable(doc, {
      body: [
        [
          {
            content: invoiceCustomization?.estimateFooter,
            styles: {
              halign: 'center',
            }
          },
        ],
      ],
      theme:"plain"
    }
    );
    //print

    if (output === "print"){
      doc.autoPrint();
      return doc.output('dataurlnewwindow');
    }else if (output === "save") {
      return doc.save(estimate.reference);
    }else if ("embed") {
      return doc.output('datauristring');
    }

  }

  buildEstimatePdfTrappist1(estimate: Proposal, invoiceCustomization: InvoiceCustomization, company: Company, output: string){
    const doc = new jsPDF();
    // let finalY = (doc as any).lastAutoTable.finalY;
    let termsAndNotes: string = '';
    let totalPrice: string = '';
    let creditNote: string = '';
    let tax: string = '';
    let discount: string = '';
    let subTotal: string = '';
    let productsAndServices: string = '';
    let amountDue: string = '';
    let from: string = '';
    let shippingAddress: string = '';
    let sentTo: string = '';
    let dueDate: string = '';
    let number: string = '';
    let date: string = '';
    let reference: string = '';
    let estimateLabel: string = '';
    let itemsLabel: string = '';
    let category: string = '';
    let quantity: string = '';
    let price: string = '';
    let shipTo: string = '';

    this.translate.get('general.noteAndTerms').subscribe(val => termsAndNotes = val);
    this.translate.get('general.totalPrice').subscribe(val => totalPrice = val);
    this.translate.get('general.creditNote').subscribe(val => creditNote = val);
    this.translate.get('general.tax').subscribe(val => tax = val);
    this.translate.get('general.discount').subscribe(val => discount = val);
    this.translate.get('general.subTotal').subscribe(val => subTotal = val);
    this.translate.get('invoice.detail.productsAndServices').subscribe(val => productsAndServices = val);
    this.translate.get('general.amountDue').subscribe(val => amountDue = val);
    this.translate.get('general.from').subscribe(val => from = val);
    this.translate.get('address.shippingAddress').subscribe(val => shippingAddress = val);
    this.translate.get('general.sentTo').subscribe(val => sentTo = val);
    this.translate.get('invoice.index.dueDate').subscribe(val => dueDate = val);
    this.translate.get('general.number').subscribe(val => number = val);
    this.translate.get('general.date').subscribe(val => date = val);
    this.translate.get('general.reference').subscribe(val => reference = val);
    this.translate.get('general.estimate').subscribe(val => estimateLabel = val);
    this.translate.get('invoice.detail.items').subscribe(val => itemsLabel = val);
    this.translate.get('invoice.detail.category').subscribe(val => category = val);
    this.translate.get('general.quantity').subscribe(val => quantity = val);
    this.translate.get('invoice.detail.price').subscribe(val => price = val);
    this.translate.get('general.shipTo').subscribe(val => shipTo = val);

    autoTable(doc, {
      body: [
        [
          {
            content: invoiceCustomization?.estimateTitle ? invoiceCustomization?.estimateTitle: estimateLabel,
            styles: {
              halign: 'left',
              fontSize:20,
              textColor:"#ffffff"
            }
          }
        ],
      ],
      theme:"plain",
      styles:{
        fillColor:'#3366ff'
      }
    }
    );

    autoTable(doc, {
      body: [
        [
          {
            content: company?.name
            +"\n"
            +company?.billingAddress?.addressLine1
            +"\n"
            +company?.billingAddress?.addressLine2
            +"\n"
            +company?.billingAddress?.zipCode+" - "+company.billingAddress?.city
            +"\n"
            +company?.billingAddress?.country,
            styles: {
              halign: 'left',
            }
          }
        ]
      ],
      theme:"plain",
    }
    );

    autoTable(doc, {
      body: [
        [
          {
            content: sentTo+": \n"
            + estimate?.customer?.name
            +"\n"
            +estimate?.customer?.billingAddress?.addressLine1
            +"\n"
            +estimate?.customer?.billingAddress?.addressLine2
            +"\n"
            +estimate?.customer?.billingAddress?.zipCode+" - "+estimate?.customer?.billingAddress?.city
            +"\n"
            +estimate?.customer?.billingAddress?.country,
            styles: {
              halign: 'left'
            }
          },
          {
            content: shipTo+": \n"
            + estimate?.customer?.name
            +estimate?.customer?.shippingAddress?.addressLine1
            +"\n"
            +estimate?.customer?.shippingAddress?.addressLine2
            +"\n"
            +estimate?.customer?.shippingAddress?.zipCode+" - "+estimate?.customer?.billingAddress?.city
            +"\n"
            +estimate?.customer?.shippingAddress?.country,
            styles: {
              halign: 'left'
            }
          },
          {
            content:  reference+': '+estimate?.reference
            +' \n'+date+': '
            +this.dateService.formatDateTime(estimate?.proposalDate)
            +' \n'+number+': '
            +estimate?.proposalNumber
            +' \n'+dueDate+': '+this.dateService.formatDateTime(estimate?.issueDate),
            styles: {
              halign: 'right',
            }
          },
        ],
      ],
      theme:"plain",
    }
    );

    autoTable(doc, {
      body: [
        [
          {
            content: invoiceCustomization?.items ? invoiceCustomization?.items: productsAndServices,
            styles: {
              halign: 'left',
              fontSize:14
            }
          },
        ],
      ],
      theme:"plain"
    }
    );

    if (estimate !=null && estimate.proposalLineItems?.length > 0){
      let head: string[] = [];
      head.push(invoiceCustomization?.items ? invoiceCustomization?.items: itemsLabel);
      if (!invoiceCustomization.hideCategory){
        head.push(category);
      }
      if (!invoiceCustomization.hideQuantity){
        head.push(quantity);
      }
      if (!invoiceCustomization.hidePrice){
        head.push(invoiceCustomization?.price ? invoiceCustomization?.price : price);
      }
      if (!invoiceCustomization.hideTax){
        head.push(tax);
      }
      if (!invoiceCustomization.hideDiscount){
        head.push(discount);
      }
      head.push(invoiceCustomization?.amount ? invoiceCustomization?.amount : totalPrice);

      let items: string[][] = [];
      estimate.proposalLineItems.forEach(x => {
        let item: string[] = [];
        if (x.product != null){
          item.push(x.product.name+"\n"+x.description);
        }else if (x.service != null){
          item.push(x.service.name+"\n"+x.description);
        }
        if (!invoiceCustomization.hideCategory){
          item.push(x.category);
        }
        if (!invoiceCustomization.hideQuantity){
          item.push(x.quantity.toString());
        }

        if (x.product != null){
          if (!invoiceCustomization.hidePrice){
            item.push(estimate.currency?.symbol+x.product.salePrice);
          }
          if (!invoiceCustomization.hideTax){
            item.push(x.product?.tax?.name+" ("+x.product?.tax?.rate+"%)");
          }
        }else if (x.service != null){
          if (!invoiceCustomization.hidePrice){
            item.push(estimate.currency?.symbol+x.service.salePrice);
          }
          if (!invoiceCustomization.hideTax){
            item.push(x.service?.tax?.name+" ("+x.service?.tax?.rate+"%)");
          }
        }
        if (!invoiceCustomization.hideDiscount){
          item.push(x.discount+"%");
        }
        item.push(estimate.currency?.symbol+x.totalPrice);
        items.push(item);
      });

      autoTable(doc, {
        head: [head],
        body: items,
        theme:"striped",
        headStyles:{
          fillColor:"#343a40"
        }
      }
      );
    }

    autoTable(doc, {
      body: [
        [
          {
            content: '',
          },
          {
            content: '',
          },
          {
            content: subTotal+':',
            styles: {
              halign: 'right',
            }
          },
          {
            content: estimate?.currency?.symbol+estimate?.subTotalPrice,
            styles: {
              halign: 'right',
            }
          },
        ],
        [
          {
            content: '',
          },
          {
            content: '',
          },
          {
            content: discount+':',
            styles: {
              halign: 'right',
            }
          },
          {
            content: estimate?.currency?.symbol+estimate?.totalDiscount,
            styles: {
              halign: 'right',
            }
          },
        ],
        [
          {
            content: '',
          },
          {
            content: '',
          },
          {
            content: tax+':',
            styles: {
              halign: 'right',
            }
          },
          {
            content: estimate?.currency?.symbol+estimate?.totalTax,
            styles: {
              halign: 'right',
            }
          },
        ],
        [
          {
            content: '',
          },
          {
            content: '',
          },
          {
            content: creditNote+':',
            styles: {
              halign: 'right',
            }
          },
          {
            content: estimate?.currency?.symbol+estimate?.totalCreditNote,
            styles: {
              halign: 'right',
            }
          },
        ],
        [
          {
            content: '',
          },
          {
            content: '',
          },
          {
            content: totalPrice+':',
            styles: {
              halign: 'right',
              textColor: '#3366ff',
              fontSize:18
            }
          },
          {
            content: estimate?.currency?.symbol+estimate?.totalAmount,
            styles: {
              halign: 'right',
              textColor: '#3366ff',
              fontSize:18
            }
          },
        ],
      ],
      theme:"plain"
    }
    );

    if (estimate?.description || invoiceCustomization?.estimateNotes){
      autoTable(doc, {
        body: [
          [
            {
              content: termsAndNotes,
              styles: {
                halign: 'left',
                fontSize:14
              }
            },
            {
              content: '',
              styles: {
                halign: 'right',
              }
            },
          ],
          [
            {
              content: estimate?.description ? estimate?.description : invoiceCustomization?.estimateNotes,
              styles: {
                halign: 'left',
              }
            },
          ],
        ],
        theme:"plain"
      }
      );
    }

    autoTable(doc, {
      body: [
        [
          {
            content: invoiceCustomization?.estimateFooter,
            styles: {
              halign: 'center',
            }
          },
        ],
      ],
      theme:"plain"
    }
    );

    if (output === "print"){
      doc.autoPrint();
      return doc.output('dataurlnewwindow');
    }else if (output === "save") {
      return doc.save(estimate.reference);
    }else {
      return doc.output('datauristring');
    }
  }

  buildBillPdfStandard(bill: Bill, company: Company, output: string){
    const doc = new jsPDF( );
    // let finalY = (doc as any).lastAutoTable.finalY;
    let termsAndNotes: string = '';
    let totalPrice: string = '';
    let creditNote: string = '';
    let tax: string = '';
    let discount: string = '';
    let subTotal: string = '';
    let productsAndServices: string = '';
    let amountDue: string = '';
    let from: string = '';
    let shippingAddress: string = '';
    let sentTo: string = '';
    let dueDate: string = '';
    let number: string = '';
    let date: string = '';
    let reference: string = '';
    let billLabel: string = '';
    let itemsLabel: string = '';
    let category: string = '';
    let quantity: string = '';
    let price: string = '';
    let shipTo: string = '';

    this.translate.get('general.noteAndTerms').subscribe(val => termsAndNotes = val);
    this.translate.get('general.totalPrice').subscribe(val => totalPrice = val);
    this.translate.get('general.creditNote').subscribe(val => creditNote = val);
    this.translate.get('general.tax').subscribe(val => tax = val);
    this.translate.get('general.discount').subscribe(val => discount = val);
    this.translate.get('general.subTotal').subscribe(val => subTotal = val);
    this.translate.get('invoice.detail.productsAndServices').subscribe(val => productsAndServices = val);
    this.translate.get('general.amountDue').subscribe(val => amountDue = val);
    this.translate.get('general.from').subscribe(val => from = val);
    this.translate.get('address.shippingAddress').subscribe(val => shippingAddress = val);
    this.translate.get('general.sentTo').subscribe(val => sentTo = val);
    this.translate.get('invoice.index.dueDate').subscribe(val => dueDate = val);
    this.translate.get('general.number').subscribe(val => number = val);
    this.translate.get('general.date').subscribe(val => date = val);
    this.translate.get('general.reference').subscribe(val => reference = val);
    this.translate.get('general.bill').subscribe(val => billLabel = val);
    this.translate.get('invoice.detail.items').subscribe(val => itemsLabel = val);
    this.translate.get('invoice.detail.category').subscribe(val => category = val);
    this.translate.get('general.quantity').subscribe(val => quantity = val);
    this.translate.get('invoice.detail.price').subscribe(val => price = val);
    this.translate.get('general.shipTo').subscribe(val => shipTo = val);

    autoTable(doc, {
      body: [
        [
          {
            content: company?.name,
            styles: {
              halign: 'left',
              fontSize:18,
              textColor:"#ffffff"
            }
          },

          {
            content: billLabel,
            styles: {
              halign: 'right',
              fontSize:18,
              textColor:"#ffffff"
            }
          },
        ],
      ],
      theme:"plain",
      styles:{
        fillColor: '#3366ff'
      }
    }
    );

    autoTable(doc, {
      body: [
        [
          {
            content:  reference+': '+bill?.reference
            +' \n'+date+': '
            +this.dateService.formatDateTime(bill?.billDate)
            +' \n'+number+': '
            +bill?.orderNumber,
            styles: {
              halign: 'right',
            }
          },
        ],
      ],
      theme:"plain",
    }
    );

    autoTable(doc, {
      body: [
        [
          {
            content: from+": \n"
            + bill?.vendor?.name
            +"\n"
            +bill?.vendor?.billingAddress?.addressLine1
            +"\n"
            +bill?.vendor?.billingAddress?.addressLine2
            +"\n"
            +bill?.vendor?.billingAddress?.zipCode+" - "+bill?.vendor?.billingAddress?.city
            +"\n"
            +bill?.vendor?.billingAddress?.country,
            styles: {
              halign: 'left'
            }
          },
          {
            content: company?.name
            +"\n"
            +company?.billingAddress?.addressLine1
            +"\n"
            +company?.billingAddress?.addressLine2
            +"\n"
            +company?.billingAddress?.zipCode+" - "+company?.billingAddress?.city
            +"\n"
            +company?.billingAddress?.country,
            styles: {
              halign: 'right',
            }
          }
        ]
      ],
      theme:"plain",
    }
    );

    autoTable(doc, {
      body: [
        [
          {
            content: '',
            styles: {
              halign: 'left',
            }
          },

          {
            content: price,
            styles: {
              halign: 'right',
              fontSize:14
            }
          },
        ],
        [
          {
            content: '',
            styles: {
              halign: 'left',
            }
          },
          {
            content: bill?.currency?.symbol+bill?.totalAmount,
            styles: {
              halign: 'right',
              fontSize:18,
              textColor:'#3366ff'
            }
          },
        ],
        [
          {
            content: '',
            styles: {
              halign: 'left',
            }
          },
          {
            content: dueDate+': '+this.dateService.formatDateTime(bill?.issueDate),
            styles: {
              halign: 'right',
            }
          },
        ],
      ],
      theme:"plain"
    }
    );

    autoTable(doc, {
      body: [
        [
          {
            content: productsAndServices,
            styles: {
              halign: 'left',
              fontSize:14
            }
          },
        ],
      ],
      theme:"plain"
    }
    );

    if (bill !=null && bill.billLineItems?.length > 0){
      let head: string[] = [];
      head.push(itemsLabel);
      head.push(category);
      head.push(quantity);
      head.push(price);
      head.push(tax);
      head.push(discount);
      head.push(totalPrice);

      let items: string[][] = [];
      bill.billLineItems.forEach(x => {
        let item: string[] = [];
        if (x.product != null){
          item.push(x.product.name+"\n"+x.description);
        }else if (x.service != null){
          item.push(x.service.name+"\n"+x.description);
        }
        item.push(x.category);
        item.push(x.quantity.toString());
        if (x.product != null){
          item.push(bill.currency?.symbol+x.product.salePrice);
          item.push(x.product?.tax?.name+" ("+x.product?.tax?.rate+"%)");
        }else if (x.service != null){
          item.push(bill.currency?.symbol+x.service.salePrice);
          item.push(x.service?.tax?.name+" ("+x.service?.tax?.rate+"%)");
        }
        item.push(x.discount+"%");
        item.push(bill.currency?.symbol+x.totalPrice);
        items.push(item);
      });

      autoTable(doc, {
        head: [head],
        body: items,
        theme:"striped",
        headStyles:{
          fillColor:"#343a40"
        }
      }
      );
    }

    autoTable(doc, {
      body: [
        [
          {
            content: '',
          },
          {
            content: '',
          },
          {
            content: subTotal+':',
            styles: {
              halign: 'right',
            }
          },
          {
            content: bill?.currency?.symbol+bill?.subTotalPrice,
            styles: {
              halign: 'right',
            }
          },
        ],
        [
          {
            content: '',
          },
          {
            content: '',
          },
          {
            content: discount+':',
            styles: {
              halign: 'right',
            }
          },
          {
            content: bill?.currency?.symbol+bill?.totalDiscount,
            styles: {
              halign: 'right',
            }
          },
        ],
        [
          {
            content: '',
          },
          {
            content: '',
          },
          {
            content: tax+':',
            styles: {
              halign: 'right',
            }
          },
          {
            content: bill?.currency?.symbol+bill?.totalTax,
            styles: {
              halign: 'right',
            }
          },
        ],
        [
          {
            content: '',
          },
          {
            content: '',
          },
          {
            content: creditNote+':',
            styles: {
              halign: 'right',
            }
          },
          {
            content: bill?.currency?.symbol+bill?.totalDebitNote,
            styles: {
              halign: 'right',
            }
          },
        ],
        [
          {
            content: '',
          },
          {
            content: '',
          },
          {
            content: totalPrice+':',
            styles: {
              halign: 'right',
            }
          },
          {
            content: bill?.currency?.symbol+bill?.totalAmount,
            styles: {
              halign: 'right',
            }
          },
        ],
      ],
      theme:"plain"
    }
    );

    if (bill?.description){
      autoTable(doc, {
        body: [
          [
            {
              content: termsAndNotes,
              styles: {
                halign: 'left',
                fontSize:14
              }
            },
            {
              content: '',
              styles: {
                halign: 'right',
              }
            },
          ],
          [
            {
              content: bill?.description,
              styles: {
                halign: 'left',
              }
            },
          ],
        ],
        theme:"plain"
      }
      );
    }

    // autoTable(doc, {
    //   body: [
    //     [
    //       {
    //         content: invoiceCustomization?.billFooter,
    //         styles: {
    //           halign: 'center',
    //         }
    //       },
    //     ],
    //   ],
    //   theme:"plain"
    // }
    // );
    //print

    if (output === "print"){
      doc.autoPrint();
      return doc.output('dataurlnewwindow');
    }else if (output === "save") {
      return doc.save(bill.reference);
    }else if ("embed") {
      return doc.output('datauristring');
    }

  }

}
