import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ruta3Component } from './ruta3.component';

describe('Ruta3Component', () => {
  let component: Ruta3Component;
  let fixture: ComponentFixture<Ruta3Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Ruta3Component]
    });
    fixture = TestBed.createComponent(Ruta3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
