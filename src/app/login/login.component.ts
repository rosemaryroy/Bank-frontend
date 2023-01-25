import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  errorMsg:string=''
  successMsg:boolean=false

  // login group
  loginForm = this.fb.group({
    // array
    acno:['',[Validators.required,Validators.pattern('[0-9]*')]],
    pswd:['',[Validators.required,Validators.pattern('[0-9a-zA-Z]*')]]
  })

  constructor(private fb:FormBuilder,private api:ApiService,private router:Router){

  }

  login(){
    if(this.loginForm.valid){
      let acno = this.loginForm.value.acno
      let pswd = this.loginForm.value.pswd  
      // login call
      this.api.login(acno,pswd)
      .subscribe(
        // success
        (result:any)=>{
          this.successMsg=true
          // store username in local storage
          localStorage.setItem("username",result.username)
          // store current acno
          localStorage.setItem("currentAcno",JSON.stringify(result.currentAcno))
           // store token
           localStorage.setItem("token",result.token)
        // alert(result.message)
        setTimeout(()=>{
           // navigate dashboard
        this.router.navigateByUrl('dashboard')
        },2000)
       
      },
      // client
      (result:any)=>{
         this.errorMsg = result.error.message
         setTimeout(() => {
          this.errorMsg=""
          this.loginForm.reset()
         }, 3000);
      }
      )
    }
    else{
      alert('Invalid Login')
    }

      
  }

}
