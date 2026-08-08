import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishedOverlay } from './published-overlay';

describe('PublishedOverlay', () => {
  let component: PublishedOverlay;
  let fixture: ComponentFixture<PublishedOverlay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublishedOverlay],
    }).compileComponents();

    fixture = TestBed.createComponent(PublishedOverlay);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
