import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevMnComponent } from './rev-mn.component';

describe('RevMnComponent', () => {
  let component: RevMnComponent;
  let fixture: ComponentFixture<RevMnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RevMnComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RevMnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
