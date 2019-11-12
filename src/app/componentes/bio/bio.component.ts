import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../servicios/usuarios.service';
import { ActivatedRoute } from '@angular/router';
import { URL_BACKEND } from "../../config/config";

@Component({
  selector: 'app-bio',
  templateUrl: './bio.component.html',
  styleUrls: ['./bio.component.css']
})
export class BioComponent implements OnInit {
  usuario: any = {};
  url_backend: string = URL_BACKEND;


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
