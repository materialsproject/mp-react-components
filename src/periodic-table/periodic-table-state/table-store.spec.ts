import { tableStateStore, observable } from "./table-store";
import { take } from "rxjs/operators";

//NOTE(chab) as the component is not mounted, you need to subscribe before having a value emitted

const enabledElements = { 'E': true}, disabledElements = {'Cl': true};

describe("Store", () => {
  it("should be correctly cleared", done => {
    observable.pipe(take(1)).subscribe((n) => {
      expect(n).toHaveProperty('disabledElements', {});
      expect(n).toHaveProperty('enabledElements', {});
      done();
    });
    tableStateStore.clear();
  });

  it("should be correctly initialized", done => {
    defaultReset();
    observable.pipe(take(1)).subscribe((n) => {
      expect(n).toHaveProperty('disabledElements', disabledElements);
      expect(n).toHaveProperty('enabledElements', enabledElements);
      done();
    });
  });

  it('should toggle enabled elements correctly', done => {
    defaultReset();
    tableStateStore.toggleEnabledElement('E');
    tableStateStore.toggleEnabledElement('H');
    observable.pipe(take(1)).subscribe((n) => {
      console.log('t', n, disabledElements, enabledElements);
      expect(n).toHaveProperty('disabledElements', {...disabledElements});
      expect(n).toHaveProperty('enabledElements', {...enabledElements, E:false, H:true});
      done();
    });
  });

  it('should add an enabled elements correctly', done => {
    defaultReset();
    tableStateStore.addEnabledElement('Na');
    observable.pipe(take(1)).subscribe((n) => {
      expect(n).toHaveProperty('disabledElements', {...disabledElements});
      expect(n).toHaveProperty('enabledElements', {...enabledElements, Na:true});
      done();
    });
  });

  it('should add a disabled elements correctly', done => {
    defaultReset();
    tableStateStore.addDisabledElement('Na');
    observable.pipe(take(1)).subscribe((n) => {
      expect(n).toHaveProperty('disabledElements', {...disabledElements, Na:true});
      expect(n).toHaveProperty('enabledElements', {...enabledElements});
      done();
    });
  });
});

function defaultReset() {
  resetState(disabledElements, enabledElements);
}

function resetState(disabledElements = {}, enabledElements = {}) {
  tableStateStore.init({disabledElements, enabledElements});
}
