import { tableStateStore, observable } from "./table-store";
import { take } from "rxjs/operators";

//NOTE(chab) as the component is not mounted, you need to subscribe before having a value emitted

const enabledElements = { 'E': true}, disabledElements = {'Cl': true};

describe("Table store", () => {
  it("should be correctly cleared", done => {
    checkObservableNotification({}, {}, done);
    tableStateStore.clear();
  });

  it("should be correctly initialized", done => {
    defaultReset();
    checkObservableNotification(enabledElements, disabledElements, done);
  });

  it('should toggle enabled elements correctly', done => {
    defaultReset();
    tableStateStore.toggleEnabledElement('E');
    tableStateStore.toggleEnabledElement('H');
    checkObservableNotification({...enabledElements,  E:false, H:true}, {...disabledElements}, done);
  });

  it('should add an enabled elements correctly', done => {
    defaultReset();
    tableStateStore.addEnabledElement('Na');
    checkObservableNotification({...enabledElements, Na:true}, {...disabledElements}, done);
  });

  it('should add a disabled elements correctly', done => {
    defaultReset();
    tableStateStore.addDisabledElement('Na');
    checkObservableNotification({...enabledElements}, {...disabledElements, Na: true}, done);
  });

  it('should remove an enabled elements correctly', done => {
    defaultReset();
    tableStateStore.removeEnabledElement('Na');
    checkObservableNotification({...enabledElements, Na:false}, {...disabledElements}, done);
  });

  it('should remove a disabled elements correctly', done => {
    defaultReset();
    tableStateStore.removeDisabledElement('Na');
    checkObservableNotification({...enabledElements}, {...disabledElements, Na: false}, done);
  });

  it('should set enabled elements correctly', done => {
    defaultReset();
    tableStateStore.setDisabledElements({Pl: false, O: true});
    checkObservableNotification({...enabledElements}, {Pl: false, O: true}, done);
  });

  it('should set disabled elements correctly', done => {
    defaultReset();
    tableStateStore.setEnabledElements({Pl: false, O: true});
    checkObservableNotification({Pl: false, O: true}, {...disabledElements}, done);
  });

});

function checkObservableNotification(enabled: any, disabled: any, done: jest.DoneCallback) {
  observable.pipe(take(1)).subscribe((n) => {
    expect(n).toHaveProperty('disabledElements', disabled);
    expect(n).toHaveProperty('enabledElements', enabled);
    done();
  });
}

function defaultReset() {
  resetState(disabledElements, enabledElements);
}

function resetState(disabledElements = {}, enabledElements = {}) {
  tableStateStore.init({disabledElements, enabledElements});
}
