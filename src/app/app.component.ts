import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SessionService } from '../factory/session.service';
import { CargaService } from 'src/factory/carga.service';
import { NavigationEnd, Router } from '@angular/router';
import { authGuard } from '../guards/auth.guard';
import { filter } from 'rxjs/operators';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent {
    title = 'cvv';
    public currentPath = '';
    public user: any;
    public pageFilter: string = "none";
    constructor(
        private auth: authGuard,
        private session: SessionService,
        private carga: CargaService,
        private router: Router,

    ) {

        this.user = { state: false, data: [], mensaje: '' };
        this.carga.to('body');
        this.currentPath = this.router.url;
        this.carga.play();
    }
    reload() {
        this.auth.reload();
    }

    changePage(e: MouseEvent) {
        const targetElement = e.currentTarget as HTMLElement;
        const pageToChange = targetElement.getAttribute('routerLink') as string;

        if (this.currentRoute() !== pageToChange) {
            this.carga.to('body');
            this.carga.play();
        }
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
    animationStars() {
        const n_stars: number = 150;
        const colors: string[] = ['#176ab6', '#fb9b39'];
        for (let i = 0; i < 98; i++) {
            colors.push('#fff');
        }
        function init(): void {
            for (let i = 0; i < n_stars; i++) {
                stars.push(new Star());
            }
        }
        const canvas: HTMLCanvasElement | null = document.querySelector('canvas');
        canvas!.style.background = '#000';
        const c = canvas!.getContext('2d');
        const randomInt = (max: number, min: number): number => Math.floor(Math.random() * (max - min) + min);
        class Star {
            x: number;
            y: number;
            radius: number;
            color: string;
            dy: number;

            constructor(x?: number, y?: number, radius?: number, color?: string) {
                this.x = x ?? randomInt(0, canvas!.width);
                this.y = y ?? randomInt(0, canvas!.height);
                this.radius = radius ?? Math.random() * 1.1;
                this.color = color ?? colors[randomInt(0, colors.length)];
                this.dy = -Math.random() * 0.3;
            }

            draw(): void {
                c!.beginPath();
                c!.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                c!.shadowBlur = randomInt(3, 15);
                c!.shadowColor = this.color;
                c!.strokeStyle = this.color;
                c!.fillStyle = 'rgba(255, 255, 255, .5)';
                c!.fill();
                c!.stroke();
                c!.closePath();
            }

            update(arrayStars: Star[] = []): void {
                if (this.y - this.radius < 0) this.createNewStar(arrayStars);

                this.y += this.dy;
                this.draw();
            }

            createNewStar(arrayStars: Star[] = []): void {
                const i = arrayStars.indexOf(this);
                arrayStars.splice(i, 1);
                arrayStars.push(new Star(undefined, canvas!.height + 5));
            }
        }
        let stars: Star[] = [];
        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            window.addEventListener('resize', () => {
                if (canvas) {
                    canvas.width = window.innerWidth;
                    canvas.height = window.innerHeight;
                    stars = [];
                    init();
                }
            });


            if (c) {
                const bg = c.createRadialGradient(canvas.width / 2, canvas.height * 3, canvas.height, canvas.width / 2, canvas.height, canvas.height * 4);
                bg.addColorStop(0, "#32465E");
                bg.addColorStop(0.4, "#000814");
                bg.addColorStop(0.8, "#000814");
                bg.addColorStop(1, "#000");
                let stars: Star[] = [];

                function init(): void {
                    for (let i = 0; i < n_stars; i++) {
                        stars.push(new Star());
                    }
                }

                function animate(): void {
                    requestAnimationFrame(animate);
                    c!.clearRect(0, 0, canvas!.width, canvas!.height);
                    c!.fillStyle = bg;
                    c!.fillRect(0, 0, canvas!.width, canvas!.height);
                    stars.forEach(s => s.update(stars));
                }

                init();
                animate();
            }
        }

    }
    animationSuares() {
        const ww: number = $(window).width() as number;
        const wh: number = $(window).height() as number;

        // Pure JavaScript random function ============
        function random(min: number, max: number): number {
            return Math.random() * (max - min) + min;
        }

        // Polyfill for requestAnimationFrame
        let requestAnimFrame = (function () {
            return window.requestAnimationFrame || function (callback: FrameRequestCallback) {
                window.setTimeout(callback, 1000 / 60);
            };
        })();

        function init(): void {
            // Initialization code here
        } // end init

        function animate(): void {
            requestAnimFrame(animate);
            draw();
        }

        function draw(): void {
            // Setup canvas environment
            const time: number = new Date().getTime() * 0.002;
            const color1: string = "rgba(8,18,32,0.3)";
            const color2: string = "rgba(12, 23, 38,0.4)";
            const color3: string = "rgba(24, 38, 55,0.4)";
            const canvas = document.getElementById("hero-canvas") as HTMLCanvasElement;
            const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();

            // Random float to be used in the sin & cos
            const randomX: number = random(0.2, 0.9);
            const randomY: number = random(0.1, 0.2);

            // sin & cos for the movement of the triangles in the canvas
            const rectX: number = Math.cos(time * 1) * 1.5 + randomX;
            const rectY: number = Math.sin(time * 1) * 1.5 + randomY;
            const rectX2: number = Math.cos(time * 0.7) * 3 + randomX;
            const rectY2: number = Math.sin(time * 0.7) * 3 + randomY;
            const rectX3: number = Math.cos(time * 1.4) * 4 + randomX;
            const rectY3: number = Math.sin(time * 1.4) * 4 + randomY;

            // Triangle gradient ==========================================
            const triangle_gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            triangle_gradient.addColorStop(0, color1);
            triangle_gradient.addColorStop(1, color2);

            const triangle_gradient2 = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            triangle_gradient2.addColorStop(0, color2);
            triangle_gradient2.addColorStop(1, color3);
            const triangle_gradient3 = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            triangle_gradient3.addColorStop(0, color3);
            triangle_gradient3.addColorStop(1, color1);

            // Triangle group 1 ===========================================
            // Triangle 1.1
            ctx.beginPath();
            ctx.moveTo(rectX2 + 220, rectY2 + 200);
            ctx.lineTo(rectX2 + 160, rectY2 + 110);
            ctx.lineTo(rectX2 - 126, rectY2 + 185);
            ctx.fillStyle = triangle_gradient;
            ctx.fill();

            // Triangle 1.2
            ctx.beginPath();
            ctx.moveTo(rectX - 50, rectY + 125);
            ctx.lineTo(rectX + 270, rectY + 225);
            ctx.lineTo(rectX - 50, rectY + 395);
            ctx.fillStyle = triangle_gradient;
            ctx.fill();

            // Triangle 1.3
            ctx.beginPath();
            ctx.moveTo(rectX3 + 140, rectY3 + 450);
            ctx.lineTo(rectX3 - 280, rectY3 + 310);
            ctx.lineTo(rectX3 + 225, rectY3 + 250);
            ctx.fillStyle = triangle_gradient;
            ctx.fill();

            // Triangle 1.4
            ctx.beginPath();
            ctx.moveTo(rectX2 + 220, rectY2 + 500);
            ctx.lineTo(rectX2 + 60, rectY2 + 410);
            ctx.lineTo(rectX2 - 126, rectY2 + 485);
            ctx.fillStyle = triangle_gradient2;
            ctx.fill();

            // Triangle 1.5
            ctx.beginPath();
            ctx.moveTo(rectX - 50, rectY + 425);
            ctx.lineTo(rectX + 270, rectY + 525);
            ctx.lineTo(rectX - 50, rectY + 695);
            ctx.fillStyle = triangle_gradient2;
            ctx.fill();

            // Triangle 1.6
            ctx.beginPath();
            ctx.moveTo(rectX3 + 140, rectY3 + 750);
            ctx.lineTo(rectX3 - 280, rectY3 + 610);
            ctx.lineTo(rectX3 + 225, rectY3 + 550);
            ctx.fillStyle = triangle_gradient2;
            ctx.fill();

            // Triangle 1.7
            ctx.beginPath();
            ctx.moveTo(rectX3 + 140, rectY3 + 1150);
            ctx.lineTo(rectX3 - 280, rectY3 + 950);
            ctx.lineTo(rectX3 + 225, rectY3 + 850);
            ctx.fillStyle = triangle_gradient3;
            ctx.fill();

            // Triangle 1.8
            ctx.beginPath();
            ctx.moveTo(rectX - 50, rectY + 725);
            ctx.lineTo(rectX + 270, rectY + 825);
            ctx.lineTo(rectX - 50, rectY + 995);
            ctx.fillStyle = triangle_gradient3;
            ctx.fill();


            // Triangle 1.9
            ctx.beginPath();
            ctx.moveTo(rectX2 + 220, rectY2 + 800);
            ctx.lineTo(rectX2 + 60, rectY2 + 710);
            ctx.lineTo(rectX2 - 126, rectY2 + 785);
            ctx.fillStyle = triangle_gradient3;
            ctx.fill();

            // Triangle 1.9.1

            ctx.beginPath();
            ctx.moveTo(rectX3 + 140, rectY3 + 1150);
            ctx.lineTo(rectX3 - 280, rectY3 + 910);
            ctx.lineTo(rectX3 + 225, rectY3 + 1000);
            ctx.fillStyle = triangle_gradient3;
            ctx.fill();

            // Triangle group 2 ===========================================
            // Triangle 2.1
            ctx.beginPath();
            ctx.moveTo(rectX + (canvas.width - 300), rectY + 60);
            ctx.lineTo(rectX + (canvas.width - 250), rectY + 150);
            ctx.lineTo(rectX + (canvas.width - 550), rectY + 100);
            ctx.fillStyle = triangle_gradient;
            ctx.fill();

            // Triangle 2.2
            ctx.beginPath();
            ctx.moveTo(rectX3 + (canvas.width - 270), rectY + 165);
            ctx.lineTo(rectX3 + (canvas.width - 300), rectY3 + 270);
            ctx.lineTo(rectX3 + (canvas.width - 230), rectY3 + 230);
            ctx.fillStyle = triangle_gradient;
            ctx.fill();

            // Triangle 2.3
            ctx.beginPath();
            ctx.moveTo(rectX2 + (canvas.width - 550), rectY + 120);
            ctx.lineTo(rectX2 + (canvas.width - 310), rectY2 + 160);
            ctx.lineTo(rectX2 + (canvas.width - 350), rectY2 + 270);
            ctx.fillStyle = triangle_gradient;
            ctx.fill();

            // // Triangle group 3 ===========================================
            // // Triangle 3.1
            // ctx.beginPath();
            // ctx.moveTo(rectX3 - 50, rectY3 + (canvas.height - 350));
            // ctx.lineTo(rectX3 + 350, rectY3 + (canvas.height - 220));
            // ctx.lineTo(rectX3 - 100, rectY3 + (canvas.height - 120));
            // ctx.fillStyle = triangle_gradient2;
            // ctx.fill();

            // // Triangle 3.2
            // ctx.beginPath();
            // ctx.moveTo(rectX + 100, rectY + (canvas.height - 380));
            // ctx.lineTo(rectX + 320, rectY + (canvas.height - 180));
            // ctx.lineTo(rectX - 275, rectY + (canvas.height + 150));
            // ctx.fillStyle = triangle_gradient2;
            // ctx.fill();

            // // Triangle 3.3
            // ctx.beginPath();
            // ctx.moveTo(rectX2 - 230, rectY2 + (canvas.height - 50));
            // ctx.lineTo(rectX2 + 215, rectY2 + (canvas.height - 110));
            // ctx.lineTo(rectX2 + 250, rectY2 + (canvas.height + 130));
            // ctx.fillStyle = triangle_gradient2;
            // ctx.fill();

            // Triangle group 4 ===========================================
            // Triangle 4.1
            ctx.beginPath();
            ctx.moveTo(rectX3 + (canvas.width - 80), rectY3 + (canvas.height - 400));
            ctx.lineTo(rectX3 + (canvas.width - 40), rectY3 + (canvas.height - 250));
            ctx.lineTo(rectX3 + (canvas.width - 320), rectY3 + (canvas.height - 385));
            ctx.fillStyle = triangle_gradient;
            ctx.fill();

            // Triangle 4.2
            ctx.beginPath();
            ctx.moveTo(rectX + (canvas.width - 40), rectY3 + (canvas.height - 240));
            ctx.lineTo(rectX + (canvas.width - 29), rectY + (canvas.height - 170));
            ctx.lineTo(rectX + (canvas.width - 250), rectY + (canvas.height - 155));
            ctx.fillStyle = triangle_gradient;
            ctx.fill();

            ctx.shadowOffsetX = 10; // Desplazamiento en el eje X de la sombra
            ctx.shadowOffsetY = 10; // Desplazamiento en el eje Y de la sombra
            ctx.shadowBlur = 5; // Desenfoque de la sombra
            ctx.shadowColor = "rgba(0, 0, 0, 0.5)"; // Color de la sombra (negro con 50% de opacidad)

            // Triangle 4.3
            ctx.beginPath();
            ctx.moveTo(rectX2 + (canvas.width - 300), rectY3 + (canvas.height - 350));
            ctx.lineTo(rectX2 + (canvas.width - 80), rectY2 + (canvas.height - 245));
            ctx.lineTo(rectX2 + (canvas.width - 260), rectY2 + (canvas.height - 180));
            ctx.fillStyle = triangle_gradient;
            ctx.fill();

            ctx.restore();

        } // end function draw

        // Call init
        init();
        animate();

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
        this.animationStars();
        this.animationSuares();
    }
}
