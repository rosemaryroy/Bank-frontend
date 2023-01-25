import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import party from "party-js";
import { Router } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{

  user:string=''
  currentAcno:Number=0
  balance:Number=0
  depositeMsg:string=''
  fundTransferSuccessMsg:string=''
  fundTransferErrorMsg:string=''
  logoutDiv: boolean=false
  acno:string='';
  deleteConfirm:boolean=false
  deleteSpinnerDiv:boolean=false

  fundTransferForm = this.fb.group({
    toAcno:['',[Validators.required,Validators.pattern('[0-9]*')]],
    pswd:['',[Validators.required,Validators.pattern('[0-9a-zA-Z]*')]],
    amount:['',[Validators.required,Validators.pattern('[0-9]*')]]
  })

  depositeForm = this.fb.group({
    amount:['',[Validators.required,Validators.pattern('[0-9]*')]]
  })
  

  constructor(private fb:FormBuilder, private api:ApiService,private router:Router){

  }

  ngOnInit(): void {
    if(!localStorage.getItem("token")){
      alert("Please login")
      // navigate
      this.router.navigateByUrl('')
    }


    if(localStorage.getItem("username")){
    this.user = localStorage.getItem("username") || ''
    }
    if(localStorage.getItem("currentAcno")){
      this.currentAcno = JSON.parse(localStorage.getItem("currentAcno") || '') 
      console.log(this.currentAcno);
      
    }
  }
  

  getBalance(){
      if(localStorage.getItem("currentAcno")){
        this.currentAcno = JSON.parse(localStorage.getItem("currentAcno") || '') 
        console.log(this.currentAcno);
        this.api.getBalance(this.currentAcno)
        .subscribe(
          (result:any)=>{
            console.log(result);
            this.balance=result.balance
          }
        )
      }
  }
  // deposite
  deposite(){
    if(this.depositeForm.valid){
      let amount = this.depositeForm.value.amount
      this.currentAcno = JSON.parse(localStorage.getItem("currentAcno") || '')
      this.api.deposite(this.currentAcno,amount)
      .subscribe(
        // success
        (result:any)=>{
          console.log(result);
          this.depositeMsg=result.message
          setTimeout(()=>{
            this.depositeForm.reset()
            this.depositeMsg=''
          },5000)
        },
        (result:any)=>{
          this.depositeMsg = result.error.message
          
        }
      )
    }
    else{
      alert('Invalid form')
    }
  }

  transfer(){
    if(this.fundTransferForm.valid){
      let toAcno = this.fundTransferForm.value.toAcno
      let pswd = this.fundTransferForm.value.pswd
      let amount = this.fundTransferForm.value.amount
// make api call for fund transfer
      this.api.fundTransfer(toAcno,pswd,amount)
      .subscribe(
        // success
        (result:any)=>{
          this.fundTransferSuccessMsg = result.message
          setTimeout(()=>{this.fundTransferSuccessMsg=''},3000)
        },
        // clienterror
        (result:any)=>{
          this.fundTransferErrorMsg = result.error.message
          setTimeout(()=>{this.fundTransferErrorMsg=''},3000)
        }
      )

    }
    else{
      alert('invalid form')
    }

  }
  


// showconfetti
  showconfetti(source: any){
    party.confetti(source);
  }



  // clearTransferForm

  clearTransferForm(){
    this.fundTransferErrorMsg=""
    this.fundTransferSuccessMsg=""
    this.fundTransferForm.reset()
  }

  // logout
  logout(){
    localStorage.removeItem("token")
    localStorage.removeItem("currentAcno")
    localStorage.removeItem("username")
    this.logoutDiv = true
    setTimeout(() => {

      // navigate to login
    this.router.navigateByUrl('')
     this.logoutDiv=false
    }, 4000);
  }

  // delete Account from navbar
  deleteAccountFromNavBar(){
    this.acno = localStorage.getItem("currentAcno")
    this.deleteConfirm=true
  }

  onCancel(){
    this.acno=""
    this.deleteConfirm=false
  }

  onDelete(event:any){
    let deleteAcno = JSON.parse(event)
    this.api.deleteAccount(deleteAcno)
    .subscribe(
    (result:any)=>{
      this.acno=""
      localStorage.removeItem("token")
      localStorage.removeItem("currentAcno")
      localStorage.removeItem("username")
      this.deleteSpinnerDiv=true
      setTimeout(()=>{
        // navigate to login
      this.router.navigateByUrl('')
      this.deleteSpinnerDiv=false
      },4000);
    
    },
    (result:any)=>{alert(result.error.message)}
    )
  }

}
