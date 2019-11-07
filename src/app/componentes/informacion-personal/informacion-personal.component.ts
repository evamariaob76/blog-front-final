import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../servicios/usuarios.service';
import {  ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-informacion-personal',
  templateUrl: './informacion-personal.component.html',
  styleUrls: ['./informacion-personal.component.css']
})
export class InformacionPersonalComponent implements OnInit {
  usuario: any = {};

  constructor(private usuariosService: UsuariosService,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.cargarUsuario();
  }
  
  cargarUsuario() {//carga el usuario 
    this.activatedRoute.params.subscribe(params => {
      this.usuariosService.getUsuario(2).subscribe((usuario => this.usuario = usuario))

    })
  }

}
