import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import jspdf from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-ministatement',
  templateUrl: './ministatement.component.html',
  styleUrls: ['./ministatement.component.css']
})
export class MinistatementComponent implements OnInit {

  allTransactions:any
  searchKey: string=''

  constructor(private api:ApiService){

  }

  ngOnInit(): void {
    this.api.getAllTransactions()
    .subscribe((result:any)=>{
      this.allTransactions = result.transaction
      console.log(this.allTransactions);
      
    })
  }

  // search
  search(event:any){
    this.searchKey=event.target.value
  }

  // generatePDF
  generatePDF(){
    var pdf = new jspdf();
    let col = ['Type','FromAcno','ToAcno','Amount']
    let row:any = []
    pdf.setFontSize(16);
    pdf.text('Transaction History', 11, 8);
    pdf.setFontSize(12);
    pdf.setTextColor(99);

    // convert allTransactions to nested array
    var itemNew = this.allTransactions
    for(let element of itemNew){
      var temp = [element.type,element.fromAcno,element.toAcno,element.amount];
      row.push(temp)
    }

   
    
    (pdf as any).autoTable(col,row,{startY:10})
    // open pdf in browser new tab
    pdf.output('dataurlnewwindow');
    // download pdf file
    pdf.save('ministatement.pdf');
  }

}
