import { Component, OnInit, Input } from '@angular/core';
import { ComerciosService, Comercio } from '../../servicios/comercios.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as $ from 'jquery';
import { ComentariosService, Comentario } from '../../servicios/comentarios.service';
import {URL_BACKEND} from '../../config/config'
import firebase from '@firebase/app';
import '@firebase/firestore';
import '@firebase/auth';
import '@firebase/storage';                                                                                                                  

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent implements OnInit {
  comercios: Comercio[] = [];
  comercio : Comercio;
  comentarios: {};
  indice : number =6;
  indiceMax: number =  0;
  mostrar : boolean =true;
  url_backend: string = URL_BACKEND;

  constructor(private comerciosService: ComerciosService, 
              private router: Router, 
              private activatedRoute: ActivatedRoute,
              private comentariosService : ComentariosService,

              ) { }

  ngOnInit() {
    this.cargarComercio();
    this.comerciosService.getComercios().subscribe(

      comercios => {
        this.comercios = comercios.reverse();
        this.indiceMax= this.comercios.length;
}
     );
  
            var storage = firebase.storage();
            var pathReference = storage.ref("images/a.jpg");

            // Create a reference from a Google Cloud Storage URI
            var gsReference = storage.refFromURL(
              "gs://pharmacyapp-b56e1.appspot.com/images/a.jpg"
            );

            // Create a reference from an HTTPS URL
            // Note that in the URL, characters are URL escaped!
            var httpsReference = storage.refFromURL(
              "https://firebasestorage.googleapis.com/b/bucket/o/images%20a.jpg"
            );

            httpsReference
              .child("images/stars.jpg")
              .getDownloadURL()
              .then(function(url) {
                // `url` is the download URL for 'images/a.jpg'

                // This can be downloaded directly:
                var xhr = new XMLHttpRequest();
                xhr.responseType = "blob";
                xhr.onload = function(event) {
                  var blob = xhr.response;
                };
                xhr.open("GET", url);
                xhr.send();

                // Or inserted into an <img> element:
                var img = document.getElementById("myimg");
                img.src = url;
              })
              .catch(function(error) {
                // Handle any errors
              });















}
  cargarComercio():void{//llama a ComerciosService para cargar todos los comercios en pantalla
    this.activatedRoute.params.subscribe(params =>{
    let id = params['id']
    if (id){
      this.comerciosService.getComercio(id).subscribe((comercio => this.comercio = comercio));
    }
    })
  }

addLike(id: number): void {
  this.comerciosService.addLike(id).subscribe( json => {
    for (let comercio of this.comercios){
      if(comercio.id==id){
        comercio.likes=json.likes;
        break;
      }
    }
})
}

  corazones() {//función que crea una animación para que cada vez que se haga click, el corazón cambie de color
    $('a').on('mouseover', function () {

      $('.fa-heart').on('click', function () {
        $(this).addClass("ver");

      });
    });
    $('.fa-heart').delay(500).removeClass("ver");  //quita la clase añadida retrasando su ejecución 500 milisegundos
  }

  sombreado() {//función mediante la cual los sombreados de las cajas de los comercios cambian al ponerse encima
    $(document).ready(function () {
      $(".sombras").hover(function () {
        $(this).css({
          "box-shadow": "10px 10px 50px #666",
          "transition": "box-shadow 0.7s ease-in-out"
        });
      }, function () {
        $(this).css("box-shadow", "none");
      });
    });
  }

  masEntradas(){
    if(this.indice<this.indiceMax){
    this.indice = this.indice+2;
  }
}

  menosEntradas() {
    if(this.indice>5){
      this.indice = this.indice - 2;
    }
      else{
      this.indice = this.indice ;
      }
    }

   

}


