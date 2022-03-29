/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import type { TypeServiceSetup } from '../services/type_service';
import { createBarChartConfig } from './bar_chart';
import { createPieChartConfig } from './pie_chart';

export function registerDefaultTypes(typeServieSetup: TypeServiceSetup) {
  const visualizationTypes = [createBarChartConfig, createPieChartConfig];

  visualizationTypes.forEach((createTypeConfig) => {
    typeServieSetup.createVisualizationType(createTypeConfig());
  });
}
