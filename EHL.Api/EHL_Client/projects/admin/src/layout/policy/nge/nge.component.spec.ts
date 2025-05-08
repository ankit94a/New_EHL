import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgeComponent } from './nge.component';

describe('NgeComponent', () => {
  let component: NgeComponent;
  let fixture: ComponentFixture<NgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
