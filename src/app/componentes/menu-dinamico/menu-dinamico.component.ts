import { Component, OnInit } from '@angular/core';
import { ComerciosService, Comercio } from '../../servicios/comercios.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CompartirInformacionService } from '../../servicios/compartir-informacion.service';
import { tap } from 'rxjs/operators';
import { URL_BACKEND } from "../../config/config";


@Component({
  selector: 'app-menu-dinamico',
  templateUrl: './menu-dinamico.component.html',
  styleUrls: ['./menu-dinamico.component.css']
})
export class MenuDinamicoComponent implements OnInit {

  comercios: any[] = [];
  comercio: []=[];
  mes: any;
  termino: any;
  comerciosMeses: any[]=[];
  me:any []=[];
  m: any[]=[];
  cero: number;
  sortedActivities:any[]=[];
  url_backend: string = URL_BACKEND;

  constructor(private activatedRoute: ActivatedRoute,
    private comerciosService: ComerciosService,
    private compartirInformacionService: CompartirInformacionService,
    private router: Router) {
  }

  ngOnInit() {
    this.comerciosService.findOneComercioByDate().subscribe(me => {
      this.me = me.reverse()})
    this.compartirInformacionService.getMeses().subscribe(mes => {
      this.mes = mes;
    this.mes.reverse();})
}
   verFecha(mes: number) {
      this.comerciosService.getComercioFecha(mes).subscribe(params => {
        this.router.navigate(['/mes',mes]);
      })
  }
}