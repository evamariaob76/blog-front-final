import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ComentariosService, Comentario } from '../../servicios/comentarios.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { ComerciosService, Comercio } from '../../servicios/comercios.service';
import { NgForm } from '@angular/forms';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { CompartirInformacionService } from '../../servicios/compartir-informacion.service';
import { AutenticacionService } from '../../servicios/autenticacion.service';

@Component({
  selector: 'app-comentarios',
  templateUrl: './comentarios.component.html',
  styleUrls: ['./comentarios.component.css']
})
export class ComentariosComponent implements OnInit {
  comentario: Comentario = new Comentario();
  comentarios: any = {};
  fechaHoy: Date = new Date();
  comercio: Comercio = new Comercio;
  comprobar: boolean = false;
  noExistenComentarios: boolean = true;
  idComentario: any;
  id: any = 0;
  contestacion: any;
  ver: boolean = false;
  coment: any;
  myClass: boolean = false;
  numeroComentarios: any;
  ocultar = false;

  constructor(private comentariosService: ComentariosService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private comerciosService: ComerciosService,
              public authService: AutenticacionService,
              private compartirInformacionService: CompartirInformacionService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {//me suscribo al serovicio de comentario
      let id = params['id'];
      this.comentario.id_comercio = id;
      this.comentario.fecha = this.fechaHoy;
      this.cargarComercio();//llamo a la función
    })
    this.cargarNumerosComentario();//lamada a la función

  }

  create(comentarioForm: NgForm): void {//creo un nuevo comentario llamando al servicio comentarios
    this.activatedRoute.params.subscribe(params => {
      let id = params['id'];
      this.comentariosService.create(this.comentario).subscribe
        (json => {
          this.cargarComercio();//actualizo los comentarios al crear uno nuevo
          this.cargarNumerosComentario();//actualizo el numerod e comentarios al crear uno nuevo
          comentarioForm.reset({//reseto lo valores del formulario para la validación
            value: undefined
        })
        }), swal.fire('Se ha guardado el comentario: ', 'success');
    })
  }

  cargarComercio(): void {
    this.activatedRoute.params.subscribe(params => {
      let id = params['id']
      if (id) {
        this.comerciosService.getComercio(id).pipe(
          tap(response => {
            let comercios = response as Comercio;
            comercios.comentarios.forEach(comercio => {//array para recorrer todos los comercios
              this.noExistenComentarios = false;
            });
            if (comercios.comentarios.length <= 4) {
              this.myClass = true;
            }
            else{
              this.myClass = false;
            }
          })
        ).subscribe((comercio => this.comercio = comercio))
      }
    })
  }

  contestar() {
    document.getElementById("comment").style.paddingLeft = '500px';
  }

  update(contestacionForm: NgForm, x): void {
    this.activatedRoute.params.subscribe(params => {//recojo de la url el número de comercio
      let id = params['id']

      if (x) {//si existe id, de esta forma gestiono errores   
        this.contestacion = (<HTMLInputElement>document.getElementById("contestacion"));

        this.comentario.id_comercio = id;
        this.comentario.id = x;
        this.comentario.contestacion = this.coment;
        this.comentariosService.update(this.comentario).subscribe(//me suscribo al servicio
          comentario => {
            this.ocultar=false;
            this.cargarComercio()
            contestacionForm.reset({//reseto lo valores del formulario para la validación
              value: undefined
            })
          })
      }
    })
  }

  eliminarContestacion(x): void {
    this.activatedRoute.params.subscribe(params => {//recojo de la url el número de comercio
      let id = params['id']
      if (x) {//si existe id, de esta forma gestiono errores   
        swal.fire({
          title: '¿Está seguro de que quiere eliminar esta comentario?',
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si!'
        }).then((result) => {
          if (result.value) {
            this.comentario.id_comercio = id;
            this.comentario.id = x;
            this.comentario.contestacion = null;
            this.comentariosService.update(this.comentario).subscribe(//me suscribo al servicio
              comentario => {
                this.cargarComercio()
              }), swal.fire('Se ha eliminado el comentario: ', 'success');
          }
        })
      }
    })
  }

  eliminar(id): void {
    swal.fire({
      title: '¿Está seguro de que quiere eliminar esta comentario?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si!'
    }).then((result) => {
      if (result.value) {
        this.comentariosService.delete(id).subscribe
          (json => {
            this.noExistenComentarios = true;
            this.cargarNumerosComentario();//lamada a la función
            this.cargarComercio();
          })

      }
    })
  }

  mostrar() {
    switch (this.comprobar) {
      case true:
        this.comprobar = false;
        break;
      case false:
        this.comprobar = true;
        break;
    }
  }

  cambiar(id) {

    document.getElementById('contestacion' + id).style.marginLeft = '150px';
    if (document.getElementById('contestacion' + id).style.display = 'none') {
      document.getElementById('contestacion' + id).style.display = 'inline';
    }
    else {
    document.getElementById('contestacion' + id).style.display = 'none'
    }
    if 
    (document.getElementById('contestar' + id).style.display = 'inline') {
      document.getElementById('contestar' + id).style.display = 'none';
    }
    else {
      document.getElementById('contestacion' + id).style.display = 'none';
    }
  }

  cambiarAdmin(id) {

    document.getElementById("contestacionAmin" + id).style.marginLeft = '150px';

    document.getElementById("contestacionAmin" + id).style.display = 'inline';
    this.ocultar=true;

  }


  cancelar(contestacionForm,id) {

    document.getElementById("contestacion"+id).style.display = 'none';
    this.ocultar=false;
    this.cargarComercio()
    contestacionForm.reset({//reseto lo valores del formulario para la validación
      value: undefined
    })
  }
 
  cargarNumerosComentario() {//función que llama al servicio CompartirInformacionService 
    this.activatedRoute.params.subscribe(params => {
      let id = params['id']
      if (id) {
        this.compartirInformacionService.getNumeroComentario(id).subscribe((comentariolength => {
          this.numeroComentarios = comentariolength;
          this.compartirInformacionService.setData(this.numeroComentarios);
        }
        ));

      }
    });
  }


}
