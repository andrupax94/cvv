import { Component } from '@angular/core';
import { CargaService } from 'src/modRep/factory/carga.service';
import { MensajesService } from 'src/modRep/factory/mensajes.service';
import { ModalesService } from 'src/modRep/factory/modales.service';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.css']
})
export class MainComponent {
    constructor(
        private carga: CargaService,
        private modales: ModalesService,
        private mensajes: MensajesService
    ) { }
    ngOnInit() {
        this.carga.pause();
        // this.mensajes.add('ok', 'esta ok');
    }
}
