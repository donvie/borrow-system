'use strict';

/**
 * product-table service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::product-table.product-table');
