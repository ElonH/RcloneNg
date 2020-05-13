import { Generic, DataFlowNode } from './generic';
import { Observable, of } from 'rxjs';
import { AjaxResponse } from 'rxjs/ajax';

class TestGeneric extends Generic {
  cmd = 'test';
  params = {};
  cacheSupport = true;
  protected prerequest(): Observable<DataFlowNode> {
    return of([{ pre: 1 }, null]);
  }
  protected request(x: DataFlowNode): Observable<AjaxResponse> {
    return of({} as AjaxResponse);
  }
  protected generateModule(
    current: DataFlowNode,
    previous: DataFlowNode
  ): DataFlowNode {
    return [{ pre: previous[0]['pre'], cur: 2 }, null];
  }
}

describe('Generic', () => {
  var g: TestGeneric;
  beforeEach(() => {
    g = new TestGeneric();
    g.deploy();
  });

  it('should create an instance', () => {
    expect(g).toBeTruthy();
  });
});
