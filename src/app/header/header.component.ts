import { Component } from '@angular/core';
import { FilterService } from '../filter/filter.service';
import { SessionService } from 'src/modRep/factory/session.service';
import { CargaService } from 'src/modRep/factory/carga.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent {
    public abrirCerrarFiltro;
    public user: any;
    public bgColor = 'grey';
    public currentPath = '';
    public headerSW = false;
    public headerTop = 0;
    public headerH = 65;
    constructor(
        private filtro: FilterService,
        private session: SessionService,
        private carga: CargaService,
        private router: Router,

    ) {
        if (!this.headerSW) {
            this.headerTop = -this.headerH;
        }
        this.user = { state: false, data: [], mensaje: '' };
        this.abrirCerrarFiltro = filtro.abrirCerrarFiltro;
    }
    closeTopMenu(e: MouseEvent) {
        const targetElement = e.currentTarget as HTMLElement;
        const topVar = $(targetElement).parent();
        let top = ($(topVar).css('top') !== undefined) ? parseInt($(topVar).css('top')) : 0;
        if (top < -1) {
            this.headerTop = 0;
        }
        else {

            this.headerTop = -this.headerH;

        }
        this.headerSW = !this.headerSW;
    }
    changePage(e: MouseEvent) {
        const targetElement = e.currentTarget as HTMLElement;
        const pageToChange = targetElement.getAttribute('routerLink') as string;

        if (this.currentRoute() !== pageToChange) {
            this.carga.to('body');
            this.carga.play();
        }

    }
    logOut() {
        this.carga.to('body');
        this.carga.changeInfo(undefined, 'Cerrando Sesion');
        this.carga.play();
        this.session.logOut();
        setTimeout(() => {
            this.router.navigate(['logIn']);
        }, 500);
    }
    currentRoute() {
        const segments = this.router.url.split('/');
        return '/' + segments[segments.length - 1];
    }
    cargaPause() {
        setTimeout(() => {
            this.carga.pause();
        }, 200);
    }
    ngOnInit() {
        this.session.SDuserCookie$.subscribe((data) => {
            if (data !== null) {
                this.user = data;
            }
        });
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.cargaPause();
            }
        });
    }

}
