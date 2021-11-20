import React, { useState, useEffect } from 'react';
import {
  Column,
  ConditionalRowStyle,
  FilterGroup
} from '../components/data-display/SearchUI/types';

/**
 * Because Storybook can only auto-generate ArgTables for components (not types or interfaces),
 * any type or interface that we want to document somewhere inside another story should be added
 * to this page as the prop type for a dummy component.
 *
 * This allows us to generate ArgTables for types or interfaces using the following syntax:
 * <ArgsTable of={ColumnInterface} />
 */

export const ColumnInterface: React.FC<Column> = (props) => {
  return <></>;
};

export const ConditionalRowStyleInterface: React.FC<ConditionalRowStyle> = (props) => {
  return <></>;
};
