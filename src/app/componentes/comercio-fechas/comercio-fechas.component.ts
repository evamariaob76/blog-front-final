import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComerciosService, Comercio } from '../../servicios/comercios.service';
import { tap } from 'rxjs/operators';
import * as moment from 'moment';
import { Pipe, PipeTransform } from '@angular/core';
import { URL_BACKEND } from "../../config/config";

  

@Component({
  selector: 'app-comercio-fechas',
  templateUrl: './comercio-fechas.component.html',
  styleUrls: ['./comercio-fechas.component.css']
})
export class ComercioFechasComponent implements OnInit{
  comercios: Comercio[] = [];
  termino : any;
  
  constructor(private activatedRoute: ActivatedRoute,
              private comerciosService: ComerciosService) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      let mes = params['mes']

      if (mes) {
        this.comerciosService.getComercioFecha(mes).pipe(
          tap(response => {
            this.termino = response[0].createAt;
          })
        ).subscribe((comercios => this.comercios = comercios))
      }
    })
  }
  
}