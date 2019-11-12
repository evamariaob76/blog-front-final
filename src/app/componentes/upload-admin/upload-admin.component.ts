import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../servicios/usuarios.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { URL_BACKEND } from "../../config/config";


@Component({
  selector: 'app-upload-admin',
  templateUrl: './upload-admin.component.html',
  styleUrls: ['./upload-admin.component.css']
})
export class UploadAdminComponent implements OnInit {
  archivo: File;
  id : number=2;
  usuario: any = {};
  estadoPositivo1: boolean = false;
  estadoPositivo2: boolean = false;
  visibleFoto: boolean = false;
  htmlStr: string = "*foto personal sin actualizar"
  htmlStr1: string = "*foto de portada sin actualizar"
  estadoPositivo: boolean = false;
  url_backend: string = URL_BACKEND;

  constructor(private usuariosService: UsuariosService,
    private activatedRoute: ActivatedRoute,
    private router: Router,

  ) { }

  ngOnInit() {
    this.cargarUsuario();
  }
  
  seleccionarFoto(event) {//función que recoge la  información de img
    this.archivo = event.target.files[0];
    this.estadoPositivo1 = true;//variable que hace cambiar el color al subir una imagen en la img1
    this.htmlStr = this.archivo.name;
    this.uploadFotos(this.id);

  }
  seleccionarFotoPortada(event) {//función que recoge la  información de img
    this.archivo = event.target.files[0];
    this.estadoPositivo2 = true;//variable que hace cambiar el color al subir una imagen en la img1
    this.htmlStr1 = this.archivo.name;
    this.uploadFotoPortada(this.id);

  }
  cargarUsuario() {//carga el usuario a editar
    this.activatedRoute.params.subscribe(params => {//subscribiéndome a los parámetros tenemos la id de comercio
      this.usuariosService.getUsuario(this.id).subscribe((usuario => {

        this.usuario = usuario
      }))

    })
  }

  updateUsuario(): void {
    this.usuariosService.updateUsuario(this.usuario)
      .subscribe(json => {
        swal.fire('Usuario Actualizado', `${json.mensaje} : ${json.usuario.nombre}`, 'success');
        this.router.navigate(['/home']);
      })
  }

  uploadFotos(id) {//función para actualizar la foto de admin
    if (this.seleccionarFoto) {
      this.usuariosService.subirFoto(this.archivo, id)
        .subscribe(usuario => {
          this.usuario = usuario;
          this.cargarUsuario();//llamo a la función para que se actualice la foto mostrada una vez creada
        })
    }
  }


  uploadFotoPortada(id) {//función para actualizar la foto de portada
    if (this.seleccionarFotoPortada) {
      this.usuariosService.subirFotoPortada(this.archivo, id)
        .subscribe(usuario => {
          this.usuario = usuario;

          this.cargarUsuario();//llamo a la función para que se actualice la foto mostrada una vez creada
        })
    }
  }

}
