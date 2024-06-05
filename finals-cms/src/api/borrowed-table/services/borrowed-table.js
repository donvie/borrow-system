'use strict';

/**
 * borrowed-table service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::borrowed-table.borrowed-table');
