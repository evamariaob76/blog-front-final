import { Component, OnInit } from '@angular/core';
import { ComerciosService, Comercio } from '../../servicios/comercios.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
@Component({
  selector: 'app-subir-fotos',
  templateUrl: './subir-fotos.component.html',
  styleUrls: ['./subir-fotos.component.css']
})
export class SubirFotosComponent implements OnInit {
  comercio : any={};

  constructor(private comerciosService : ComerciosService,
    private router : Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params =>{
      let id = params['id']
      if (id){
        this.comerciosService.getComercio(id).subscribe(comercio =>{
             this.comercio = comercio;     
        })
      }
    })
  }

}
