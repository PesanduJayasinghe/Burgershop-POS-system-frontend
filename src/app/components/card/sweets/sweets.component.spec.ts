import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SweetsComponent } from './sweets.component';

describe('SweetsComponent', () => {
  let component: SweetsComponent;
  let fixture: ComponentFixture<SweetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SweetsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SweetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
