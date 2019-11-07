import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ComerciosService } from '../../servicios/comercios.service';
import { AutenticacionService } from '../../servicios/autenticacion.service';
import swal from 'sweetalert2';
import { UsuariosService } from '../../servicios/usuarios.service';
import { DomSanitizer } from '@angular/platform-browser';
import { stringify } from '@angular/compiler/src/util';

 
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  comercio: any = {};
  comercios: any = {};
  usuario: any = {};
  foto: string="";

  constructor(private activatedRoute: ActivatedRoute,
              private comerciosService : ComerciosService,
              private router : Router,
    private _sanitizer: DomSanitizer,
    private usuariosService: UsuariosService,
              public authService: AutenticacionService
              ) { }

  ngOnInit() {

    $(document).ready(function() {
      $(".menu-icon").on("click", function() {
            $("nav ul").toggleClass("showing");
      });
});
    
    // Scrolling Effect
    $(window).on("scroll", function() {
          if($(window).scrollTop()) {
                $('nav').addClass('black');
          }
          else {
                $('nav').removeClass('black');
          }
    })
    this.cargarUsuario();
   }

  Inicio(){
    this.router.navigate(['/home']);
  }
  
  cargarComercio():void{
    this.activatedRoute.params.subscribe(params =>{
    let id = params['id']
    if (id){
          this.comerciosService.getComercio(id).subscribe((comercio => this.comercio = comercio))
        }
      })
    }

    findByName(nombre : string ): void {
      this.comerciosService.findByName(nombre).subscribe( params => {
        this.router.navigate(['/buscar', nombre]);
    })
    }

    verActividad(nombre:string){
      this.comerciosService.findByName(nombre).subscribe( params => {
        this.router.navigate(['/comercios', nombre]);
      })
  }

  cargarUsuario(){
    this.usuariosService.getUsuario(2).subscribe((usuario => {
      if(usuario.fotoPortada){
        this.foto = "http://localhost:8080/api/descargasAdmin/img/"+usuario.fotoPortada;
        }
    }));
  }

}


