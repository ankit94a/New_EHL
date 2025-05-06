import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingPageUpdateComponent } from './landing-page-update.component';

describe('LandingPageUpdateComponent', () => {
  let component: LandingPageUpdateComponent;
  let fixture: ComponentFixture<LandingPageUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingPageUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandingPageUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
