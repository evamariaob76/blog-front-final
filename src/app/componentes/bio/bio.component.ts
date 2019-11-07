import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../servicios/usuarios.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-bio',
  templateUrl: './bio.component.html',
  styleUrls: ['./bio.component.css']
})
export class BioComponent implements OnInit {
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
