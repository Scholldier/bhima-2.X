angular.module('bhima.services')
.service('PatientInvoiceItemService', PatientInvoiceItemService);

PatientInvoiceItemService.$inject = [ 'uuid' ];

/**
 * @class PatientInvoiceItemService
 *
 * @description
 * This class implements the defaults for a patient invoice item.  The class is
 * instantiated with every row of the Patient Invoice module's grid.  It
 * implements the following convenience methods:
 *  1. validate() - sets the `_valid` and `_invalid` flags on the row
 *  2. configure() - sets up the row's inventory item reference
 *  3. applyPriceList() - apply's the price list to the row
 */
function PatientInvoiceItemService(uuid) {

  /**
   * @constructor
   *
   * @description
   * Sets up the default values for the invoice item.  Optionally takes in an
   * inventory item to preconfigure the invoice item, otherwise, it will be
   * set later.
   *
   * @param {Object} inventoryItem - an inventory item to use as the inventory
   *   line.
   */
  function PatientInvoiceItem(inventoryItem) {

    // defaults
    this.uuid = uuid();

    // instance variable tracks if the row is valid
    this._valid = false;

    // instance variable tracks if the row has an inventory uuid
    this._initialised = false;

    // instance variable to track if a price list has altered the row's price.
    this._hasPriceList = false;

    // if inventoryItem exists, call the configure method right away
    if (inventoryItem) {
      this.configure(inventoryItem);
    }
  }

  /**
   * @method validate
   *
   * @description
   * Validation for single PatientInvoiceItem.  This is a prototype method since
   * we are expecting to create potentially many items in an invoice.
   */
  PatientInvoiceItem.prototype.validate = function validate() {
    var item = this;

    // ensure the numbers are valid in the invoice
    var hasValidNumbers =
      angular.isNumber(item.quantity) &&
      angular.isNumber(item.transaction_price) &&
      item.quantity > 0 &&
      item.transaction_price >= 0;

    // the item is only initialised if it has an inventory item
    item._initialised = angular.isDefined(item.inventory_uuid);

    // alias both valid and invalid for easy reading
    item._valid = item._initialised && hasValidNumbers;
    item._invalid = !item._valid;
  };

  /**
   * @method configure
   *
   * @description
   * This method configures the PatientInvoiceItem with an inventory item.
   *
   * @param {Object} inventoryItem - an inventory item to copy into the view
   */
  PatientInvoiceItem.prototype.configure = function configure(inventoryItem) {
    this.quantity = 1;
    this.code = inventoryItem.code;
    this.description = inventoryItem.label;
    this.transaction_price = inventoryItem.price;
    this.inventory_price = inventoryItem.price;
    this.inventory_uuid = inventoryItem.uuid;

    // rest eh validation flags.
    this.validate();
  };


  /**
   * @method applyPriceList
   *
   * @description
   * This method uses a price list entry to set a new price and toggle the price
   * list attribute on the instance
   *
   * @param {Object} priceListItem - a price list item from the database
   */
  PatientInvoiceItem.prototype.applyPriceList = function applyPriceList(priceListItem) {
    this._hasPriceList = true;

    // if the price list is a percentage of the cost, calculate that percentage and
    // apply to the transaction_price
    if (priceListItem.is_percentage ) {
      this.transaction_price += (this.transaction_price / 100) * priceListItem.value;

    // otherwise, we are setting a new price manually. Simply replace the
    // transaction_price with the new price.
    } else {
      this.transaction_price = priceListItem.value;
    }

    this.validate();
  };

  return PatientInvoiceItem;
}
