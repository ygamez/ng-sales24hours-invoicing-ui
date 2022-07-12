import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { Receipt } from 'src/app/models/receipt';
import { InvoiceService } from 'src/app/service/invoice.service';

@Component({
  selector: 'app-receipt-sending-dialog',
  templateUrl: './receipt-sending-dialog.component.html',
  styleUrls: ['./receipt-sending-dialog.component.scss']
})
export class ReceiptSendingDialogComponent implements OnInit {
  receipts: Receipt[] = [];

  constructor(private dialogRef: NbDialogRef<ReceiptSendingDialogComponent>, private invoiceService: InvoiceService) { }

  ngOnInit() {
    let invoice =  this.invoiceService.getInvoice();
    invoice.revenues.forEach(x=> this.receipts.push(x.receipt));
  }

  confirm(receipt: Receipt){
    this.dialogRef.close(receipt);
  }

  close() {
    this.dialogRef.close();
  }

}
