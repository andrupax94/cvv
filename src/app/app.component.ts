import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SessionService } from '../factory/session.service';
import { CargaService } from 'src/factory/carga.service';
import { NavigationEnd, Router } from '@angular/router';
import { authGuard } from '../guards/auth.guard';
import { filter } from 'rxjs/operators';
import { ChangeColorService } from '../factory/change-color.service';
import { FactoryService } from '../factory/factory.module';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent {

    constructor(
        private auth: authGuard,
        private session: SessionService,
        private carga: CargaService,
        private router: Router,
        private color: ChangeColorService,
        private andres: FactoryService
    ) {
        this.user = { state: false, data: [], mensaje: '' };
        this.carga.to('body');
        this.currentPath = this.router.url;

        this.carga.play();
    }
    title = 'cvv';
    private canvasStars: HTMLCanvasElement | null = null;
    public currentPath = '';
    public user: any;
    public pageFilter: string = "none";
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

    getColorAtPosition = (x: number, y: number, c: any): string => {
        const imageData = c!.getImageData(x, y, 1, 1).data;
        const [r, g, b, a] = imageData;
        return `rgba(${r}, ${g}, ${b}, ${a / 255})`;
    };

    sampleGradientColors(canvas: HTMLCanvasElement) {
        // Posiciones para tomar muestras: centro y bordes
        const centerX = canvas!.width / 2;
        const centerY = canvas!.height / 2;
        const c = canvas!.getContext('2d');
        const topLeftColor = this.getColorAtPosition(0, 0, c);
        const topRightColor = this.getColorAtPosition(canvas!.width - 1, 0, c);
        const bottomLeftColor = this.getColorAtPosition(0, canvas!.height - 1, c);
        const bottomRightColor = this.getColorAtPosition(canvas!.width - 1, canvas!.height - 1, c);
        const centerColor = this.getColorAtPosition(centerX, centerY, c);
        return {
            topLeftColor: topLeftColor,
            topRightColor: topRightColor,
            bottomLeftColor: bottomLeftColor,
            bottomRightColor: bottomRightColor,
            centerColor: centerColor
        }
    };

    animationStars() {

        const n_stars: number = 150;
        const colors: string[] = ['#176ab6', '#fb9b39'];
        for (let i = 0; i < 98; i++) {
            colors.push('#fff');
        }

        const canvas: HTMLCanvasElement | null = document.querySelector('canvas');
        this.canvasStars = canvas;
        canvas!.style.background = '#000';
        const c = canvas!.getContext('2d');


        // Debes llamar a esta función después de que el gradiente se haya dibujado


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

            const drawBG = (quaternary: string, quinary: string, senary: string) => {
                const bg = c!.createRadialGradient(canvas!.width / 2, canvas!.height * 3, canvas!.height, canvas!.width / 2, canvas!.height, canvas!.height * 4);
                bg.addColorStop(0, quaternary);
                bg.addColorStop(0.4, quinary);
                bg.addColorStop(0.8, quinary);
                bg.addColorStop(1, senary);
                return bg;
            }

            if (c) {
                let currentColor = { quaternary: this.color.quaternary, quinary: this.color.quinary, senary: this.color.senary };
                let targetColor = { quaternary: this.color.quaternary, quinary: this.color.quinary, senary: this.color.senary };
                let transitionProgress = 0;

                const interpolateColor = (startColor: string, endColor: string, factor: number) => {
                    const start = parseInt(startColor.slice(1), 16);
                    const end = parseInt(endColor.slice(1), 16);

                    const rStart = (start >> 16) & 255;
                    const gStart = (start >> 8) & 255;
                    const bStart = start & 255;

                    const rEnd = (end >> 16) & 255;
                    const gEnd = (end >> 8) & 255;
                    const bEnd = end & 255;

                    const r = Math.round(rStart + (rEnd - rStart) * factor);
                    const g = Math.round(gStart + (gEnd - gStart) * factor);
                    const b = Math.round(bStart + (bEnd - bStart) * factor);

                    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
                };

                const animate = (): void => {
                    requestAnimationFrame(animate);

                    if (this.color.changeSW) {

                        this.color.changeSW = false;
                        targetColor = { quaternary: this.color.quaternary, quinary: this.color.quinary, senary: this.color.senary };
                        transitionProgress = 0;
                    }

                    transitionProgress = Math.min(transitionProgress + 0.01, 1);

                    currentColor.quaternary = interpolateColor(currentColor.quaternary, targetColor.quaternary, transitionProgress);
                    currentColor.quinary = interpolateColor(currentColor.quinary, targetColor.quinary, transitionProgress);
                    currentColor.senary = interpolateColor(currentColor.senary, targetColor.senary, transitionProgress);
                    this.color.quaternary = currentColor.quaternary;
                    this.color.quinary = currentColor.quinary;
                    this.color.senary = currentColor.senary;
                    const bg = drawBG(currentColor.quaternary, currentColor.quinary, currentColor.senary);

                    c!.clearRect(0, 0, canvas!.width, canvas!.height);
                    c!.fillStyle = bg;
                    c!.fillRect(0, 0, canvas!.width, canvas!.height);
                    stars.forEach(s => s.update(stars));
                }

                init();
                animate();
            }
        }

        function init(): void {
            for (let i = 0; i < n_stars; i++) {
                stars.push(new Star());
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

        const draw = (): void => {
            // Setup canvas environment
            const time: number = new Date().getTime() * 0.002;
            const colors = this.sampleGradientColors(this.canvasStars!);
            const color1: string = 'rgba(3, 12, 25,0.3)';
            const color2: string = 'rgba(11, 22, 37,0.3)';
            const color3: string = 'rgba(22, 35, 53,0.3)';
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
            ctx.moveTo(rectX + (canvas.width - 285), rectY + 60);
            ctx.lineTo(rectX + (canvas.width - 250), rectY + 140);
            ctx.lineTo(rectX + (canvas.width - 500), rectY + 75);
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
        setTimeout(() => {
            // this.color.changeColor('skyblue', undefined, undefined, '#49c111');

        }, 1000);
    }
}
