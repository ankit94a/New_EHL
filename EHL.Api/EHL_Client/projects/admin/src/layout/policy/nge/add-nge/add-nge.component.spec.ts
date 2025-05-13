import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNgeComponent } from './add-nge.component';

describe('AddNgeComponent', () => {
  let component: AddNgeComponent;
  let fixture: ComponentFixture<AddNgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNgeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
