import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MrlsDistListComponent } from './mrls-dist-list.component';

describe('MrlsDistListComponent', () => {
  let component: MrlsDistListComponent;
  let fixture: ComponentFixture<MrlsDistListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MrlsDistListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MrlsDistListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
