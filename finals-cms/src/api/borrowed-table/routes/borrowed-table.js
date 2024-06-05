'use strict';

/**
 * borrowed-table router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::borrowed-table.borrowed-table');
