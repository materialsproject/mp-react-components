import { getPeriodicSelectionStore } from './table-store';
import { take } from 'rxjs/operators';
import { mapArrayToBooleanObject } from '../../data-entry/utils';
import { VALID_ELEMENTS } from '../../data-entry/MaterialsInput/utils';

//NOTE(chab) as the component is not mounted, you need to subscribe before having a value emitted

const enabledElements = { E: true };
const disabledElements = { Cl: true };
const allElements = mapArrayToBooleanObject(VALID_ELEMENTS);

const { actions: tableStateStore, observable } = getPeriodicSelectionStore();

describe('Table store', () => {
  it('should be correctly cleared', (done) => {
    checkObservableNotification({}, {}, done);
    tableStateStore.clear();
  });

  it('should be correctly initialized', (done) => {
    defaultReset();
    checkObservableNotification(enabledElements, disabledElements, done);
  });

  it('should toggle enabled elements correctly', (done) => {
    defaultReset();
    tableStateStore.toggleEnabledElement('E');
    tableStateStore.toggleEnabledElement('H');

    checkObservableNotification({ H: true }, { ...disabledElements }, done);
  });

  it('should add an enabled elements correctly', (done) => {
    defaultReset();
    tableStateStore.addEnabledElement('Na');
    checkObservableNotification({ ...enabledElements, Na: true }, { ...disabledElements }, done);
  });

  it('should add a disabled elements correctly', (done) => {
    defaultReset();
    tableStateStore.addDisabledElement('Na');
    checkObservableNotification({ ...enabledElements }, { ...disabledElements, Na: true }, done);
  });

  it('should remove an enabled elements correctly', (done) => {
    defaultReset();
    tableStateStore.removeEnabledElement('Na');
    checkObservableNotification({ ...enabledElements }, { ...disabledElements }, done);
  });

  it('should remove a disabled elements correctly', (done) => {
    defaultReset();
    tableStateStore.removeDisabledElement('Na');
    checkObservableNotification({ ...enabledElements }, { ...disabledElements }, done);
  });

  it('should set enabled elements correctly', (done) => {
    defaultReset();
    tableStateStore.setDisabledElements({ O: true });
    checkObservableNotification({ ...enabledElements }, { O: true }, done);
  });

  it('should set disabled elements correctly', (done) => {
    defaultReset();
    tableStateStore.setEnabledElements({ O: true });
    checkObservableNotification({ O: true }, { ...disabledElements }, done);
  });
  it('if max elements is set to one, it should only allow one selected element and disable all other elements', (done) => {
    resetState({}, {});
    tableStateStore.setMaxSelectionLimit(1);
    tableStateStore.toggleEnabledElement('H');
    tableStateStore.toggleEnabledElement('Fe');
    const disabled = { ...allElements };
    delete disabled['H'];
    checkObservableNotification({ H: true }, disabled, done);
  });
  it('if max elements is set to two, it should only allow two selected element and disable all other elements', (done) => {
    resetState({}, {});
    tableStateStore.setMaxSelectionLimit(2);
    tableStateStore.toggleEnabledElement('H');
    tableStateStore.toggleEnabledElement('Fe');
    tableStateStore.toggleEnabledElement('O');
    const disabled = { ...allElements };
    delete disabled['H'];
    delete disabled['Fe'];
    checkObservableNotification({ H: true, Fe: true }, disabled, done);
  });

  //TODO(chab) check case when we switch the maximum afterwards once it's implemented
  //TODO(chab) write unit tests to prove that 2 stores are wholly separated
  //TODO(chab) test the forwardOuterChange flag
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

function resetState(
  disabledElements = {},
  enabledElements = {},
  hiddenElements = {},
  detailedElement = null,
  forwardOuterChange = true
) {
  tableStateStore.init({
    disabledElements,
    enabledElements,
    hiddenElements,
    detailedElement,
    forwardOuterChange,
    lastAction: {} as any
  });
}
