import { Component, OnInit, ɵConsole } from '@angular/core';
import { AutenticacionService } from '../../servicios/autenticacion.service';
import { ComerciosService, Comercio} from '../../servicios/comercios.service';
import { Router, ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label } from 'ng2-charts';
import swal from 'sweetalert2';

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.css"]
})
export class AdminComponent implements OnInit {
  comercios: Comercio[] = [];
  comercio: Comercio;
  totalLikes: number = 0;
  i: number = 0;
  totaldef: any[] = [];
  comerciosLikes: Comercio[] = [];
  private fragment: string;
  terminaBucle: boolean=false;
  numero:number=0;

  constructor(
    public authService: AutenticacionService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private comerciosService: ComerciosService
  ) {}

  ngOnInit() {
  
    window.scrollTo(0, 0); 

    if (this.authService.isAuthenticated) {
      this.comerciosService
        .getComercios()
        .pipe(
          tap(response => {
            let comercios = response as Comercio[];
            let variable = response.length;
            response.reverse(); // Los comercios insertados más recientes aparecerán en primer lugar
            for (this.i = 0; this.i < variable; this.i++) {
              this.totalLikes += comercios[this.i].likes;
              if (this.i+1==variable) {
                this.terminaBucle = true;
                this.cargarGraficas();
              }}
          })
        )
        .subscribe(comercios => (this.comercios = comercios));

    }
    this.getMaxLikes();
    this.getMaxVisitas();
  }

  cargarGraficas(){
    this.activatedRoute.fragment.subscribe(fragment => {
      this.fragment = fragment;
      if (fragment) {
        window.scrollTo(0, 240); // how far to scroll on each step
      }
    });
    if (this.authService.isAuthenticated) {
      this.comerciosService
        .getComercios()
        .pipe(
          tap(response => {
            let comercios = response as Comercio[];
            let variable = response.length;
            response.reverse(); // Los comercios insertados más recientes aparecerán en primer lugar
            for (this.i = 0; this.i < variable; this.i++) {
              this.barChartLabels.push(comercios[this.i].nombre); //añado cada uno de los nombres de los comercios a la data de la gráfica barra
              this.barChartData[0].data.push(response[this.i].likes); //añado los likes de los comercios a la  data de la gráfica barra
              this.barChartData[1].data.push(
                response[this.i].comentarios.length
              ); //añado cada uno de los comentarios (longitud total)  a la data de la gráfica barra
              this.barChartData[2].data.push(response[this.i].visitas); //añado cada uno de las visitas de los comercios a la  data de la gráfica barra
             

              if (this.i == 10 || this.i <= variable ) {
                if (response[this.i].likes>0){
                this.pieChartLabels.push(response[this.i].nombre); //añado cada uno de los nombres de los comercios a la gráfica pastel
                  this.numero =  this.pieChartLabels.length;
                }
                this.pieChartData.push(response[this.i].likes); //añado los likes de los comercios a la data de gráfica pastel para utilizarlo en una función
                this.pieChartData[this.i] =
                  Math.round(
                    ((this.pieChartData[this.i] * 100) / this.totalLikes) * 10
                  ) / 10;
                this.updatebarChartOptions(this.i+1);
                this.updatepieChartOptions(this.numero);
              }
            }
          })
        )
        .subscribe(comercios => (this.comercios = comercios));
  
    }
  }
  cargarComercio(): void {
    if (this.authService.isAuthenticated) {

    //llama a ComerciosService para cargar todos los comercios en pantalla
    this.activatedRoute.params.subscribe(params => {
      let id = params["id"];
      if (id) {
        this.comerciosService
          .getComercio(id)
          .subscribe(comercio => (this.comercio = comercio));
      }
    });
  }
  }

  getMaxLikes(): void {
    if (this.authService.isAuthenticated) {

    this.comerciosService
      .getMaxLikes()
      .pipe(
        tap(response => {
          let comercios = response as Comercio[];
          for (let i = 1; i < response.length; i++) {
            this.barChartLabels2.push(response[i].nombre);
            this.barChartData2[0].data.push(response[i].likes);
          }
        })
      )
      .subscribe(comercios => (this.comercios = comercios));
    }
  }

  getMaxVisitas(): void {
    this.comerciosService
      .getMaxVisitas()
      .pipe(
        tap(response => {
          let comercios = response as Comercio[];
          for (let i = 1; i < response.length; i++) {
            this.barChartLabels3.push(response[i].nombre);
            this.barChartData3[0].data.push(response[i].visitas); //añado los likes de los comercios a la  data de la gráfica barra
          }
        })
      )
      .subscribe(comercios => (this.comercios = comercios));
  }

  cerrarSesion(): void {
    //cierra sesión del admin
    swal.fire("Has cerrado correctamente la sesión ", "", "success");
    this.authService.logout();
    this.router.navigate(["/home"]);
  }

  //PORCENTAJE DE LIKES. PASTEL

  // Trozos del pastel - Etiquetas. Se inicializan vacías, en la llamada al servicio se agregan
  public pieChartLabels: Label[] = [];

  // Trozos del pastel - Cantidades. Se inicializan vacías, en la llamada al servicio se agregan
  public pieChartData: number[] = [];

  // Trozos del pastel - Colores. Se inicializan vacías, en la llamada al servicio se  determina el número de comercios
  //y mediante las funciones getRandomColor() (para mostrar un color aletorio) y getUnir() (para unir los colores en un array) se agregan

  public pieChartColors = [
    {
      backgroundColor: [
        "#D63857  ",
        "#4DABF1 ",
        "#9F9FCE ",
        "#E971DE   ",
        "#D07F8D ",
        "#EEB487 ",
        "#008080",
        "##E7D4E5  ",
        "#690C4A ",
        "#64B546"
      ]
    }
  ];
  // Opciones de la gráfica
  public pieChartOptions: ChartOptions = {
    title: {},
    legend: {},
    plugins: {
      datalabels: {}
    }
  };
  updatepieChartOptions(number) {
    this.pieChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      title: {
        text: "Porcentaje de likes de los " + number + " comercios con mas likes",
        fontSize: 20,
        fontColor: "black",
        display: true
      },
      legend: {
        position: "top"
      },
      plugins: {
        datalabels: {
          formatter: (value, ctx) => {
            const label = "";
            return label;
          },
          color: "#fff"
        }
      }
    };
  }

  //INTERACCIÓN DE LOS NAVEGANTES CON EL CONTENIDO. BARRAS

  public pieChartType: ChartType = "pie";
  public pieChartLegend = true;
  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: {},
    title: {},
    plugins: {},
    legend: {},
    layout: {}
  };
  public barChartLabels: Label[] = []; //inicilizo a 0 para cargar los datos en el servicio
  public barChartType: ChartType = "bar";
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];
  public barChartData: ChartDataSets[] = [
    //datos en leyenda
    { data: [], label: "Número de likes" },
    { data: [], label: "Número de comentarios" },
    { data: [], label: "Número de visitas" }
  ];
  updatebarChartOptions(number) {
    this.barChartOptions = {
      responsive: true,
      scales: { xAxes: [{}], yAxes: [{}] },
      title: {
        text:
          "Interacción de los navegantes con los últimos  " +
          number +
          "  comercios",
        fontSize: 20,
        fontColor: "black",
        display: true
      },
      plugins: {
        datalabels: {
          align: "end"
        }
      },
      legend: {
        labels: {
          boxWidth: 40
        }
      },
      layout: {
        padding: {
          left: 50,
          right: 0,
          top: 10,
          bottom: 10
        }
      }
    };
  }
  //INTERACCIÓN DE LOS NAVEGANTES CON EL CONTENIDO. BARRAS LIKES

  public pieChartType2: ChartType = "pie";
  public pieChartLegend2 = true;
  public barChartOptions2: ChartOptions = {
    responsive: true,
    scales: {
      xAxes: [
        {
          barPercentage: 0.5
        }
      ],
      yAxes: [{}]
    },
    title: {
      text: "Los comercios con mas likes ",
      fontSize: 20,
      fontColor: "black",
      display: true
    },
    plugins: {
      datalabels: {
        align: "end"
      }
    },
    legend: {
      labels: {
        boxWidth: 40
      }
    },
    layout: {
      padding: {
        left: 10,
        right: 0,
        top: 10,
        bottom: 10
      }
    }
  };
  public barChartLabels2: Label[] = []; //inicilizo a 0 para cargar los datos en el servicio
  public barChartType2: ChartType = "bar";
  public barChartLegend2 = true;
  public barChartPlugins2 = [pluginDataLabels];
  public barChartData2: ChartDataSets[] = [
    //datos en leyenda
    {
      data: [],
      label: "Número de likes",
      backgroundColor: "#A7ABDF",
      borderColor: "#6168B8"
    }
  ];

  //INTERACCIÓN DE LOS NAVEGANTES CON EL CONTENIDO. BARRAS VISITAS

  public pieChartType3: ChartType = "pie";
  public pieChartLegend3 = true;
  public barChartOptions3: ChartOptions = {
    responsive: true,
    scales: {
      xAxes: [
        {
          barPercentage: 0.5
        }
      ],
      yAxes: [{}]
    },
    title: {
      text: "Los comercios con mas visitas",
      fontSize: 20,
      fontColor: "black",
      display: true
    },
    plugins: {
      datalabels: {
        align: "end"
      }
    },
    legend: {
      labels: {
        boxWidth: 40
      }
    },
    layout: {
      padding: {
        left: 50,
        right: 0,
        top: 10,
        bottom: 10
      }
    }
  };

  public barChartLabels3: Label[] = []; //inicilizo a 0 para cargar los datos en el servicio
  public barChartType3: ChartType = "bar";
  public barChartLegend3 = true;
  public barChartPlugins3 = [pluginDataLabels];
  public barChartData3: ChartDataSets[] = [
    //datos en leyenda
    { data: [], label: "Número de visitas" }
  ];
}