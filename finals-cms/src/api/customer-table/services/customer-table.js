'use strict';

/**
 * customer-table service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::customer-table.customer-table');
