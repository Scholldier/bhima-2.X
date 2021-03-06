/* global element, by */

const chai = require('chai');

const { expect } = chai;

const FU = require('../shared/FormUtils');
const helpers = require('../shared/helpers');

helpers.configure(chai);

describe('Provinces Management', () => {

  const path = '#!/locations/province';

  before(() => helpers.navigate(path));

  const province = {
    country : 'République Démocratique du Congo',
    name : 'New Province',
  };

  it('creates a new province', () => {
    // switch to the create form
    FU.buttons.create();

    FU.select('ProvinceCtrl.province.country_uuid', province.country);
    FU.input('ProvinceCtrl.province.name', province.name);

    // submit the page to the server
    FU.buttons.submit();

    // expect a nice validation message
    FU.exists(by.id('create_success'), true);
  });

  it('edits a province', () => {
    $(`[data-province-name="${province.name}"]`).click();

    FU.select('ProvinceCtrl.province.country_uuid', province.country);
    FU.input('ProvinceCtrl.province.name', 'Province Update');

    element(by.id('change_province')).click();

    // make sure the success message appears
    FU.exists(by.id('update_success'), true);
  });

  it('blocks invalid form submission with relevant error classes', () => {
    // switch to the create form
    FU.buttons.create();

    // verify form has not been successfully submitted
    expect(helpers.getCurrentPath()).to.eventually.equal(path);

    // submit the page to the server
    FU.buttons.submit();

    // the following fields should be required
    FU.validation.error('ProvinceCtrl.province.country_uuid');
    FU.validation.error('ProvinceCtrl.province.name');
  });
});
