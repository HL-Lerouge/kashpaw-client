import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VericationPage } from './verication.page';

describe('VericationPage', () => {
  let component: VericationPage;
  let fixture: ComponentFixture<VericationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VericationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
