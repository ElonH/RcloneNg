/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CoreStatsService } from './core-stats.service';

describe('Service: CoreStats', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CoreStatsService]
    });
  });

  it('should ...', inject([CoreStatsService], (service: CoreStatsService) => {
    expect(service).toBeTruthy();
  }));
});
