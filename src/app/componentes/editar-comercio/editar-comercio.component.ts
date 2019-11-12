import { Component, OnInit } from '@angular/core';
import { ComerciosService, Comercio } from '../../servicios/comercios.service';
import { EmailService } from '../../servicios/email.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { URL_BACKEND } from "../../config/config";

@Component({
  selector: 'app-editar-comercio',
  templateUrl: './editar-comercio.component.html',
  styleUrls: ['./editar-comercio.component.css']
})
export class EditarComercioComponent implements OnInit {

  htmlStr: string = ""
  htmlStr1: string = ""
  htmlStr2: string = ""
  estadoPositivo1: boolean = false;
  estadoPositivo2: boolean = false;
  estadoPositivo3: boolean = false;

  comercio: any = {};
  fechaHoy: Date = new Date();
  archivo: File;
  archivo1: File;
  archivo2: File;
  visible: boolean = false;
  updateFoto = false;
  id: any = {};

  constructor(private comerciosService: ComerciosService,
    private router: Router,
    private activatedRoute: ActivatedRoute,

  ) { }

  ngOnInit() {//al cargarse la página se llama a la funcion cargarComercio que mostrará el comercio en el caso de que se vaya a editar
    this.cargarComercio();

  }

  cargarComercio() {//carga el comercio a editar
    this.activatedRoute.params.subscribe(params => {//subscribiéndome a los parámetros tenemos la id de comercio
      let id = params['id']
      if (id) {
        this.comerciosService.getComercio(id).subscribe((comercio => this.comercio = comercio))
      }
    })
  }
  mostrarHTML() {
    this.visible = true;
  }

  seleccionarUnaFoto(event, id_foto) {//función que recoge la  información de img en el caso de actulizar una foto
    this.archivo = event.target.files[0];
    switch (id_foto) {
      case 1:
        this.upload1Foto(1);
        this.htmlStr = this.archivo.name;
        break;
      case 2:
        this.upload1Foto(2);
        this.htmlStr1 = this.archivo.name;
        break;
      case 3:
        this.upload1Foto(3);
        this.htmlStr2 = this.archivo.name;
        break;
    }   
  }
  
  upload1Foto(id_img) {//Función que llama al Servicio y actualiza la foto
    this.activatedRoute.params.subscribe(params => {
      let id = params['id']

      this.comerciosService.subir1Foto(this.archivo, id, id_img)
        .subscribe(json => {

          this.cargarComercio();
          this.updateFoto = true;
        })
    })
  }

  update(): void {//función que llama al servicio correspondiente para actualizar el comercio
    this.comerciosService.update(this.comercio).subscribe
      (json => {   
        this.visible = true;
        swal.fire('Comercio Actualizado', `${json.cliente.nombre}`, 'success');

      })
  }

  cancelar() {//función que redirige al panel de administración si nos e quiere actualizar foto
    this.router.navigate(['/admin'])
  }

  nuevoComercio() {//función que resetea los campos para incluir un nuevo comercio
    this.router.navigate(['/crear/comercios']);
  }
} 
