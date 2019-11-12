import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComerciosService, Comercio } from '../../servicios/comercios.service';
import { URL_BACKEND } from "../../config/config";



@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.component.html',
  styleUrls: ['./buscador.component.css']
})
export class BuscadorComponent implements OnInit {
  comercio: Comercio;
   comercios : Comercio[]=[];
   termino : string;

  constructor(private activatedRoute: ActivatedRoute,
              private comerciosService : ComerciosService
    ){}
  
  ngOnInit() {
    this.activatedRoute.params.subscribe(params =>{
      this.termino = params['nombre']
      let nombre = params['nombre'];
      this.comerciosService.findByName(nombre).subscribe((comercios => this.comercios = comercios))
      })
  }

}
