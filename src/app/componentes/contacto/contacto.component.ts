import { Component, OnInit } from '@angular/core';
import { EmailService, Email } from '../../servicios/email.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent implements OnInit {
apellido : string;
email : string;
texto: string;
nombre : string;
Email : Email= new Email;
enviado:boolean = false;
  constructor( private emailService : EmailService) { }

  ngOnInit() {
  }
  enviarmail(mensajeForm: NgForm) {
    this.emailService.sendEmailAdmin(this.Email.nombre, this.Email.apellido,this.Email.email, this.Email.texto).subscribe(
      json => {
      });
    mensajeForm.reset({//reseto lo valores del formulario para la validación
          value: undefined
        });
    this.Email = new Email();
    this.enviado=true;
  }


}
